import logging
import random
import string
import json
import pymysql

try:
    from helpers import rds_config, http_response, params
    from post_list import app as post_list_app
    from patch_instance import app as patch_instance_app
except ImportError:  # for testing inside different root
    from ..helpers import rds_config, http_response, params
    from ..post_list import app as post_list_app
    from ..patch_instance import app as patch_instance_app

# logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
    This function creates an instance to add lists to
    """
    parameters = params.get_optional_params(
        event, 'preset')
    preset = parameters['preset']

    conn = rds_config.connect_rds()
    with conn.cursor() as cur:
        i = 0
        while i < 20:
            admin_id = ''.join(random.choice(
                string.ascii_letters + string.digits) for _ in range(8))
            try:
                if preset != None:
                    cur.execute(
                        """insert into instances (adminID,expiration,shuffled,uniqueInMul,preset) 
                    values(%s,DATE_ADD(SYSDATE(), INTERVAL 10 DAY),false,true,%s)""", (admin_id, preset))
                else:
                    cur.execute(
                        """insert into instances (adminID,expiration,shuffled,uniqueInMul,preset) 
                    values(%s,DATE_ADD(SYSDATE(), INTERVAL 10 DAY),false,true,"default")""", (admin_id))
                conn.commit()
            except pymysql.MySQLError:
                logger.info("INFO: ID already there")
                i += 1
                continue
            break
        if i >= 20:
            logger.info("ERROR: Could not find valid id")
            return http_response.response(508, "Could not assign id to instance")

    if preset == 'christmas':
        ret = post_list_app.handler({
            "body": '{ "adminID": "%s", "listName": "Names", "multiplicity": 2 }' % (admin_id),
            "queryStringParameters": None
        }, context)
        if ret['statusCode'] != 200:
            return ret
        ret = patch_instance_app.handler({
            "body": '{ "adminID": "%s", "shuffledID": "%s"}' % (admin_id, json.loads(ret['body'])['listID']),
            "queryStringParameters": None
        }, context)
        if ret['statusCode'] != 200:
            return ret

    return http_response.response(200, {
        "adminID": str(admin_id)
    })
