from lambda_client import lambda_client
import hashlib
import json
from unittest import TestCase


class TestShuffle(TestCase):
    def test_simple(self):
        client = lambda_client()
        response = client.invoke(FunctionName="testPostInstance")
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

        response = client.invoke(FunctionName="testPatchInstance",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id, 'shuffledID': list_id1}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200

        response = client.invoke(FunctionName="testPatchShuffle",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200

        response = client.invoke(FunctionName="testGetListitem",
                                 Payload=json.dumps({"queryStringParameters": {'listItemID': listitem_id1}, "body": None}))
        payload = json.loads(response['Payload'].read())
        print(payload)
        assert payload['statusCode'] == 200
        assert str(int(hashlib.sha384(listitem_id2.encode()).hexdigest(),16)) in json.loads(payload['body'])['pairs']
    
