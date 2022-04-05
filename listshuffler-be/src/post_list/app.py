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
    This function creates a list
    """
    
    adminId = json.loads(event['body'])['adminID']
    listName = json.loads(event['body'])['listName']
    multiplicity = json.loads(event['body'])['multiplicity']
    
    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        i = 0
        while i < 20:
            listId = ''.join(random.choice(
                string.ascii_letters + string.digits) for _ in range(6))
            try:
                cur.execute("insert into lists (adminID,listID,listName,multiplicity) values(%s,%s,%s,%s)", (
                    adminId, listId, listName, multiplicity))
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
            "listID": listId
        }),
    }
