import logging

try:
    from helpers import rds_config, params, http_response
except:  # for testing inside different root
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
    except:
        logger.info("ERROR: Bad parameters")
        return http_response.response(400, "Missing or bad parameters")
    [adminId] = parameters

    parameters = params.get_optional_params(
        event, 'shuffleTime', 'uniqueInMul', 'shuffledID')
    shuffleTime = '"' + parameters['shuffleTime'] + \
        '"' if parameters['shuffleTime'] != None else None
    unique = parameters['uniqueInMul']
    shuffledId = parameters['shuffledID']

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select adminID from public.instances where adminId=%s", (adminId))
        if (cur.fetchone() == None):
            logger.info("ERROR: No corresponding admin id")
            return http_response.response(404, "No corresponding id")
        try:
            if shuffleTime != None:
                cur.execute("""update instances 
                    set shuffleTime="+shuffleTime+", expiration=DATE_ADD("+shuffleTime+", INTERVAL 30 DAY) 
                    where adminID=%s""", (
                    adminId))
            if shuffledId != None:
                cur.execute("update instances set shuffledID=%s where adminID=%s", (
                    shuffledId, adminId))
            if unique != None:
                cur.execute("update instances set uniqueInMul=%s where adminID=%s", (
                    unique, adminId))
            conn.commit()
        except:
            logger.info("ERROR: Could not update")
            return http_response.response(400)

    return http_response.response(200)
