from lambda_client import lambda_client
import hashlib
import json
from unittest import TestCase

def convert_to_hash(val):
    return str(int(hashlib.sha384(val.encode()).hexdigest(),16))

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
        assert payload['statusCode'] == 200
        assert convert_to_hash(listitem_id2) in json.loads(payload['body'])['pairs']
    
    def test_complex(self):
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

        response = client.invoke(FunctionName="testPostList",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id, 'listName': '', 'multiplicity': 1}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        list_id3 = json.loads(payload['body'])['listID']
        response = client.invoke(FunctionName="testPostListitem",
                                 Payload=json.dumps({"queryStringParameters": {'listID': list_id3, 'listItem': ''}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        listitem_id3 = json.loads(payload['body'])['listItemID']

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
        assert payload['statusCode'] == 200
        assert convert_to_hash(listitem_id2) in json.loads(payload['body'])['pairs']
        assert convert_to_hash(listitem_id3) in json.loads(payload['body'])['pairs']

    def test_zero_prob(self):
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

        response = client.invoke(FunctionName="testGetProbabilities",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id, 'listID': list_id1}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        probs = json.loads(payload['body'])['probabilities']
        probs[listitem_id1][listitem_id2] = 0
        response = client.invoke(FunctionName="testPatchProbabilities",
                                 Payload=json.dumps({"queryStringParameters": {'adminID': admin_id, 'listID': list_id1, 'probabilities': probs}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200

        response = client.invoke(FunctionName="testPatchInstance",
                                Payload=json.dumps({"queryStringParameters": {'adminID': admin_id, 'shuffledID': list_id1}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200

        response = client.invoke(FunctionName="testPatchShuffle",
                                Payload=json.dumps({"queryStringParameters": {'adminID': admin_id}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 400

        response = client.invoke(FunctionName="testGetListitem",
                                Payload=json.dumps({"queryStringParameters": {'listItemID': listitem_id1}, "body": None}))
        payload = json.loads(response['Payload'].read())
        assert payload['statusCode'] == 200
        assert convert_to_hash(listitem_id2) not in json.loads(payload['body'])['pairs']