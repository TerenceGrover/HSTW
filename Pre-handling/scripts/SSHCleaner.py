import os
from dotenv import load_dotenv
import pandas as pd

from datetime import datetime
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import paramiko
from DBPush import getAllDocumentsDate

load_dotenv()
DB_STRING = os.getenv('DB_STRING')
HOSTNAME = os.getenv('HOSTNAME')
SSH_PASSWORD = os.getenv('SSH_PASSWORD')
SSH_USERNAME = os.getenv('SSH_USERNAME')

client = MongoClient(DB_STRING,
                     server_api=ServerApi('1'))
db = client.HSTW
collection = db.Processed

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(hostname = HOSTNAME, password = SSH_PASSWORD , username=SSH_USERNAME)

def cleaner():

    DBData = getAllDocumentsDate()

    # Get the last 2 dates from the DB
    last = DBData.iloc[-1]['date']
    secondToLast = DBData.iloc[-2]['date']

    # Delete all SSH files that are not the last 2
    for date in DBData['date']:
        if date != last and date != secondToLast:
            ssh.exec_command(f'cd /home/flaskApp/data/TODAY && rm {date}')