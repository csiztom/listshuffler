from unittest import TestCase, mock
from src.patch_listitem import app
import pymysql

def good_api_event():
    return {
        "body": '{ "listItemID": "id", "listItem": "name"}',
        "queryStringParameters": None
    }

def bad_api_event():
    return {
        "body": None,
        "queryStringParameters": None
    }

class TestPatchListitem(TestCase):
    def test_bad_api_call(self):
        assert app.handler(bad_api_event(), "")['statusCode'] == 400

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_non_existing_listitem(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = None
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(good_api_event(), "")['statusCode'] == 404

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_error(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_pymysql.connect.return_value.commit.side_effect = pymysql.MySQLError('Test')
        mock_cursor.fetchone.return_value = ['id']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(good_api_event(), "")['statusCode'] == 400

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_success(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = ['id']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(good_api_event(), "")['statusCode'] == 200
