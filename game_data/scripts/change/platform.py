import json

with open('../../json/platform.json') as f:
    data = json.load(f)

for i in range(len(data['platform'])):
    data['platform'][i]['platformid'] += 1

with open('../newdata/platform.json','w') as outfile:
    json.dump(data, outfile)