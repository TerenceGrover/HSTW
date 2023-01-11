from pymongo import MongoClient
from pymongo.server_api import ServerApi
from flask_cors import CORS
import os
from flask import Flask
from dotenv import load_dotenv

load_dotenv()
DB_STRING = os.getenv('DB_STRING')

client = MongoClient(DB_STRING, 
server_api=ServerApi('1'))
db = client.test
collection = db.test_collection

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Welcome Home :) !"


if __name__ == "__main__":
    app.run()