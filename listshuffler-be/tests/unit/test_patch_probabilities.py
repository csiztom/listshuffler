from unittest import TestCase, mock
from src.patch_probabilities import app

def apigw_event():
    """ Generates API GW Event"""

    return {
        "body": """{ 
            "adminID": "", 
            "listID": "", 
            "probabilities": {
                "id":{
                    "id":1,
                    "id2":1,
                    "id3":1
                }, 
                "id2":{
                    "id":1,
                    "id2":1,
                    "id3":1
                },
                "id3":{
                    "id":1,
                    "id2":1,
                    "id3":1
                }
            }
        }""",
        "queryStringParameters": {"foo": "bar"},
    }

class TestPatchInstance(TestCase):
    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_notExistingInstance(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = None
        mock_cursor.fetchall.return_value = []
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(apigw_event(), "")['statusCode'] == 404

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_emptyProbabilities(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = ['id', 'id']
        mock_cursor.fetchall.return_value = []
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(apigw_event(), "")['statusCode'] == 200

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_success(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = ['id', 'id']
        mock_cursor.fetchall.return_value = [['id', 'id2', 1],['id2', 'id2', 1],['id2', 'id3', 1]]
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(apigw_event(), "")['statusCode'] == 200
