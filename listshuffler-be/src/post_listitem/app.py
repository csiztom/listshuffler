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
    This function creates a listitem
    """
    try:
        parameters = params.get_params(event, 'listID', 'listItem')
    except params.MissingParamError:
        logger.info("ERROR: Bad parameters")
        return http_response.response(400, "Missing or bad parameters")
    [list_id, listitem_name] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select preset from public.lists natural join public.instances where listID=%s", (list_id))
        res = cur.fetchone()
        if (res == None):
            logger.info("ERROR: No corresponding list id")
            return http_response.response(404, "No corresponding id")
        i = 0
        while i < 20:
            listitem_id = ''.join(random.choice(
                string.ascii_letters + string.digits) for _ in range(7))
            try:
                cur.execute("insert into listItems (listID,listItemID,listItem) values(%s,%s,%s)", (
                    list_id, listitem_id, listitem_name))
                conn.commit()
            except pymysql.MySQLError:
                logger.info("INFO: ID already there")
                i += 1
                continue
            break
        if i >= 20:
            logger.info("ERROR: Could not find random id")
            return http_response.response(508, "Could not assign id to item")

        if res[0] == 'christmas':
            cur.execute("""insert into probabilities (listItemID1,listItemID2,probability) values('%s','%s',%s)""" % (
                listitem_id, listitem_id, 0))
            conn.commit()

    return http_response.response(200, {
        "listItemID": listitem_id
    })
