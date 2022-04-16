import json
from unittest import TestCase, mock
from src.get_probabilities import app

def apigw_event():
    """ Generates API GW Event"""

    return {
        "body": '{ "adminID": "", "listID": ""}',
        "queryStringParameters": {"foo": "bar"},
    }

class TestGetProbabilities(TestCase):
    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_notExistingInstance(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_cursor.fetchone.return_value = None
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(apigw_event(), "")['statusCode'] == 404

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_emptyProbabilities(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_cursor.fetchone.return_value = ['id']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(apigw_event(), "")

        assert res['statusCode'] == 200
        assert json.loads(res['body'])['probabilities'] == {}

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_oneProbability(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = [['id', 'id2', 1]]
        mock_cursor.fetchone.return_value = ['id']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(apigw_event(), "")

        assert res['statusCode'] == 200
        assert len(json.loads(res['body'])['probabilities']) == 1
    
    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_moreProbabilities(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = [['id', 'id2', 1],['id2', 'id2', 1],['id2', 'id3', 1]]
        mock_cursor.fetchone.return_value = ['id']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(apigw_event(), "")

        assert res['statusCode'] == 200
        assert len(json.loads(res['body'])['probabilities']) == 2