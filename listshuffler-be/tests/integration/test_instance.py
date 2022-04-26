from lambda_client import lambda_client
import json
from unittest import TestCase


class TestInstance(TestCase):
    def test_nonexistent(self):
        response = lambda_client().invoke(FunctionName="testGetInstance",
                                          Payload=json.dumps({"queryStringParameters": {'adminID': 'tada'}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 404

    def test_create(self):
        client = lambda_client()
        response = client.invoke(FunctionName="testPostInstance")
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        admin_id = json.loads(payload['body'])['adminID']
        response = client.invoke(FunctionName="testGetInstance",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200

    def test_edit(self):
        client = lambda_client()
        response = client.invoke(FunctionName="testPostInstance")
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        admin_id = json.loads(payload['body'])['adminID']
        response = client.invoke(FunctionName="testPatchInstance",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id, 'preset': 'christmas'}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        response = client.invoke(FunctionName="testGetInstance",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        assert json.loads(payload['body'])['preset'] == 'christmas'

    def test_delete(self):
        client = lambda_client()
        response = client.invoke(FunctionName="testPostInstance")
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        admin_id = json.loads(payload['body'])['adminID']
        response = client.invoke(FunctionName="testDeleteInstance",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        response = client.invoke(FunctionName="testGetInstance",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 404
