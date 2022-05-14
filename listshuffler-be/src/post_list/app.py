import logging
import random
import string

import pymysql

try:
    from helpers import rds_config, params, http_response
except ImportError:  # for testing inside different root
    from ..helpers import rds_config, params, http_response

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
    This function creates a list to add list items to
    """
    try:
        parameters = params.get_params(
            event, 'adminID', 'listName', 'multiplicity')
    except params.MissingParamError:
        logger.info("ERROR: Bad parameters")
        return http_response.response(400, "Missing or bad parameters")
    [admin_id, list_name, multiplicity] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select adminID from public.instances where adminId=%s", (admin_id))
        if (cur.fetchone() == None):
            logger.info("ERROR: No corresponding admin id")
            return http_response.response(404, "No corresponding id")
        i = 0
        while i < 20:
            list_id = ''.join(random.choice(
                string.ascii_letters + string.digits) for _ in range(6))
            try:
                cur.execute("""insert into lists (adminID,listID,listName,multiplicity) 
                    values(%s,%s,%s,%s)""", (admin_id, list_id, list_name, multiplicity))
                conn.commit()
            except pymysql.MySQLError:
                logger.info("INFO: ID already there")
                i += 1
                continue
            break
        if i >= 20:
            logger.info("ERROR: Could not find random id")
            return http_response.response(508, "Could not assign id to list")

    return http_response.response(200, {
        "listID": list_id
    })
