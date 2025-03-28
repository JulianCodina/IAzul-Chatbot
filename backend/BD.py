import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Fetch variables
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

def conectar():# Connect to the database
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
    description = cursor.description  # Guardamos la descripción antes de cerrar
    cursor.close()
    connection.close()
    return result, description



    