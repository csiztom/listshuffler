# config file containing credentials for RDS MySQL instance
import os
import logging
import sys
import pymysql

db_host = os.environ['LS_RDS_ENDPOINT']
db_username = os.environ['LS_RDS_USER']
db_password = os.environ['LS_RDS_PWD']
db_name = "public"


def connect_rds():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    try:
        conn = pymysql.connect(host=db_host, user=db_username,
                               passwd=db_password, db=db_name, connect_timeout=5)
    except pymysql.MySQLError as e:
        logger.error(
            "ERROR: Unexpected error: Could not connect to MySQL instance.")
        logger.error(e)
        sys.exit()

    logger.info("SUCCESS: Connection to RDS MySQL instance succeeded")
    return conn
