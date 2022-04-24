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
    This function gets a list item
    """
    try:
        parameters = params.get_params(event, 'listItemID')
    except:
        logger.info("ERROR: Bad parameters")
        return http_response.response(400, "Missing or bad parameters")
    [listItemId] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute("select listItem from listItems where listItemId=%s",
                    (listItemId))
        result = cur.fetchone()
        cur.execute("""select listItemID, listItem
            from public.pairs join public.listItems
            on listItemID2=listItemID
            where listItemID1=%s""",
                    (listItemId))
        pairs = {val[0]: val[1] for val in cur.fetchall()}

    return http_response.response(200 if result != None else 404, {
        'listItemID': listItemId,
        'listItem': result[0],
        'pairs': pairs,
    } if result != None else '')
