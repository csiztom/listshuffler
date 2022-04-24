import logging
import random
import string

try:
    from helpers import rds_config, params, http_response
except:  # for testing inside different root
    from ..helpers import rds_config, params, http_response

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
    This function creates a list to add list items to
    """
    try:
        parameters = params.get_params(
            event, 'adminID', 'listName', 'multiplicity')
    except:
        logger.info("ERROR: Bad parameters")
        return http_response.response(400, "Missing or bad parameters")
    [adminId, listName, multiplicity] = parameters

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        cur.execute(
            "select adminID from public.instances where adminId=%s", (adminId))
        if (cur.fetchone() == None):
            logger.info("ERROR: No corresponding admin id")
            return http_response.response(404, "No corresponding id")
        i = 0
        while i < 20:
            listId = ''.join(random.choice(
                string.ascii_letters + string.digits) for _ in range(6))
            try:
                cur.execute("""insert into lists (adminID,listID,listName,multiplicity) 
                    values(%s,%s,%s,%s)""", (adminId, listId, listName, multiplicity))
                conn.commit()
            except:
                logging.info("INFO: ID already there")
                i += 1
                continue
            break
        if i >= 20:
            logger.info("ERROR: Could not find random id")
            return http_response.response(508, "Could not assign id to list")

    return http_response.response(200, {
        "listID": listId
    })
