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
    This function patches an instance
    """
    parameters = params.get_params(event, 'adminID')
    if type(parameters) is dict: return parameters
    [adminId] = parameters

    parameters = params.has_params(event, 'shuffleTime', 'uniqueInMul', 'shuffledID')
    shuffleTime = '"' + parameters['shuffleTime'] + '"' if parameters['shuffleTime'] != None else None
    unique = parameters['uniqueInMul']
    shuffledId = parameters['shuffledID']

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
            if shuffleTime != None: cur.execute("update instances set shuffleTime="+shuffleTime+", expiration=DATE_ADD("+shuffleTime+", INTERVAL 30 DAY) where adminID=%s", (
                adminId))
            if shuffledId != None: cur.execute("update instances set shuffledID=%s where adminID=%s", (
                shuffledId, adminId))
            if unique != None: cur.execute("update instances set uniqueInMul=%s where adminID=%s", (
                unique, adminId))
            conn.commit()
        except:
            return {
                "statusCode": 400,
                "headers": {
                    "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
                },
            }

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
        }
    }
