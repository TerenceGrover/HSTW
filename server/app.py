from pymongo import MongoClient
from pymongo.server_api import ServerApi
import pandas as pd

from scripts.RSS_explorer import scrapeSources
from dotenv import load_dotenv
from datetime import datetime
import os

from flask import Flask
from flask import request
from flask_cors import CORS


load_dotenv()
DB_STRING = os.getenv('DB_STRING')

client = MongoClient(DB_STRING,
                     server_api=ServerApi('1'))
db = client.HSTW
collection = db.Processed

app = Flask(__name__)
CORS(app)


@app.cli.command('email')
def test_cli():
    print('hola')


@app.route("/")
def home():
    return "Welcome Home updated :) !"


@app.route("/request", methods=['GET'])
def returnDate():
    args = request.args
    date = args.get('date')

    if args.get('code'):
        code = args.get('code')
        data = collection.find_one({'date': date})['data'][code]

    else:
        data = collection.find_one({'date': date})['data']

    return {date : data}


@app.route("/today", methods=['GET'])
def returnToday():
    now = datetime.now()
    today = now.strftime('%d-%m-%y')
    args = request.args

    if args:
        code = args.get('code')
        data = collection.find_one({'date': today})['data'][code]

    else:
        data = collection.find_one({'date': today})['data']

    return {today : data}

@app.route("/idx", methods=['GET'])
def returnIdx():
    args = request.args
    date = args.get('date')

    if args.get('code'):
        code = args.get('code')
        data = collection.find_one({'date': date})['data'][code]['idx']
        return {date : data}
    
    else:
        data = collection.find_one({'date': date})['data']
        indices = {}
        for country, countryData in data.items():
            try:
                indices[country] = countryData['idx']
            except:
                indices[country] = 0
        return {date : indices}

if __name__ == "__main__":
    app.run(port=5001)
