import json

with open('../../json/publisher.json') as f:
    data = json.load(f)

for i in range(len(data['publisher'])):
    data['publisher'][i]['pub_id'] += 1

with open('../newdata/publisher.json','w') as outfile:
    json.dump(data, outfile)