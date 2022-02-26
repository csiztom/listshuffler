import sys
import logging
import json
import random

try:
    from helpers import rds_config
except: #for testing inside different root
    from ..helpers import rds_config

#logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    """
    This function creates an instance to add lists to
    """
    conn = rds_config.connect_rds()
    adminId = ""
    with conn.cursor() as cur:
        unique = False
        i = 0
        while not unique and i < 20:
            adminId = str(random.randint(100000,999999))
            logger.info("Trying %s" %(adminId))
            cur.execute("select * from instances where adminID='%s'" %(adminId))
            if cur.rowcount == 0:
                unique = True
            i += 1
        if not unique:
            logger.error("ERROR: Could not find random id")
            sys.exit()
        cur.execute("insert into instances (adminID,expiration) values('%s',DATE_ADD(SYSDATE(), INTERVAL 1 DAY))" %(adminId))
        conn.commit()

    return {
        "statusCode": 200,
        "body": json.dumps({
            "adminID": str(adminId)
        }),
    }