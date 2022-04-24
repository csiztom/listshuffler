# config file containing credentials for RDS MySQL instance
import json

def get_params(event, *params):
    """Tries to get the needed parameters for the lambda function
    from the event object
    Gives exception when not found

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
            ret.append(event['queryStringParameters'][param])
    return ret

def get_optional_params(event, *params):
    """Tries to get the optional parameters for the lambda function
    from the event object

    Parameters:
    event (lambda event object): This is given in the handler
    params (string): These are the needed parameters

    Returns:
    The values

   """
    ret = {}
    for param in params:
        try:
            ret[param] = json.loads(event['body'])[param]
        except:
            try: ret[param] = event['queryStringParameters'][param]
            except:
                ret[param] = None
    return ret