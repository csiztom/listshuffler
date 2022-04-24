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
    This function gets the pairs
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
            return http_response.response(404, "No corresponding id")
        cur.execute(
            """select listItemID1, listItemID2 
            from public.pairs join (public.lists natural join public.listItems) 
            on listItemID1=listItemID where adminID=%s""", (adminId))
        result = {}
        for res in cur.fetchall():
            if res[0] not in result:
                result[res[0]] = []
            result[res[0]].append(res[1])

    return http_response.response(200, {'pairs': result, })
