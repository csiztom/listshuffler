import logging
import json
import os

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
    parameters = params.get_params(event, 'listItemID')
    if type(parameters) is dict: return parameters
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
