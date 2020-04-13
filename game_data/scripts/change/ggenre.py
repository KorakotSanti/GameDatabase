import json

with open('../../json/gamegenre.json') as f:
    data = json.load(f)

for i in range(len(data['game_genre'])):
    data['game_genre'][i]['game_id'] += 1
    data['game_genre'][i]['genre_id'] = [i+1 for i in data['game_genre'][i]['genre_id']]

with open('../newdata/gamegenre.json','w') as outfile:
    json.dump(data, outfile)