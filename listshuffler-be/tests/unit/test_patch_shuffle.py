from unittest import TestCase, mock
from src.patch_shuffle import app

def good_api_event():
    return {
        "body": '{ "adminID": "id" }',
        "queryStringParameters": None
    }

def bad_api_event():
    return {
        "body": None,
        "queryStringParameters": None
    }

class TestPatchInstance(TestCase):
    def test_bad_api_call(self):
        assert app.handler(bad_api_event(), "")['statusCode'] == 400

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_non_existing_instance(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = None
        mock_cursor.fetchall.return_value = None
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(good_api_event(), "")['statusCode'] == 404

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_already_shuffled(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = [1,'id', True]
        mock_cursor.fetchall.return_value = None
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(good_api_event(), "")['statusCode'] == 400

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_empty_fetches(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = [0,'id', True]
        mock_cursor.fetchall.return_value = []
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(good_api_event(), "")
        assert res['statusCode'] == 400

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_one_fetches(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = [0,'id', True]
        mock_cursor.fetchall.return_value = [['id', 2]]
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(good_api_event(), "")
        assert res['statusCode'] == 200

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_more_fetches(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = [0,'id', True]
        mock_cursor.fetchall.return_value = [['id', 1], ['id2', 1], ['id3', 1]]
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(good_api_event(), "")
        assert res['statusCode'] == 200
