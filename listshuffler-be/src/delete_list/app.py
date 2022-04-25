import logging
import os

try:
    from helpers import rds_config, params, http_response
except ImportError:  # for testing inside different root
    from ..helpers import rds_config, params, http_response

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
    This function deletes a list
    """
    try:
        parameters = params.get_params(event, 'listID')
    except params.MissingParamError:
        logger.info("ERROR: Bad parameters")
        return http_response.response(400, "Missing or bad parameters")
    [list_id] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute("SET SQL_SAFE_UPDATES = 0")
        cur.execute("DELETE FROM public.lists where listID=%s", (list_id))
        conn.commit()

    return http_response.response(200)
