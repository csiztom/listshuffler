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
    This function gets an instance
    """
    parameters = params.get_params(event, 'adminID')
    if type(parameters) is dict: return parameters
    [adminId] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select adminID, shuffled, shuffledID, preset from public.instances where adminId=%s", (adminId))
        instance = cur.fetchone()
        if (instance == None):
            return {
                "statusCode": 404,
                "headers": {
                    "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
                },
            }
        cur.execute("""select l.listID, listName, multiplicity 
            from public.instances i inner join public.lists l 
            on i.adminID=l.adminID where i.adminId=%s""",
                    (adminId))
        result = list(map(lambda tup: {
            'listID': tup[0],
            'listName': tup[1],
            'multiplicity': tup[2],
        }, cur.fetchall()))
        for ind, val in enumerate(result):
            cur.execute("""select listItem, listItemID 
                from public.lists l inner join public.listItems li 
                on li.listID=l.listID where li.listID=%s""",
                        (val['listID']))
            result[ind]['listItems'] = list(map(lambda tup: {
                'listItemID': tup[1],
                'listItem': tup[0],
            }, cur.fetchall()))

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
        },
        "body": json.dumps({'lists': result, 'shuffled': instance[1], 'shuffledID': instance[2], 'preset': instance[3]}),
    }
