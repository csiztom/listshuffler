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
    This function gets a list item
    """
    parameters = params.get_params(event, 'listItemID')
    if type(parameters) is dict: return parameters
    [listItemId] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute("select listItem from listItems where listItemId=%s",
                    (listItemId))
        result = cur.fetchone()
        cur.execute("""select listItemID, listItem
            from public.pairs join public.listItems
            on toListItemID=listItemID
            where fromListItemID=%s""",
            (listItemId))
        pairs = {val[0]: val[1] for val in cur.fetchall()}

    return {
        "statusCode": 200 if result != None else 404,
        "headers": {
            "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
        },
        "body": json.dumps({
            'listItemID': listItemId,
            'listItem': result[0],
            'pairs': pairs,
        }) if result != None else '',
    }
