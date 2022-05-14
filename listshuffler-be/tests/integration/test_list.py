from lambda_client import lambda_client
import json
from unittest import TestCase


class TestList(TestCase):
    def test_nonexistent(self):
        response = lambda_client().invoke(FunctionName="testGetList",
                                          Payload=json.dumps({"queryStringParameters": {'listID': 'tada'}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 404

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
        list_id = json.loads(payload['body'])['listID']
        response = client.invoke(FunctionName="testGetList",
                                 Payload=json.dumps({"queryStringParameters": {'listID': list_id}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200

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
        list_id = json.loads(payload['body'])['listID']
        response = client.invoke(FunctionName="testPatchList",
                                 Payload=json.dumps({"queryStringParameters": {'listID': list_id, 'listName': 'hello', 'multiplicity': 1}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        response = client.invoke(FunctionName="testGetList",
                                 Payload=json.dumps({"queryStringParameters": {'listID': list_id}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        assert json.loads(payload['body'])['listName'] == 'hello'

    def test_delete(self):
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
        list_id = json.loads(payload['body'])['listID']
        response = client.invoke(FunctionName="testDeleteList",
                                 Payload=json.dumps({"queryStringParameters": {'listID': list_id}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        response = client.invoke(FunctionName="testGetList",
                                 Payload=json.dumps({"queryStringParameters": {'listID': list_id}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 404
