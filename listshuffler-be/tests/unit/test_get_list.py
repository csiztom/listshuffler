import json
from unittest import TestCase, mock
from src.get_list import app

def apigw_event():
    """ Generates API GW Event"""

    return {
        "body": '{ "listID": "that"}',
        "queryStringParameters": {"foo": "bar"},
    }

class TestGetList(TestCase):
    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_notExistingList(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = None
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(apigw_event(), "")['statusCode'] == 404

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_List(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = ['id', 0]
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(apigw_event(), "")

        assert res['statusCode'] == 200
        assert json.loads(res['body'])['listID'] == 'that'
        assert json.loads(res['body'])['listName'] == 'id'
        assert json.loads(res['body'])['multiplicity'] == 0
