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
    This function creates an instance to add lists to
    """
    try:
        adminId = json.loads(event['body'])['adminID']
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
        pass

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
        }
    }
