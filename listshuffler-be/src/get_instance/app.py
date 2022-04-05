import logging
import json
import os

try:
    from helpers import rds_config
except:  # for testing inside different root
    from ..helpers import rds_config

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
    This function gets an instance
    """
    try:
        adminId = event['queryStringParameters']['adminID']
    except:
        return {
            "statusCode": 422,
            "headers": {
                "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
            },
            "body": "Missing parameter",
        }
    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute("select l.listID, listName, multiplicity from public.instances i inner join public.lists l on i.adminID=l.adminID where i.adminId=%s",
                    (adminId))
        result = list(map(lambda tup: {
            'listID': tup[0],
            'listName': tup[1],
            'multiplicity': tup[2],
        }, cur.fetchall()))
        print(result)
        for ind, val in enumerate(result):
            cur.execute("select listItem, listItemID from public.lists l inner join public.listItems li on li.listID=l.listID where li.listID=%s", 
                        (val['listID']))
            result[ind]['listItems'] = list(map(lambda tup: {
                'listItemID': tup[1],
                'listItem': tup[0],
            }, cur.fetchall()))

    return {
        "statusCode": 200 if result != None else 404,
        "headers": {
            "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
        },
        "body": json.dumps({'lists': result}),
    }
