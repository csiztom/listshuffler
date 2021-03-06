from unittest import TestCase, mock
from src.post_listitem import app
import pymysql
import json


def good_api_event():
    return {
        "body": '{ "listID": "id", "listItem": "hello", "multiplicity": 1 }',
        "queryStringParameters": None
    }


def bad_api_event():
    return {
        "body": None,
        "queryStringParameters": None
    }


class TestPostListitem(TestCase):
    def test_bad_api_call(self):
        assert app.handler(bad_api_event(), "")['statusCode'] == 400

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_non_existing_list(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = None
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(good_api_event(), "")['statusCode'] == 404

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_error(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_pymysql.connect.return_value.commit.side_effect = pymysql.MySQLError(
            'Test')
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(good_api_event(), "")['statusCode'] == 508

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_success(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = ["id"]
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(good_api_event(), "")
        assert res['statusCode'] == 200
        assert len(json.loads(res['body'])['listItemID']) == 7
