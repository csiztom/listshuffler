import logging

try:
    from helpers import rds_config, params, http_response
except ImportError:  # for testing inside different root
    from ..helpers import rds_config, params, http_response

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
    This function gets a list
    """
    try:
        parameters = params.get_params(event, 'listID')
    except params.MissingParamError:
        logger.info("ERROR: Bad parameters")
        return http_response.response(400, "Missing or bad parameters")
    [list_id] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select listName, multiplicity from lists where listID=%s", (list_id))
        result = cur.fetchone()

    return http_response.response(200 if result != None else 404, {
        'listID': list_id,
        'listName': result[0],
        'multiplicity': result[1],
    } if result != None else '')
