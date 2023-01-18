from pymongo import MongoClient
from pymongo.server_api import ServerApi
import pandas as pd

import scripts.RSS_explorer as rss
from dotenv import load_dotenv
from datetime import datetime
import os

from flask import Flask
from flask import request
from flask_cors import CORS
import click
from datetime import timedelta


load_dotenv()
DB_STRING = os.getenv('DB_STRING')

client = MongoClient(DB_STRING,
                     server_api=ServerApi('1'))
db = client.HSTW
collection = db.Processed

app = Flask(__name__)
CORS(app)


@app.cli.command('emergency')
@click.argument('country')
def emergency(country):
    rss.emergencyRecall(country)

@app.cli.command('update_idx')
def update_idx():
    rss.recalculateGlobal()

@app.cli.command('scrape')
def scrape():
    rss.scrapeSources()


@app.route("/")
def home():
    return """
    <body style:'height:100vh;width:100vw;'>
        <div style='position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;justify-content:center;align-items:center'>
            <h1 style='text-align:center'><a href="/today">Get the news from Today in JSON</a></h1>
            <span style='text-align:center'>Browsing instructions (Any argument is optional)</span>
            <ul>
                <li>/idx?date=<b>DATE</b>&code=<b>CODE</b>> To get the world index on certain dates or for certain country</li>
                <li>/today?code=<b>CODE</b>> To get the info of a certain country today</li>
                <li>/request?date=<b>DATE</b>&code=<b>CODE</b>> To get full info on a certain date for a certain country</li>
                <li>/past?code=<b>CODE</b>&days=<b>DAYS</b>> To get all past info from a country for the past <b>DAYS</b> days</li>
            </ul>
        </div>
    </body>
"""


@app.route("/request", methods=['GET'])
def returnDate():
    args = request.args
    date = args.get('date')

    if args.get('code'):
        code = args.get('code')
        if len(code) < 6 and date.count('-') == 2 and len(date) == 8:
            data = collection.find_one({'date': date})['data'][code]
        else:
            return 'Bad Request', 400

    else:
        data = collection.find_one({'date': date})['data']

    return {date: data}


@app.route("/today", methods=['GET'])
def returnToday():
    now = datetime.now()
    today = now.strftime('%d-%m-%y')
    yesterday = now.today() - timedelta(days=1)
    args = request.args


    code = args.get('code')
    try:
        data = collection.find_one({'date': today})['data'][code] if code and len(code) < 6 else collection.find_one({'date': today})['data']
        return {today: data}
    except:
        days_to_backtrack = 10
        while days_to_backtrack > 0:
            yesterday_parsed = yesterday.strftime('%d-%m-%y')
            data = collection.find_one({'date': yesterday_parsed})['data'][code] if code else collection.find_one({'date': yesterday_parsed})['data']
            if data:
                return {yesterday_parsed: data}
            else:
                yesterday = now.yesterday() - timedelta(days=1)
                days_to_backtrack = - 1
        pass
    return 'Bad Request', 400


@app.route("/idx", methods=['GET'])
def returnIdx():
    args = request.args
    date = args.get('date')

    if args.get('code'):
        code = args.get('code')
        if len(code) < 6 and date.count('-') == 2 and len(date) == 8:
            data = collection.find_one({'date': date})['data'][code]['idx']
            return {date: data}
        else:
            return 'Bad Request', 400

    else:
        if date.count('-') == 2 and len(date) == 8:
            data = collection.find_one({'date': date})['data']
            indices = {}
            for country, countryData in data.items():
                try:
                    indices[country] = countryData['idx']
                except:
                    indices[country] = 0
            return {date: indices}
        else:
            return 'Bad Request', 400


@app.route("/past")
def returnPast():
    code = request.args.get('code')
    days = request.args.get('days')
    now = datetime.now()
    target_day = now.today()
    data = []

    try:
        for x in range(int(days)):
            data.append({'date' : target_day.strftime('%d-%m-%y'), 'data' : collection.find_one({'date': target_day.strftime('%d-%m-%y')})['data'][code]['idx']})
            target_day -= timedelta(days=1)
        return data
    except:
        return 'Bad Request', 400

if __name__ == "__main__":
    app.run()
