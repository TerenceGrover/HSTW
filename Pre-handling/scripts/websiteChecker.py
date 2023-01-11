import requests

# LOOPING OVER ALL LINKS

with open('../data/FeedURLSComplete.txt') as urls:
  with open('../data/404FeedNew.txt', 'a') as fourOfour:
    with open('../data/last.txt', 'w') as last:
      for url in urls:
        urlparsed = url.strip()
        last.write(urlparsed + '\n')
        try:
          # ADDING A TIMEOUT VARIABLE TO AVOID INFINITE LOOPING
          response = requests.get(urlparsed, timeout=10)
          if (response.status_code == 404 or 
          response.status_code == 403 or 
          response.status_code == 402 or
          response.status_code == 500):
              fourOfour.write(urlparsed + '\n')
          else:
              print('Web site exists')
        except Exception:
          fourOfour.write(urlparsed + '\n')
          print('exception')
          continue