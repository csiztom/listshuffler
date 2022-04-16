import json
from unittest import TestCase, mock
from src.get_pairs import app

def apigw_event():
    """ Generates API GW Event"""

    return {
        "body": '{ "adminID": ""}',
        "queryStringParameters": {"foo": "bar"},
    }

class TestGetPairs(TestCase):
    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_notExistingInstance(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_cursor.fetchone.return_value = None
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(apigw_event(), "")['statusCode'] == 404

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_noPairs(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_cursor.fetchone.return_value = ['id']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(apigw_event(), "")

        assert res['statusCode'] == 200
        assert json.loads(res['body'])['pairs'] == {}

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_onePair(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = [['id1', 'id2']]
        mock_cursor.fetchone.return_value = ['id']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(apigw_event(), "")

        assert res['statusCode'] == 200
        assert len(json.loads(res['body'])['pairs'].keys()) == 1
    
    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_morePairs(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = [['id1', 'id2'],['id1', 'id4'],['id5', 'id6']]
        mock_cursor.fetchone.return_value = ['id']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(apigw_event(), "")

        assert res['statusCode'] == 200
        assert len(json.loads(res['body'])['pairs']) == 2