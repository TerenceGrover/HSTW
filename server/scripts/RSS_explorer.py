import os
from dotenv import load_dotenv
import feedparser
import boto3
import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import json
import string
from datetime import datetime, date, timedelta
from pymongo import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()
DB_STRING = os.getenv('DB_STRING')
ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
SECRET_KEY = os.getenv('AWS_SECRET_KEY')

client = MongoClient(DB_STRING, 
server_api=ServerApi('1'))
db = client.test
collection = db.test_collection

now = datetime.now()
time1 = now.strftime('%H:%M')
today = now.strftime('%d-%m-%y')

sources_EN = {'en': ['AS', 'AG', 'AU', 'BS', 'BB', 'BZ', 'BM', 'DM', 'FO', 'FJ', 'GM', 'GH', 'GI', 'GD', 'GY', 'IN', 'IE', 'IM', 'JM', 'JE', 'LS', 'LR', 'MW', 'MT', 'MH', 'MU', 'NZ', 'SH', 'WS', 'SC', 'SB', 'ZA', 'KN', 'LC', 'VC', 'TC', 'GB', 'AE', 'US', 'VI', 'ZM']}
sources_FR = {'fr':['DZ', 'BE', 'BJ', 'TD', 'CD', 'FR', 'GF', 'PF', 'GA', 'GP', 'HT', 'ML', 'YT', 'NC', 'NE', 'CG', 'RE', 'SN', 'TG']}
sources_ES = {'es':['AD', 'AR', 'BO', 'CL', 'CR', 'CU', 'DO', 'EC', 'SV', 'GT', 'HN', 'PA', 'PE', 'PR', 'ES', 'UY', 'VE']}

sources = sources_EN['en'] + sources_FR['fr'] + sources_ES['es']

def scrapeSources():

  global time1
  global today

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
  print(f'Time 1 : {time1}')
  print(newNow.strftime('Time 2 : %H:%M'))
  print(f'Characters {char_counter}')
  print(f'HeadLines {hl_counter}')

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
  return len(words) > 0

def removeStopWords(sentence):

    words = word_tokenize(sentence)
    # Remove stopwords from the list of words
    words = [word for word in words if word.lower() not in english_stopwords]
    # Join the remaining words back into a sentence
    return " ".join(words)

#####################################################

def processor(headlines, country):

  global today
  global sources

  if country not in sources:
    trans = translateHL(headlines,country)
  else:
    trans = headlines

  try:
  # Open the JSON file
    with open(f"../data/{today}test.json", 'r') as file:
      writable = json.loads(file.read())
    file.close()

  except FileNotFoundError:
      print(f"Error: The file '{today}test.json' does not exist.")
      writable = {}

  except json.decoder.JSONDecodeError:
      print(f"Error: The file '{today}test.json' is not in json format.")
      writable = {}

  country_obj = {
    'idx' : sentimentHL(trans, country),
    'topics' : most_common_words(trans),
    'HL' : trans
  }

  writable[country] = country_obj
  print(writable[country])

  with open(f"../data/{today}.json", 'w', encoding='utf8') as file:
    json.dump(writable, file, ensure_ascii=False)

def translateHL(headlines, country):

  global today
  global sources

  if country not in sources:
    translated_texts = []
    for sentence in headlines:
      if not is_english(sentence):

        client = boto3.client(
          'translate',
          region_name='eu-west-1',
          aws_access_key_id=ACCESS_KEY,
          aws_secret_access_key=SECRET_KEY)

        try:
          response = client.translate_text(
            Text = sentence,
            SourceLanguageCode = 'auto',
            TargetLanguageCode = 'en'
          )
          
          translated_texts.append(response['TranslatedText'])

        except Exception as e:
          print(e)

      else: 
        translated_texts.append(sentence)

    return translated_texts

def sentimentHL(translatedHL, country):

  global sources

  try:
    str = " ".join(translatedHL)
  except:
    print(Exception)
    pass

  client = boto3.client(
    'comprehend',
    region_name='eu-west-1',
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,)

  if country in sources_ES:
    try:
      response = client.detect_sentiment(
        Text = str,
        LanguageCode = 'es'
      )
    except Exception as e:
      print(e)

  elif country in sources_FR:
    try:
      response = client.detect_sentiment(
        Text = str,
        LanguageCode = 'fr'
      )
    except Exception as e:
      print(e)

  else:
    str = removeStopWords(str)
    try:
      response = client.detect_sentiment(
        Text = str,
        LanguageCode = 'en'
      )
    except Exception as e:
      print(e)
  
  idx = {
    'P' : response['SentimentScore']['Positive'],
    'N' : response['SentimentScore']['Negative'],
    'Nu' : response['SentimentScore']['Neutral'],
    'M' : response['SentimentScore']['Mixed']
  }

  return idx

def most_common_words(headlines):
  joined = " ".join(headlines.strip(string.punctuation))
  noStopword = removeStopWords(joined)
  tokens = word_tokenize(noStopword)
  fdist = nltk.FreqDist(tokens)
  most_common_words = [word for word, freq in fdist.items() if freq >= 2]
  most_common_words = fdist.most_common(5)

  return most_common_words

def cleaner():
  yesterday = date.today() - timedelta(days=1)
  yesterday_parsed = yesterday.strftime('%d-%m-%y')

  try:
    if os.path.exists(f"../data/{yesterday_parsed}.json"):
      print('exists')
      # To implement after making sure the DB has a file from that date
      # os.remove("demofile.txt")
  except:
    pass



scrapeSources()



# CHECKER FOR INDIVIDUAL LINKS FOR MANUAL GATHERING

# feed = feedparser.parse('http://en.althawranews.net//feed')
# topHeadlines = []
# try:
#   for entry in feed.entries:
#     if len(topHeadlines) > 5:
#       break
#     else : 
#       topHeadlines.append(entry.title)
#   if len(topHeadlines) != 0:
#     pp(topHeadlines,indent=2)
# except:
#   print('Error')