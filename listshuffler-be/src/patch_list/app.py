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
    This function patches a list
    """
    try:
        parameters = params.get_params(event, 'listID', 'listName', 'multiplicity')
    except:
        logger.info("ERROR: Bad parameters")
        return http_response.response(400, "Missing or bad parameters")
    [listId, listName, multiplicity] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select listID from public.lists where listID=%s", (listId))
        if (cur.fetchone() == None):
            logger.info("ERROR: No corresponding list id")
            return http_response.response(404, "No corresponding id")
        try:
            cur.execute("update lists set listName=%s, multiplicity=%s where listID=%s", (
                listName, multiplicity, listId))
            conn.commit()
        except:
            logger.info("ERROR: Could not update")
            return http_response.response(400)

    return http_response.response(200)
