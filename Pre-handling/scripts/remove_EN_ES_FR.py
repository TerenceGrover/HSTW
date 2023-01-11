import json

english_txt = open('../data/LANG/english_sources.txt')
lines = english_txt.read().split(' \n')
french_txt = open('../data/LANG/french_sources.txt')
lines = french_txt.read().split(' \n')
spanish_txt = open('../data/LANG/spanish_sources.txt')
lines += spanish_txt.read().split(' \n')

print(lines)

with open('../../server/data/10-01-23.json') as parsed:
  parsedloaded = json.load(parsed)
  zib = 0
  zob = 0
  for country in parsedloaded.items():
    for hl in country[1]:
      zib += len(hl)
      if country[0] not in lines:
        zob += len(hl)
  print(zib)
  print(zob)