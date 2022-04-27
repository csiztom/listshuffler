import json
from unittest import TestCase, mock
from src.get_listitem import app


def good_api_event():
    return {
        "body": '{ "listItemID": "id"}',
        "queryStringParameters": None
    }


def bad_api_event():
    return {
        "body": None,
        "queryStringParameters": None
    }


class TestGetListitem(TestCase):
    def test_bad_api_call(self):
        assert app.handler(bad_api_event(), "")['statusCode'] == 400

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_non_existing_listitem(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_cursor.fetchone.return_value = None
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(good_api_event(), "")['statusCode'] == 404

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_unpaired_listitem(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_cursor.fetchone.return_value = ['name']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(good_api_event(), "")

        assert res['statusCode'] == 200
        assert json.loads(res['body'])['listItem'] == 'name'
        assert json.loads(res['body'])['listItemID'] == 'id'
        assert json.loads(res['body'])['pairs'] == {}

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_paired_listitem(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = [
            ['id1', 'item', 1], ['id2', 'item', 1], ['id3', 'item', 1]]
        mock_cursor.fetchone.return_value = ['name']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(good_api_event(), "")

        assert res['statusCode'] == 200
        assert json.loads(res['body'])['listItem'] == 'name'
        assert json.loads(res['body'])['listItemID'] == 'id'
        assert len(json.loads(res['body'])['pairs'].keys())
