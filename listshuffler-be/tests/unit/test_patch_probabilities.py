from unittest import TestCase, mock
from src.patch_probabilities import app

def good_api_event():
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
        "queryStringParameters": None
    }

def bad_api_event():
    return {
        "body": None,
        "queryStringParameters": None
    }

def bad_type_api_event():
    return {
        "body": """{ 
            "adminID": "", 
            "listID": "", 
            "probabilities": ""
        }""",
        "queryStringParameters": None
    }

def bad_keys_api_event():
    return {
        "body": """{ 
            "adminID": "", 
            "listID": "", 
            "probabilities": {
                "id9":{
                    "id9":1,
                    "id29":1,
                    "id39":1
                }, 
                "id29":{
                    "id9":1,
                    "id29":1,
                    "id39":1
                },
                "id39":{
                    "id9":1,
                    "id29":1,
                    "id39":1
                }
            }
        }""",
        "queryStringParameters": None
    }

class TestPatchInstance(TestCase):
    def test_bad_api_call(self):
        assert app.handler(bad_api_event(), "")['statusCode'] == 400

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_non_existing_instance(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = None
        mock_cursor.fetchall.return_value = []
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(good_api_event(), "")['statusCode'] == 404

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_empty_probabilities(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = ['id', 'id']
        mock_cursor.fetchall.return_value = []
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(good_api_event(), "")['statusCode'] == 200

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_success(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = ['id', 'id']
        mock_cursor.fetchall.return_value = [['id', 'id2', 1],['id2', 'id2', 1],['id2', 'id3', 1]]
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(good_api_event(), "")['statusCode'] == 200

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_bad_type(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = ['id', 'id']
        mock_cursor.fetchall.return_value = [['id', 'id2', 1],['id2', 'id2', 1],['id2', 'id3', 1]]
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(bad_type_api_event(), "")['statusCode'] == 400

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_bad_keys(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = ['id', 'id']
        mock_cursor.fetchall.return_value = [['id', 'id2', 1],['id2', 'id2', 1],['id2', 'id3', 1]]
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        assert app.handler(bad_keys_api_event(), "")['statusCode'] == 400
