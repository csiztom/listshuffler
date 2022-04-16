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
    This function patches a listitem
    """
    parameters = params.get_params(event, 'listItemID', 'listItem')
    if type(parameters) is dict: return parameters
    [listItemId, listItem] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select listItemID from public.listitems where listItemID=%s", (listItemId))
        if (cur.fetchone() == None):
            return {
                "statusCode": 404,
                "headers": {
                    "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
                },
            }
        try:
            cur.execute("update listItems set listItem=%s where listItemID=%s", (
                listItem, listItemId))
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
