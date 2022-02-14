import sys
import logging
import rds_config
import pymysql
import json
import uuid
#rds settings
rds_host  = rds_config.db_host
name = rds_config.db_username
password = rds_config.db_password
db_name = rds_config.db_name

logger = logging.getLogger()
logger.setLevel(logging.INFO)

try:
    conn = pymysql.connect(host=rds_host, user=name, passwd=password, db=db_name, connect_timeout=5)
except pymysql.MySQLError as e:
    logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
    logger.error(e)
    sys.exit()

logger.info("SUCCESS: Connection to RDS MySQL instance succeeded")
def handler(event, context):
    """
    This function creates an instance to add lists to
    """
    adminId = ""
    with conn.cursor() as cur:
        unique = False
        while not unique:
            adminId = uuid.uuid4()
            cur.execute("select * from instances where adminID='%s'" %(adminId))
            if cur.rowcount == 0:
                unique = True
        cur.execute("insert into instances (adminID,expiration) values('%s',DATE_ADD(SYSDATE(), INTERVAL 1 DAY))" %(adminId))
        conn.commit()

    return {
        "statusCode": 200,
        "body": json.dumps({
            "adminID": str(adminId)
        }),
    }