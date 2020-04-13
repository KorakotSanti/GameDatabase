import mysql.connector
from config.config import username, password, host, db
from assets.genre import Genre
from assets.platform import Platform
from assets.developer import Developer
from assets.publisher import Publisher
from assets.game import Game
from assets.game_genre import GameGenre
from assets.game_platform import GamePlatform

if __name__ == "__main__":
    connection = mysql.connector.connect(user=username, password=password,
                                    host=host,
                                    database=db)

    # add the genre data to genre table
    inGenre = Genre()
    inGenre.insertDB(connection)

    # add the platform data to platform table
    inPlatform = Platform()
    inPlatform.insertDB(connection)

    # developer data
    indev = Developer()
    indev.insertDB(connection)

    # publisher data
    inpub = Publisher()
    inpub.insertDB(connection)

    # game title data
    inGame = Game()
    inGame.insertDB(connection)

    # game's genre data
    inGG = GameGenre()
    inGG.insertDB(connection)

    # game's platform data
    inGP = GamePlatform()
    inGP.insertDB(connection)

    connection.close()