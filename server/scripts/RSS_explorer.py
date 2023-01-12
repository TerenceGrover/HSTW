import sys
import os
from dotenv import load_dotenv

import feedparser
import boto3
import nltk
import pandas as pd
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

import json
import string

from datetime import datetime, date, timedelta
from pymongo import MongoClient
from pymongo.server_api import ServerApi

from smtplib import SMTP

load_dotenv()

ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
SECRET_KEY = os.getenv('AWS_SECRET_KEY')
DB_STRING = os.getenv('DB_STRING')

client = MongoClient(DB_STRING,
                     server_api=ServerApi('1'))
db = client.HSTW
collection = db.Processed

now = datetime.now()
time1 = now.strftime('%H:%M')
today = now.strftime('%d-%m-%y')

sources_EN = {'en': ['AS', 'AG', 'AU', 'BS', 'BB', 'BZ', 'BM', 'DM', 'FO', 'FJ', 'GM', 'GH', 'GI', 'GD', 'GY', 'IN', 'IE', 'IM', 'JM',
                     'JE', 'LS', 'LR', 'MW', 'MT', 'MH', 'MU', 'NZ', 'SH', 'WS', 'SC', 'SB', 'ZA', 'KN', 'LC', 'VC', 'TC', 'GB', 'AE', 'US', 'VI', 'ZM']}
sources_FR = {'fr': ['DZ', 'BE', 'BJ', 'TD', 'CD', 'FR', 'GF', 'PF',
                     'GA', 'GP', 'HT', 'ML', 'YT', 'NC', 'NE', 'CG', 'RE', 'SN', 'TG']}
sources_ES = {'es': ['AD', 'AR', 'BO', 'CL', 'CR', 'CU', 'DO',
                     'EC', 'SV', 'GT', 'HN', 'PA', 'PE', 'PR', 'ES', 'UY', 'VE']}
sources = sources_EN['en'] + sources_FR['fr'] + sources_ES['es']


def scrapeSources():

    # Read the JSON file into a dataframe
    df = pd.read_json('../data/sourceLinks.json', typ='series')

    # Initialize an empty dictionary to store the results
    char_counter = 0

    # Iterate over the rows of the dataframe
    for country, links in df.items():
        print(country)
        headlines = []

        # Iterate over the links for each country
        for link in links.values():
            try:
                feed = feedparser.parse(link)
            except:
                continue

            title_counter = 0
            hl_counter = 0
            titles = []

            # Use list comprehension to select the entries that meet the conditions
            try:
                for entry in feed.entries:
                    if 5 <= len(entry.title) <= 60 and title_counter <= 4 and len(headlines) <= 10:
                        titles.append(entry.title)
                        char_counter += len(entry.title)
                        title_counter += len(titles)
            except:
                continue

            # Use list extend to add the titles to the headlines list
            headlines.extend(titles)
            hl_counter += len(titles)

        # Call the processor with headlines and country as args
        processor(headlines, country)

    # Print the time and character count
    newNow = datetime.now()
    print(f'Characters {char_counter}')
    print(f'HeadLines {hl_counter}')

    with open(f"../data/TODAY/{today}.json", 'r') as file:
        readable = json.loads(file.read())
        createWorldObject(readable)
        # sendToDB(readable)

    print(f'Time 1 : {time1}')
    print(newNow.strftime('Time 2 : %H:%M'))

####### HELPER FUNCTIONS TO CHECK SENTENCES ##########


english_stopwords = set(stopwords.words("english"))


def is_ascii(word):

    return all(ord(c) < 128 for c in word)


def is_english(sentence):

    if not is_ascii(sentence):
        return False
    words = word_tokenize(sentence)
    words = [word.lower() for word in words if word.isalpha()]
    words = [word for word in words if word not in english_stopwords]
    return len(words) >= 2


def removeStopWords(sentence):

    words = word_tokenize(sentence)
    # Remove stopwords from the list of words
    words = [word for word in words if word.lower() not in english_stopwords]
    # Join the remaining words back into a sentence
    return " ".join(words)

#####################################################


def processor(headlines, country):

    if country not in sources:
        trans = translateHL(headlines, country)
    else:
        print(f'NOT CALLED FOR TRANSLATION : {country}')
        trans = headlines

    try:
        # Open the JSON file
        with open(f"../data/TODAY/{today}.json", 'r') as file:
            writable = json.loads(file.read())
        file.close()

    except FileNotFoundError:
        print(f"Error: The file '{today}.json' does not exist.")
        writable = {}

    except json.decoder.JSONDecodeError:
        print(f"Error: The file '{today}.json' is not in json format.")
        writable = {}

    if len(trans) > 0:

        country_obj = {
            'idx': sentimentHL(trans, country),
            'topics': most_common_words(trans),
            'HL': trans
        }

    else:
        country_obj = 'VOID'

    writable[country] = country_obj
    print(writable[country])

    with open(f"../data/TODAY/{today}.json", 'w', encoding='utf8') as file:
        json.dump(writable, file, ensure_ascii=False)


