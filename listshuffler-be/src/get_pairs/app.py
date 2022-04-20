import logging
import json
import os

try:
    from helpers import rds_config, params
except:  # for testing inside different root
    from ..helpers import rds_config, params

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
    This function gets the pairs
    """
    parameters = params.get_params(event, 'adminID')
    if type(parameters) is dict:
        return parameters
    [adminId] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select adminID from public.instances where adminId=%s", (adminId))
        if (cur.fetchone() == None):
            return {
                "statusCode": 404,
                "headers": {
                    "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
                },
            }
        cur.execute(
            """select listItemID1, listItemID2 
            from public.pairs join (public.lists natural join public.listItems) 
            on listItemID1=listItemID where adminID=%s""", (adminId))
        result = {}
        for res in cur.fetchall():
            if res[0] not in result:
                result[res[0]] = []
            result[res[0]].append(res[1])

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
        },
        "body": json.dumps({'pairs': result, }),
    }
