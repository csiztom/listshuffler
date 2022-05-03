from lambda_client import lambda_client
import json
from unittest import TestCase


class TestListitem(TestCase):
    def test_nonexistent(self):
        response = lambda_client().invoke(FunctionName="testGetListitem",
                                          Payload=json.dumps({"queryStringParameters": {'listItemID': 'tada'}, "body": None}))
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
        assert payload['statusCode'] == 200
        response = client.invoke(FunctionName="testPostListitem",
                                 Payload=json.dumps({"queryStringParameters": {'listID': list_id, 'listItem': ''}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        listitem_id = json.loads(payload['body'])['listItemID']
        response = client.invoke(FunctionName="testGetListitem",
                                 Payload=json.dumps({"queryStringParameters": {'listItemID': listitem_id}, "body": None}))
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
        response = client.invoke(FunctionName="testPostListitem",
                                 Payload=json.dumps({"queryStringParameters": {'listID': list_id, 'listItem': ''}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        listitem_id = json.loads(payload['body'])['listItemID']
        response = client.invoke(FunctionName="testPatchListitem",
                                 Payload=json.dumps({"queryStringParameters": {'listItemID': listitem_id, 'listItem': 'hello'}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        response = client.invoke(FunctionName="testGetListitem",
                                 Payload=json.dumps({"queryStringParameters": {'listItemID': listitem_id}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        assert json.loads(payload['body'])['listItem'] == 'hello'

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
        response = client.invoke(FunctionName="testPostListitem",
                                 Payload=json.dumps({"queryStringParameters": {'listID': list_id, 'listItem': ''}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        listitem_id = json.loads(payload['body'])['listItemID']
        response = client.invoke(FunctionName="testDeleteListitem",
                                 Payload=json.dumps({"queryStringParameters": {'listItemID': listitem_id}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        response = client.invoke(FunctionName="testGetListitem",
                                 Payload=json.dumps({"queryStringParameters": {'listItemID': listitem_id}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 404
