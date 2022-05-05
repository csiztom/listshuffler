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
    This function patches an instance
    """
    try:
        parameters = params.get_params(event, 'adminID')
    except params.MissingParamError:
        logger.info("ERROR: Bad parameters")
        return http_response.response(400, "Missing or bad parameters")
    [admin_id] = parameters

    parameters = params.get_optional_params(
        event, 'shuffleTime', 'uniqueInMul', 'shuffledID', 'preset')
    shuffle_time = parameters['shuffleTime']
    unique = parameters['uniqueInMul']
    shuffled_id = parameters['shuffledID']
    preset = parameters['preset']

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select adminID from public.instances where adminId=%s", (admin_id))
        if (cur.fetchone() == None):
            logger.info("ERROR: No corresponding admin id")
            return http_response.response(404, "No corresponding id")
        try:
            if shuffle_time != None:
                cur.execute("""update instances 
                set shuffleTime='"""+shuffle_time+"""', expiration=DATE_ADD('"""+shuffle_time+"""', INTERVAL 30 DAY) 
                where adminID=%s""", (
                    admin_id))
            if shuffled_id != None:
                cur.execute("update instances set shuffledID=%s where adminID=%s", (
                    shuffled_id, admin_id))
            if unique != None:
                cur.execute("update instances set uniqueInMul=%s where adminID=%s", (
                    unique, admin_id))
            if preset != None:
                cur.execute("update instances set preset=%s where adminID=%s", (
                    preset, admin_id))
            conn.commit()
        except pymysql.MySQLError:
            logger.info("ERROR: Could not update")
            return http_response.response(400)

    return http_response.response(200)
