import mysql.connector
import json

class Developer:
    """
    Class to add developer data into the mysql database
    """
    def __init__(self):
        with open('newdata/developer.json') as f:
            self.data = json.load(f)

    def insertDB(self, connection):
        cursor = connection.cursor()


        sql_q = """ insert into developer
                    values
                    (%s, %s, %s)"""
        val = []

        for item in self.data['dev']:
            val += [(item['dev_id'],item['devname'],item['est'])]

        cursor.executemany(sql_q,val)

        connection.commit()

        cursor.close()