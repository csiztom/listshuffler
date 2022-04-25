import logging

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
    This function patches a listitem
    """
    try:
        parameters = params.get_params(event, 'listItemID', 'listItem')
    except params.MissingParamError:
        logger.info("ERROR: Bad parameters")
        return http_response.response(400, "Missing or bad parameters")
    [listitem_id, listitem_name] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select listItemID from public.listItems where listItemID=%s", (listitem_id))
        if (cur.fetchone() == None):
            logger.info("ERROR: No corresponding listitem id")
            return http_response.response(404, "No corresponding id")
        try:
            cur.execute("update listItems set listItem=%s where listItemID=%s", (
                listitem_name, listitem_id))
            conn.commit()
        except pymysql.MySQLError:
            logger.info("ERROR: Could not update")
            return http_response.response(400)

    return http_response.response(200)
