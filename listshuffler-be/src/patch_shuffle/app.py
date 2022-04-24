import logging

try:
    from helpers import rds_config, params, shuffle, http_response
except:  # for testing inside different root
    from ..helpers import rds_config, params, shuffle, http_response

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    """
    This shuffles the lists
    """
    try:
        parameters = params.get_params(event, 'adminID')
    except:
        logger.info("ERROR: Bad parameters")
        return http_response.response(400, "Missing or bad parameters")
    [adminId] = parameters
    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select adminID from public.instances where adminId=%s", (adminId))
        if (cur.fetchone() == None):
            logger.info("ERROR: No corresponding admin id")
            return http_response.response(404,"No corresponding id")
    try:
        shuffle.shuffle(adminId, conn)
    except:
        logger.info("ERROR: Shuffle did not complete")
        return http_response.response(400, "Bad shuffle")
    logger.info("SUCCESS: Shuffle complete")
    return http_response.response(200)
