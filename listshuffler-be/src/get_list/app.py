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
    This function gets a list
    """
    try:
        listId = event['queryStringParameters']['listID']
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
        cur.execute("select * from lists where listId=%s", (listId))
        result = cur.fetchone()

    return {
        "statusCode": 200 if result != None else 404,
        "headers": {
            "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
        },
        "body": json.dumps({
            'adminID': result[0],
            'listID': result[1],
            'listName': result[2],
            'muliplicity': result[3],
        }),
    }
