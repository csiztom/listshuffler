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
    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        i = 0
        while i < 20:
            adminId = ''.join(random.choice(
                string.ascii_letters + string.digits) for _ in range(8))
            try:
                cur.execute(
                    """insert into instances (adminID,expiration,shuffled) 
                    values(%s,DATE_ADD(SYSDATE(), INTERVAL 1 DAY),false)""", (adminId))
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
            "adminID": str(adminId)
        }),
    }
