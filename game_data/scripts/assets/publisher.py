import mysql.connector
import json

class Publisher:
    """
    Publisher's data to mysql database
    """

    def __init__(self):
        with open('newdata/publisher.json') as f:
            self.data = json.load(f)

    def insertDB(self, connection):
        cursor = connection.cursor()


        sql_q = """ insert into publisher
                    values
                    (%s, %s, %s)"""
        val = []

        for item in self.data['publisher']:
            val += [(item['pub_id'],item['pubname'],item['est'])]

        cursor.executemany(sql_q,val)

        connection.commit()

        cursor.close()