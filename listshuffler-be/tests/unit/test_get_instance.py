import json
from unittest import TestCase, mock
from src.get_instance import app

def apigw_event():
    """ Generates API GW Event"""

    return {
        "body": '{ "adminID": ""}',
        "queryStringParameters": {"foo": "bar"},
    }

class TestGetInstance(TestCase):
    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_notExistingInstance(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_cursor.fetchone.return_value = None
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(apigw_event(), "")['statusCode'] == 404

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_emptyInstance(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_cursor.fetchone.return_value = ['id', 0, 'id2', None]
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(apigw_event(), "")

        assert res['statusCode'] == 200
        assert json.loads(res['body'])['lists'] == []
        assert json.loads(res['body'])['shuffled'] == 0
        assert json.loads(res['body'])['shuffledID'] == 'id2'
        assert json.loads(res['body'])['preset'] == None

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_oneListInstance(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = [['id', 'name', 1]]
        mock_cursor.fetchone.return_value = ['id', 0, 'id2', None]
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(apigw_event(), "")

        assert res['statusCode'] == 200
        assert len(json.loads(res['body'])['lists'])== 1
    
    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_moreListInstance(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = [['id', 'name', 1], ['id2', 'name2', 1]]
        mock_cursor.fetchone.return_value = ['id', 0, 'id2', None]
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(apigw_event(), "")

        assert res['statusCode'] == 200
        assert len(json.loads(res['body'])['lists'])== 2