import json
from unittest import TestCase, mock
from src.get_listitem import app

def apigw_event():
    """ Generates API GW Event"""

    return {
        "body": '{ "listItemID": "id"}',
        "queryStringParameters": {"foo": "bar"},
    }

class TestGetListitem(TestCase):
    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_notExistingListitem(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_cursor.fetchone.return_value = None
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(apigw_event(), "")['statusCode'] == 404

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_unpairedListitem(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_cursor.fetchone.return_value = ['name']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(apigw_event(), "")

        assert res['statusCode'] == 200
        assert json.loads(res['body'])['listItem'] == 'name'
        assert json.loads(res['body'])['listItemID'] == 'id'
        assert json.loads(res['body'])['pairs'] == {}

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_pairedListitem(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = [['id1','item'],['id2','item'],['id3','item']]
        mock_cursor.fetchone.return_value = ['name']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(apigw_event(), "")

        assert res['statusCode'] == 200
        assert json.loads(res['body'])['listItem'] == 'name'
        assert json.loads(res['body'])['listItemID'] == 'id'
        assert len(json.loads(res['body'])['pairs'].keys())
