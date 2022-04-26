import logging
import random
import string

import pymysql

try:
    from helpers import rds_config, http_response
except ImportError:  # for testing inside different root
    from ..helpers import rds_config, http_response

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
            admin_id = ''.join(random.choice(
                string.ascii_letters + string.digits) for _ in range(8))
            try:
                cur.execute(
                    """insert into instances (adminID,expiration,shuffled,uniqueInMul) 
                    values(%s,DATE_ADD(SYSDATE(), INTERVAL 30 DAY),false,true)""", (admin_id))
                conn.commit()
            except pymysql.MySQLError:
                logger.info("INFO: ID already there")
                i += 1
                continue
            break
        if i >= 20:
            logger.info("ERROR: Could not find valid id")
            return http_response.response(508, "Could not assign id to instance")

    return http_response.response(200, {
        "adminID": str(admin_id)
    })
