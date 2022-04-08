import logging
import json
import os
import random

try:
    from helpers import rds_config, params
except:  # for testing inside different root
    from ..helpers import rds_config, params

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    """
    This function gets an instance
    """
    parameters = params.get_params(event, 'adminID', 'listID')
    if type(parameters) is dict: return parameters
    [adminId, shuffledListId] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
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

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
        },
        "body": json.dumps({'probabilities': probabilities}),
    }
