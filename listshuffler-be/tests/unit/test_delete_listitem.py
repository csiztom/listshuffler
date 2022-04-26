from unittest import TestCase, mock
from src.delete_listitem import app

def good_api_event():
    return {
        "body": '{ "listItemID": "id"}',
        "queryStringParameters": None
    }

def bad_api_event():
    return {
        "body": None,
        "queryStringParameters": None
    }

class TestDeleteListitem(TestCase):
    def test_bad_api_call(self):
        assert app.handler(bad_api_event(), "")['statusCode'] == 400

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_success(self, mock_pymysql):
        assert app.handler(good_api_event(), "")['statusCode'] == 200
