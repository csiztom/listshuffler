import logging
import json
import os
import random

try:
    from helpers import rds_config, params, shuffle
except:  # for testing inside different root
    from ..helpers import rds_config, params, shuffle

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    """
    This shuffles the lists
    """
    parameters = params.get_params(event, 'adminID')
    if type(parameters) is dict: return parameters
    [adminId] = parameters
    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select adminID from public.instances where adminId=%s", (adminId))
        if (cur.fetchone() == None):
            return {
                "statusCode": 404,
                "headers": {
                    "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
                },
            }

    try: 
        lists= shuffle.shuffle(adminId, conn)
    except: 
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
            },
        }

    return {
        "statusCode": 200 if len(lists) > 0 else 404,
        "headers": {
            "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
        }
    }
