import mysql.connector
import json

class Game:
    """
    Game's information to mysql database
    """

    def __init__(self):
        with open('newdata/game.json') as f:
            self.data = json.load(f)

    def insertDB(self, connection):
        cursor = connection.cursor()


        sql_q = """ insert into game
                    values
                    (%s, %s, %s, %s, %s, %s)"""
        val = []

        for item in self.data['game']:
            val += [(item['game_id'],item['title'],item['qrating'],item['mrating'],item['dev_id'],item['pub_id'])]

        cursor.executemany(sql_q,val)

        connection.commit()

        cursor.close()