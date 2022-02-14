#config file containing credentials for RDS MySQL instance
import os

db_host = os.environ['RDS_ENDPOINT']
db_username = os.environ['RDS_USER']
db_password = os.environ['RDS_PWD']
db_name = "public" 