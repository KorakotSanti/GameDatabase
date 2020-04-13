import json

with open('../../json/gameplat.json') as f:
    data = json.load(f)

for i in range(len(data['game_platform'])):
    data['game_platform'][i]['game_id'] += 1
    data['game_platform'][i]['plat_id'] += 1

with open('../newdata/gameplat.json','w') as outfile:
    json.dump(data, outfile)