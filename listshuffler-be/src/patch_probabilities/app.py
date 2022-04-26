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
    This patches the probabilities
    """
    try:
        parameters = params.get_params(
            event, 'adminID', 'listID', 'probabilities')
    except params.MissingParamError:
        logger.info("ERROR: Bad parameters")
        return http_response.response(400, "Missing or bad parameters")
    [admin_id, shuffled_list_id, probs] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select adminID, listID from public.lists where adminID=%s and listID=%s", (admin_id, shuffled_list_id))
        if (cur.fetchone() == None):
            logger.info("ERROR: Either adminID or listID is wrong")
            return http_response.response(404, "No corresponding ids")
        cur.execute("""select distinct ID1, ID2, probability 
            from (select a.listItemID ID1, b.listItemID ID2 
            from ((public.listItems a natural join public.lists c) 
            join (public.listItems b natural join public.lists d))
            where c.adminID = %s and d.adminID = %s and c.listID = %s) d
            left join public.probabilities 
            on listItemID1 = ID1 and listItemID2 = ID2""", (admin_id, admin_id, shuffled_list_id))
        prev_probs = {}
        for tup in cur.fetchall():
            if tup[0] not in prev_probs:
                prev_probs[tup[0]] = {}
            prev_probs[tup[0]][tup[1]] = tup[2] if tup[2] != None else 1

        for it1, prob in prev_probs.items():
            for it2, val in prob.items():
                try:
                    if probs[it1][it2] != val:
                        try:
                            cur.execute("""insert into probabilities (listItemID1,listItemID2,probability) values(%s,%s,%s) 
                                on duplicate key update probability=%s""", (
                                it1, it2, probs[it1][it2], probs[it1][it2]))
                        except pymysql.MySQLError:
                            logger.info("ERROR: Could not insert")
                            return http_response.response(400)
                except TypeError: 
                    logger.info("ERROR: Bad probabilities format")
                    return http_response.response(400, "Bad format")
                except KeyError: 
                    logger.info("ERROR: Missing keys")
                    return http_response.response(400, "Missing keys")
        conn.commit()

    return http_response.response(200)
