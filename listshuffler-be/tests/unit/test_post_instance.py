from unittest import TestCase, mock
from src.post_instance import app
import pymysql
import json

def api_event():
    return {
        "body": None,
        "queryStringParameters": None
    }

class TestPostInstance(TestCase):
    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_error(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_pymysql.connect.return_value.commit.side_effect = pymysql.MySQLError('Test')
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(api_event(), "")['statusCode'] == 508

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_success(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(api_event(), "")
        assert res['statusCode'] == 200
        assert len(json.loads(res['body'])['adminID']) == 8