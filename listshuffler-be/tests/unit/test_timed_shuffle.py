from unittest import TestCase, mock
from src.timed_shuffle import app
from src.helpers import shuffle

class TestTimedShuffle(TestCase):
    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    def test_non_existing_instance(self, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchone.return_value = None
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        app.handler(None, "")

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    @mock.patch('src.helpers.shuffle', autospec=True)
    def test_error(self, mock_shuffle, mock_pymysql):
        mock_shuffle.shuffle.side_effect = shuffle.ShuffleError('Test')
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = [["id"]]
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        app.handler(None, "")

    @mock.patch('src.helpers.rds_config.pymysql', autospec=True)
    @mock.patch('src.helpers.shuffle', autospec=True)
    def test_success(self, mock_shuffle, mock_pymysql):
        mock_cursor = mock.MagicMock()
        mock_cursor.fetchall.return_value = [["id"],["id"]]
        mock_pymysql.connect.return_value.cursor.return_value.__enter__.return_value = mock_cursor
        app.handler(None, "")