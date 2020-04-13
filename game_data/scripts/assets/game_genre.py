import mysql.connector
import json

class GameGenre:
    """
    Game's Genre table data to mysql database
    """
    def __init__(self):
        with open('newdata/gamegenre.json') as f:
            self.data = json.load(f)

    def insertDB(self, connection):
        cursor = connection.cursor()


        sql_q = """ insert into game_genre
                    values
                    (%s, %s)"""
        val = []

        for item in self.data['game_genre']:
            for i in item['genre_id']:
                val += [(item['game_id'],i)]

        cursor.executemany(sql_q,val)

        connection.commit()

        cursor.close()