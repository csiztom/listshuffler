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
    This function gets an instance
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
            "select adminID, shuffled, shuffledID, uniqueInMul, preset, shuffleTime from public.instances where adminId=%s", (adminId))
        instance = cur.fetchone()
        if (instance == None):
            logger.info("ERROR: No corrseponding admin id")
            return http_response.response(404, "No correesponding id")
        cur.execute("""select l.listID, listName, multiplicity 
            from public.instances i inner join public.lists l 
            on i.adminID=l.adminID where i.adminId=%s""",
                    (adminId))
        result = list(map(lambda tup: {
            'listID': tup[0],
            'listName': tup[1],
            'multiplicity': tup[2],
        }, cur.fetchall()))
        for ind, val in enumerate(result):
            cur.execute("""select listItem, listItemID 
                from public.lists l inner join public.listItems li 
                on li.listID=l.listID where li.listID=%s""",
                        (val['listID']))
            result[ind]['listItems'] = list(map(lambda tup: {
                'listItemID': tup[1],
                'listItem': tup[0],
            }, cur.fetchall()))

    return http_response.response(200, {
        'lists': result,
        'shuffled': instance[1],
        'shuffledID': instance[2],
        'uniqueInMul': instance[3],
        'preset': instance[4],
        'shuffleTime': str(instance[5].date()) if instance[5] != None else None,
    })
