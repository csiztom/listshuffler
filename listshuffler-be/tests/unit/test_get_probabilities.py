import json
from unittest import TestCase, mock
from src.get_probabilities import app

def good_api_event():
    return {
        "body": '{ "adminID": "id", "listID": "id"}',
        "queryStringParameters": None
    }

def bad_api_event():
    return {
        "body": None,
        "queryStringParameters": None
    }

class TestGetProbabilities(TestCase):
    def test_bad_api_call(self):
        assert app.handler(bad_api_event(), "")['statusCode'] == 400

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_non_existing_instance(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_cursor.fetchone.return_value = None
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(good_api_event(), "")['statusCode'] == 404

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_empty_probabilities(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_cursor.fetchone.return_value = ['id']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(good_api_event(), "")

        assert res['statusCode'] == 200
        assert json.loads(res['body'])['probabilities'] == {}

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_one_probability(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = [['id', 'id2', 1]]
        mock_cursor.fetchone.return_value = ['id']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(good_api_event(), "")

        assert res['statusCode'] == 200
        assert len(json.loads(res['body'])['probabilities']) == 1
    
    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_more_probabilities(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = [['id', 'id2', 1],['id2', 'id2', 1],['id2', 'id3', 1]]
        mock_cursor.fetchone.return_value = ['id']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(good_api_event(), "")

        assert res['statusCode'] == 200
        assert len(json.loads(res['body'])['probabilities']) == 2