import os
import json


def response(status_code, body = {}):
    """Returns an object containing the lambda response

    Parameters:
    status_code (number): HTTP status code
    body (object): Response body

    Returns:
    response

   """
    return {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
        },
        "body": json.dumps(body)
    }
