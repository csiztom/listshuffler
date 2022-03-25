import sys
import logging
import json
import random
import os
import string

try:
    from helpers import rds_config
except:  # for testing inside different root
    from ..helpers import rds_config

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
    This function creates a listitem
    """
    try:
        listId = event['queryStringParameters']['listID']
        listItem = event['queryStringParameters']['listItem']
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
        i = 0
        while i < 20:
            listItemId = ''.join(random.choice(
                string.ascii_letters + string.digits) for _ in range(8))
            try:
                cur.execute("insert into listItems (listID,listItemID,listItem) values('%s','%s','%s')" % (
                    listId, listItemId, listItem))
                conn.commit()
            except:
                logging.info("INFO: ID already there")
                i += 1
                continue
            break
        if i >= 20:
            logger.error("ERROR: Could not find random id")
            sys.exit()

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
        },
        "body": json.dumps({
            "listItemID": listItemId
        }),
    }