import json

with open('../../json/genre.json') as f:
    data = json.load(f)

for i in range(len(data['genre'])):
    data['genre'][i]['id'] += 1

with open('../newdata/genre.json','w') as outfile:
    json.dump(data, outfile)