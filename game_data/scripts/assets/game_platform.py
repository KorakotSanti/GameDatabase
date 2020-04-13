import mysql.connector
import json

class GamePlatform:
    """
    Game's platform data to table into mysql database
    """
    def __init__(self):
        with open('newdata/gameplat.json') as f:
            self.data = json.load(f)

    def insertDB(self, connection):
        cursor = connection.cursor()


        sql_q = """ insert into game_platform
                    values
                    (%s, %s, %s)"""
        val = []

        for item in self.data['game_platform']:
            val+=[(item['game_id'],item['plat_id'],item['release_date'])]

        cursor.executemany(sql_q,val)

        connection.commit()

        cursor.close()