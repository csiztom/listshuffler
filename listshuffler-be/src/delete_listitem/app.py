import logging
import os

try:
    from helpers import rds_config, params, http_response
except:  # for testing inside different root
    from ..helpers import rds_config, params, http_response

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
    This function deletes a list item
    """
    try:
        parameters = params.get_params(event, 'listItemID')
    except:
        logger.info("ERROR: Bad parameters")
        return http_response.response(400, "Missing or bad parameters")
    [listItemId] = parameters
        
    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute("SET SQL_SAFE_UPDATES = 0")
        cur.execute("DELETE FROM public.listItems where listItemID=%s", (listItemId))
        conn.commit()

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
        },
    }