def translateHL(headlines, country):

    if country not in sources:
        translated_texts = []
        for sentence in headlines:
            if not is_english(sentence):
                print(f'Pre {sentence} 🦧')

                client = boto3.client(
                    'translate',
                    region_name='eu-west-1',
                    aws_access_key_id=ACCESS_KEY,
                    aws_secret_access_key=SECRET_KEY)

                try:
                    response = client.translate_text(
                        Text=sentence,
                        SourceLanguageCode='auto',
                        TargetLanguageCode='en'
                    )
                    res = response['TranslatedText']
                    print(f'Post {res} 🦧')

                    translated_texts.append(res)

                except Exception as e:
                    sendEmailUponException(e)

            else:
                translated_texts.append(sentence)

        return translated_texts


def sentimentHL(translatedHL, country):

    try:
        str = " ".join(translatedHL)
    except Exception as e:
        sendEmailUponException(e)
        pass

    client = boto3.client(
        'comprehend',
        region_name='eu-west-1',
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,)

    if country in sources_ES:
        try:
            response = client.detect_sentiment(
                Text=str,
                LanguageCode='es'
            )
        except Exception as e:
            sendEmailUponException(e)

    elif country in sources_FR:
        try:
            response = client.detect_sentiment(
                Text=str,
                LanguageCode='fr'
            )
        except Exception as e:
            sendEmailUponException(e)

    else:
        str = removeStopWords(str)
        try:
            response = client.detect_sentiment(
                Text=str,
                LanguageCode='en'
            )
        except Exception as e:
            sendEmailUponException(e)

    idx = {
        'P': response['SentimentScore']['Positive'],
        'N': response['SentimentScore']['Negative'],
        'Nu': response['SentimentScore']['Neutral'],
        'M': response['SentimentScore']['Mixed']
    }

    return idx


def most_common_words(headlines):
    no_punct_hl = [headline.translate(str.maketrans(
        '', '', string.punctuation)) for headline in headlines]
    joined = " ".join(no_punct_hl)
    noStopword = removeStopWords(joined)
    tokens = word_tokenize(noStopword)
    fdist = nltk.FreqDist(tokens)
    most_common_words = [word.lower()
                         for word, freq in fdist.items() if freq >= 2]
    most_common_words = fdist.most_common(5)

    return [[word, freq] for word, freq in most_common_words if word == word.capitalize()]


def createWorldObject():
    print('world')


def sendToDB(file):
    collection.insert_one({'date': today, 'data': file})


def cleaner():

    yesterday = date.today() - timedelta(days=1)
    yesterday_parsed = yesterday.strftime('%d-%m-%y')

    try:
        if collection.find_one({'date': today}) != None and collection.find_one({'date': yesterday_parsed}) != None:
            print('today and yesterday are in the DB')
    except Exception as e:
        sendEmailUponException(e)

    try:
        if os.path.exists(f"../data/{yesterday_parsed}.json"):
            print('Yesterday exists')
    except Exception as e:
        sendEmailUponException(e)

    try:
        if os.path.exists(f"../data/TODAY/{today}.json"):
            print('Today exists')
            # To implement after making sure the DB has a file from that date
            # os.remove("demofile.txt")
    except Exception as e:
          sendEmailUponException(e)


def sendEmailUponException(e):

    exception_type, exception_object, exception_traceback = sys.exc_info()
    line_number = exception_traceback.tb_lineno

    GMAIL_USER = os.getenv('GMAIL_USER')
    GOOGLE_APP_PASS = os.getenv('GOOGLE_APP_PASS')

    host = "smtp.gmail.com"
    port = 587

    username = GMAIL_USER
    password = GOOGLE_APP_PASS

    from_email = username
    to_list = ("terencegrover@gmail.com")

    CON = SMTP(host, port)
    CON.ehlo()
    CON.starttls()
    CON.login(username, password)
    CON.sendmail(from_email, to_list,
                 'Subject: {}\n\n{}'.format('/! IMPORTANT HSTW /!', f"\n\n\nHOW'S THE WORLD : Exception\n\n\nTYPE : {exception_type}\nEXCEPTION : {e}\nLINE NUMBER : {line_number}"))
    CON.quit()


#### EXECUTE THE CHAIN ####
# scrapeSources()
#### EXECUTE THE CHAIN ####
