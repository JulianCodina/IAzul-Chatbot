import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

def conectar():
    try:
        connection = psycopg2.connect(
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT,
            dbname=DBNAME
        )
        cursor = connection.cursor()
        return cursor, connection
    except Exception as e:
        print(f"Failed to connect: {e}")
        return 0, 0

def send_query(query):
    cursor, connection = conectar()
    cursor.execute(query)
    result = cursor.fetchall()
    description = cursor.description
    cursor.close()
    connection.close()
    return result, description



    