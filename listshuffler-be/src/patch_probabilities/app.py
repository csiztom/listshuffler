import sys
import logging
import json
import random
import os
import string

try:
    from helpers import rds_config, params
except:  # for testing inside different root
    from ..helpers import rds_config, params

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
    This patches the probabilities
    """
    parameters = params.get_params(event, 'adminID', 'listID', 'probabilities')
    if type(parameters) is dict: return parameters
    [adminId, shuffledListId, probabilities] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select adminID, listID from public.lists where adminID=%s and listID=%s", (adminId, shuffledListId))
        if (cur.fetchone() == None):
            return {
                "statusCode": 404,
                "headers": {
                    "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
                },
            }
        cur.execute("""select distinct ID1, ID2, probability 
            from (select a.listItemID ID1, b.listItemID ID2 
            from ((public.listItems a natural join public.lists c) 
            join (public.listItems b natural join public.lists d))
            where c.adminID = %s and d.adminID = %s and c.listID = %s) d
            left join public.probabilities 
            on listItemID1 = ID1 and listItemID2 = ID2""", (adminId, adminId, shuffledListId))
        prevProbabilities = {}
        for tup in cur.fetchall():
            if tup[0] not in prevProbabilities:
                prevProbabilities[tup[0]] = {}
            prevProbabilities[tup[0]][tup[1]] = tup[2] if tup[2] != None else 1

        for it1, prob in prevProbabilities.items():
            for it2, val in prob.items():
                if probabilities[it1][it2] != val:
                    try:
                        cur.execute("""insert into probabilities (listItemID1,listItemID2,probability) values(%s,%s,%s) 
                            on duplicate key update probability=%s""", (
                            it1, it2, probabilities[it1][it2], probabilities[it1][it2]))
                    except:
                        return {
                            "statusCode": 400,
                            "headers": {
                                "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
                            },
                        }
        conn.commit()

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
        }
    }
