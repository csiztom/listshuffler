from lambda_client import lambda_client
import json
from unittest import TestCase


class TestProbability(TestCase):
    def test_create(self):
        client = lambda_client()
        response = client.invoke(FunctionName="testPostInstance",
                                 Payload=json.dumps({"queryStringParameters": None, "body": None}))
        payload = json.loads(response['Payload'].read())
        admin_id = json.loads(payload['body'])['adminID']
        assert payload['statusCode'] == 200

        response = client.invoke(FunctionName="testPostList",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id, 'listName': '', 'multiplicity': 1}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        list_id1 = json.loads(payload['body'])['listID']
        response = client.invoke(FunctionName="testPostListitem",
                                 Payload=json.dumps({"queryStringParameters": {'listID': list_id1, 'listItem': ''}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        listitem_id1 = json.loads(payload['body'])['listItemID']

        response = client.invoke(FunctionName="testPostList",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id, 'listName': '', 'multiplicity': 1}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        list_id2 = json.loads(payload['body'])['listID']
        response = client.invoke(FunctionName="testPostListitem",
                                 Payload=json.dumps({"queryStringParameters": {'listID': list_id2, 'listItem': ''}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        listitem_id2 = json.loads(payload['body'])['listItemID']

        response = client.invoke(FunctionName="testGetProbabilities",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id, 'listID': list_id1}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        assert json.loads(payload['body'])[
            'probabilities'][listitem_id1][listitem_id2] == 1

    def test_edit(self):
        client = lambda_client()
        response = client.invoke(FunctionName="testPostInstance",
                                 Payload=json.dumps({"queryStringParameters": None, "body": None}))
        payload = json.loads(response['Payload'].read())
        admin_id = json.loads(payload['body'])['adminID']
        assert payload['statusCode'] == 200

        response = client.invoke(FunctionName="testPostList",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id, 'listName': '', 'multiplicity': 1}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        list_id1 = json.loads(payload['body'])['listID']
        response = client.invoke(FunctionName="testPostListitem",
                                 Payload=json.dumps({"queryStringParameters": {'listID': list_id1, 'listItem': ''}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        listitem_id1 = json.loads(payload['body'])['listItemID']

        response = client.invoke(FunctionName="testPostList",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id, 'listName': '', 'multiplicity': 1}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        list_id2 = json.loads(payload['body'])['listID']
        response = client.invoke(FunctionName="testPostListitem",
                                 Payload=json.dumps({"queryStringParameters": {'listID': list_id2, 'listItem': ''}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        listitem_id2 = json.loads(payload['body'])['listItemID']

        response = client.invoke(FunctionName="testGetProbabilities",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id, 'listID': list_id1}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        probs = json.loads(payload['body'])['probabilities']
        probs[listitem_id1][listitem_id2] = 2
        response = client.invoke(FunctionName="testPatchProbabilities",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id, 'listID': list_id1, 'probabilities': probs}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        response = client.invoke(FunctionName="testGetProbabilities",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id, 'listID': list_id1}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        assert json.loads(payload['body'])[
            'probabilities'][listitem_id1][listitem_id2] == 2
