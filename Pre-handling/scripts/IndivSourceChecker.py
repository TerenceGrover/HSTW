import feedparser

def scrapeSources(url):

    # Initialize an empty dictionary to store the results
    char_counter = 0

    try:
      feed = feedparser.parse(url)
    except:
      print('failed')

    titles = []
    dates = []

    try:
        for entry in feed.entries:
          if 5 <= len(entry.title) <= 80:
              titles.append(entry.title)
    except:
        print('failed part 2')

            # Use list extend to add the titles to the headlines list
    
    print(titles, dates)

# scrapeSources('https://www.irrawaddy.com/feed')
scrapeSources('https://www.khmertimeskh.com/feed/')