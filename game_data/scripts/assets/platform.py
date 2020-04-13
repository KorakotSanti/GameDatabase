import mysql.connector
import json

class Platform:
    """
    Platform's data to mysql database
    """

    def __init__(self):
        with open('newdata/platform.json') as f:
            self.data = json.load(f)

    def insertDB(self, connection):
        cursor = connection.cursor()


        sql_q = """ insert into platform
                    values
                    (%s, %s)"""
        val = []

        for item in self.data['platform']:
            val += [(item['platformid'],item['pname'])]

        cursor.executemany(sql_q,val)

        connection.commit()

        cursor.close()
