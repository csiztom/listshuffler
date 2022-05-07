import json
import datetime
from unittest import TestCase, mock
from src.get_instance import app


def good_api_event():
    return {
        "body": '{ "adminID": "thisnthat"}',
        "queryStringParameters": None
    }


def bad_api_event():
    return {
        "body": None,
        "queryStringParameters": None
    }


class TestGetInstance(TestCase):
    def test_bad_api_call(self):
        assert app.handler(bad_api_event(), "")['statusCode'] == 400

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_non_existing_instance(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = None
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(good_api_event(), "")['statusCode'] == 404

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_empty_instance(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = []
        mock_cursor.fetchone.return_value = [
            'id', 0, None, True, None, datetime.datetime(2020, 5, 17)]
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(good_api_event(), "")

        assert res['statusCode'] == 200
        assert json.loads(res['body'])['lists'] == []
        assert json.loads(res['body'])['shuffled'] == 0
        assert json.loads(res['body'])['shuffledID'] == None
        assert json.loads(res['body'])['uniqueInMul'] == True
        assert json.loads(res['body'])['preset'] == None
        assert json.loads(res['body'])['shuffleTime'] == '2020-05-17'

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_one_list_instance(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = [['id', 'name', 1]]
        mock_cursor.fetchone.return_value = [
            'id', 0, 'id2', False, None, None]
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(good_api_event(), "")

        assert res['statusCode'] == 200
        assert len(json.loads(res['body'])['lists']) == 1
        assert json.loads(res['body'])['shuffled'] == 0
        assert json.loads(res['body'])['shuffledID'] == 'id2'
        assert json.loads(res['body'])['uniqueInMul'] == False
        assert json.loads(res['body'])['preset'] == None
        assert json.loads(res['body'])['shuffleTime'] == None

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_more_list_instance(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = [
            ['id', 'name', 1], ['id2', 'name2', 1]]
        mock_cursor.fetchone.return_value = [
            'id', 0, 'id2', True, None, datetime.datetime(2020, 5, 17)]
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        res = app.handler(good_api_event(), "")

        assert res['statusCode'] == 200
        assert len(json.loads(res['body'])['lists']) == 2
