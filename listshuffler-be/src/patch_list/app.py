import sys
import logging
import json
import random
import os
import string

try:
    from helpers import rds_config, params
except:  # for testing inside different root
    from ..helpers import rds_config, params

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
    This function patches a list
    """
    parameters = params.get_params(event, 'listID', 'listName', 'multiplicity')
    if type(parameters) is dict: return parameters
    [listId, listName, multiplicity] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        try:
            cur.execute("update lists set listName=%s, multiplicity=%s where listID=%s", (
                listName, multiplicity, listId))
            conn.commit()
        except:
            return {
                "statusCode": 400,
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
