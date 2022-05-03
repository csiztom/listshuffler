import logging
import hashlib

try:
    from helpers import rds_config, params, http_response
except ImportError:  # for testing inside different root
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
    except params.MissingParamError:
        logger.info("ERROR: Bad parameters")
        return http_response.response(400, "Missing or bad parameters")
    [listitem_id] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute("select listItem from listItems where listItemId=%s",
                    (listitem_id))
        result = cur.fetchone()
        cur.execute("""select listItemID, listItem, multiplicity
            from public.pairs join public.listItems
            on listItemID2=listItemID
            where listItemID1=%s""",
                    (listitem_id))
        pairs = {str(int(hashlib.sha384((val[0]+str(val[2])).encode()).hexdigest(), 16)): val[1]
                 for val in cur.fetchall()}
        if len(pairs) == 0:
            cur.execute("""select listItemID, listItem, multiplicity
            from public.pairs join public.listItems
            on listItemID1=listItemID
            where listItemID2=%s""",
                        (listitem_id))
            pairs = {str(int(hashlib.sha384((val[0]+str(val[2])).encode()).hexdigest(), 16)): val[1]
                     for val in cur.fetchall()}

    return http_response.response(200 if result != None else 404, {
        'listItemID': listitem_id,
        'listItem': result[0],
        'pairs': pairs,
    } if result != None else '')
