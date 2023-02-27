import os
from dotenv import load_dotenv
import pandas as pd

from datetime import datetime
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import paramiko
import json

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

def getAllDocumentsDate():
    cursor = collection.find({}, {'date': 1, '_id': 0})
    # ADD .json to the date and return as a dataframe
    return pd.DataFrame([f'{x["date"]}.json' for x in cursor], columns=['date'])

def getNamesOfAllJSONFilesFromSSH():
    stdin, stdout, stderr = ssh.exec_command('cd /home/flaskApp/data/TODAY && ls')
    # Sort by date and return Date format is 01-01-2021.json
    sortedData = sorted(stdout.read().decode('utf-8').split(), key=lambda x: datetime.strptime(x, '%d-%m-%y.json'))
    # Return as a dataframe
    return pd.DataFrame(sortedData, columns=['date'])

def getAllMissingFiles():
    # Get all the dates from the DB
    allDates = getAllDocumentsDate()
    # Get all the dates from the SSH
    allDatesFromSSH = getNamesOfAllJSONFilesFromSSH()
    # Check all missing dates from the DB
    missingDates = allDatesFromSSH[~allDatesFromSSH['date'].isin(allDates['date'])]
    # Return the missing dates
    return missingDates

def sendMissingFilesToDB():
    # Get all the missing dates
    missingDates = getAllMissingFiles()
    # Loop through all the missing dates
    for date in missingDates['date']:
      # Get the file from the SSH
        stdin, stdout, stderr = ssh.exec_command(f'cd /home/flaskApp/data/TODAY && cat {date}')
        # Read the output
        stdout = stdout.read().decode('utf-8')
        # Convert the data json to a dict
        stdout = json.loads(stdout)
        # Send the file to the DB
        collection.insert_one({'date': date[:-5], 'data': stdout})
        print(f'Sent {date} to the DB')

def cleaner():

    DBData = getAllDocumentsDate()

    # Get the last 2 dates from the DB
    last = DBData.iloc[-1]['date']
    secondToLast = DBData.iloc[-2]['date']

    # Delete all SSH files that are not the last 2
    for date in DBData['date']:
        if date != last and date != secondToLast:
            ssh.exec_command(f'cd /home/flaskApp/data/TODAY && rm {date}')
