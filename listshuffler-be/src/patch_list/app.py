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
    This function creates a list
    """
    try:
        listId = json.loads(event['body'])['listID']
        listName = json.loads(event['body'])['listName']
        multiplicity = json.loads(event['body'])['multiplicity']
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
        try:
            cur.execute("update lists set listName=%s, multiplicity=%s where listID=%s", (
                listName, multiplicity, listId))
            conn.commit()
        except:
            return {
                "statusCode": 422,
                "headers": {
                    "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
                }
            }

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
        }
    }
