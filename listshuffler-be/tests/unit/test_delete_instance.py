from unittest import TestCase, mock
from src.delete_instance import app


def good_api_event():
    return {
        "body": '{ "adminID": "thisnthat"}',
        "queryStringParameters": None
    }


def bad_api_event():
    return {
        "body": None,
        "queryStringParameters": None
    }


class TestDeleteInstance(TestCase):
    def test_bad_api_call(self):
        assert app.handler(bad_api_event(), "")['statusCode'] == 400

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_success(self, mock_pymysql):
        assert app.handler(good_api_event(), "")['statusCode'] == 200
