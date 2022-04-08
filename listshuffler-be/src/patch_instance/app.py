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
    This function creates an instance to add lists to
    """
    parameters = params.get_params(event, 'adminID', 'shuffledID')
    if type(parameters) is dict: return parameters
    [adminId, shuffledId] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        try:
            cur.execute("update instances set shuffledID=%s where adminID=%s", (
                shuffledId, adminId))
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
