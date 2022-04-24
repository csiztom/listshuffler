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
    This function gets the probabilities
    """
    try:
        parameters = params.get_params(event, 'adminID', 'listID')
    except:
        logger.info("ERROR: Bad parameters")
        return http_response.response(400, "Missing or bad parameters")
    [adminId, shuffledListId] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select adminID from public.instances where adminId=%s", (adminId))
        if (cur.fetchone() == None):
            logger.info("ERROR: No corresponding admin id")
            return http_response.response(404, "No corresponding id")
        cur.execute("""select distinct ID1, ID2, probability 
            from (select a.listItemID ID1, b.listItemID ID2 
            from ((public.listItems a natural join public.lists c) 
            join (public.listItems b natural join public.lists d))
            where c.adminID = %s and d.adminID = %s and c.listID = %s) d
            left join public.probabilities 
            on listItemID1 = ID1 and listItemID2 = ID2""", (adminId, adminId, shuffledListId))
        probabilities = {}
        for tup in cur.fetchall():
            if tup[0] not in probabilities:
                probabilities[tup[0]] = {}
            probabilities[tup[0]][tup[1]] = tup[2] if tup[2] != None else 1

    return http_response.response(200, {'probabilities': probabilities})
