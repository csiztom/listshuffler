# config file containing credentials for RDS MySQL instance
import json

class MissingParamError(Exception):
    pass

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
        if event['body'] != None:
            try:
                ret.append(json.loads(event['body'])[param])
            except KeyError:
                raise MissingParamError()
        elif event['queryStringParameters'] != None:
            try:
                ret.append(event['queryStringParameters'][param])
            except KeyError:
                raise MissingParamError()
        else:
            raise MissingParamError()
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
            ret[param] = get_params(event, param)[0]
        except MissingParamError:
            ret[param] = None
    return ret