import boto3
import warnings
import os

def lambda_client():
    warnings.filterwarnings(action="ignore", message="unclosed", category=ResourceWarning)
    return boto3.client('lambda',
                        aws_access_key_id=os.environ['LS_ACCESS_KEY'],
                        aws_secret_access_key=os.environ['LS_SECRET_ACCESS_KEY'],
                        region_name='eu-central-1')