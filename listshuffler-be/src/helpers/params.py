# config file containing credentials for RDS MySQL instance
import os
import json

def get_params(event, *params):
    """Tries to get the needed parameters for the lambda function
    from the event object

    Parameters:
    event (lambda event object): This is given in the handler
    params (string): These are the needed parameters

    Returns:
    The values

   """
    ret = []
    for param in params:
        try:
            ret.append(json.loads(event['body'])[param])
        except:
            try: ret.append(event['queryStringParameters'][param])
            except:
                return {
                    "statusCode": 400,
                    "headers": {
                        "Access-Control-Allow-Origin": os.environ['LS_PAGE_ORIGIN'],
                    }
                }
    return ret