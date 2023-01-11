import json
from pprint import pp
import re

# CREATING THE DICT AND LOOPiNG OVER THE ORIGINAL FILE TO PARSE IT
dict = {}

with open('../data/news_source.json') as f:
  news = json.load(f)

for country in news.keys():
  dict.update({country : {}})
#   for source in news[country]["newSources"]:
#     for feedUrl in source["feedUrls"]:
#       dict[country].update({feedUrl["title"] : feedUrl["url"]})

# DUMPING THE RESULTS OF MY DICT PARSING

# with open('FeedURLS.json', 'w') as parsed:
#   json.dump(dict, parsed, ensure_ascii=False)

# SECOND VERSION OF THE PARSING. I THINK BOTH WORK 

# with open('news_source.json') as f:
#   news = json.load(f)

# GATHERING ONLY LINKS FOR USING THEM IN WEBSITE CHECKER

# with open('FeedURLS.txt', 'a') as parsed:
#   for country in news.keys():
#     dict.update({country : {"feeds" : {}}})
#     for source in news[country]["newSources"]:
#       for feedUrl in source["feedUrls"]:
#           parsed.write(feedUrl["url"] + '\n')


# FROM HERE, I AM SANITIZING MY RESULTS BY REMOVING UNWANTED ONES
# I AM ALSO GETTING RID OF ALL THE DEAD LINKS ACCUMULATED IN WEBSITE CHECKER

# with open('../data/FeedURLS.json') as parsed:
#   parsedObj = json.load(parsed)

# with open('../data/URL_ParsedFinal.json') as final:
#   news2 = json.load(final)

# fOf = []
# counter = 0
# comm = re.compile(r'.*\sCom.*', re.IGNORECASE)
# comm2 = re.compile(r'.*/comments/.*', re.IGNORECASE)
# nullMatch = re.compile(r'null', re.IGNORECASE)
# fb = re.compile(r'.*facebook.*', re.IGNORECASE)

# with open('../data/404FeedNew.txt') as fOfile:
#   for link in fOfile:
#     fOf.append(link.strip())

#   for country in news2.items():
#     for el in country[1].items():
#       if (el[1] not in fOf
#       and not re.match(comm, el[0])
#       and not re.match(nullMatch, el[0])
#       and not re.match(fb, el[1])
#       and len(dict[country[0]].values()) < 5
#       and not re.match(comm2, el[1])):
#         counter += 1
#         dict[country[0]].update({el[0] : el[1]})

# with open('final_parsed2.json', 'a') as parsed:
#   json.dump(dict, parsed, ensure_ascii=False)


# GETTING ALL COUNTRIES THAT DO NOT HAVE NEWS SOURCE

# with open('../data/FINAL_POST_SAN.json') as parsed:
#   json_obj = json.load(parsed)
#   dict = {}
#   emptyNews = []

#   for elem in json_obj.items():
#     dict[elem[0]] = 0
#     for link in elem[1].values():
#       dict[elem[0]] += 1
#   for elem in dict.items():
#     if elem[1] == 0:
#       emptyNews.append(elem[0])

#   print(emptyNews)