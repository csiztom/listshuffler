from unittest import TestCase, mock
from src.patch_list import app

def apigw_event():
    """ Generates API GW Event"""

    return {
        "body": '{ "listID": "", "listName": "", "multiplicity": 1}',
        "queryStringParameters": {"foo": "bar"},
    }

class TestPatchList(TestCase):
    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_notExistingList(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = None
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(apigw_event(), "")['statusCode'] == 404

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_error(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_pymysql.connect.return_value.commit.side_effect = Exception('Test')
        mock_cursor.fetchone.return_value = ['id']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(apigw_event(), "")['statusCode'] == 400

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_success(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = ['id']
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(apigw_event(), "")['statusCode'] == 200
