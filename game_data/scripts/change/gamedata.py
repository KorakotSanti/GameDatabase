import json

with open('../../json/game.json') as f:
    data = json.load(f)

for i in range(len(data['game'])):
    data['game'][i]['game_id'] += 1
    data['game'][i]['dev_id'] += 1
    data['game'][i]['pub_id'] += 1
    if data['game'][i]['qrating'] is not None:
        if data['game'][i]['qrating'][:2] == '10':
            data['game'][i]['qrating'] = float(data['game'][i]['qrating'][:2])
        else:
            data['game'][i]['qrating'] = float(data['game'][i]['qrating'][:3])

with open('../newdata/game.json','w') as outfile:
    json.dump(data, outfile)
