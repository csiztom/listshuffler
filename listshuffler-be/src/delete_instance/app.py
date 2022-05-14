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
    This function deletes an instance
    """
    try:
        parameters = params.get_params(event, 'adminID')
    except params.MissingParamError:
        return http_response.response(400, "Missing or bad parameters")
    [admin_id] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute("DELETE FROM public.instances where adminID=%s", (admin_id))
        conn.commit()

    return http_response.response(200)
