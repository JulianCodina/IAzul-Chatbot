from together import Together
from datetime import datetime
# import DB
import os
from dotenv import load_dotenv

# IMPORTANTE: 
# - descarga el Together con "pip install together"
# - listop

load_dotenv() # Cargar las variables de entorno
api_key = os.getenv("TOGETHER_API_KEY")  # Obtener la clave de la API de Together AI

# Schema de la base de datos
# conn, cursor = DB.conectar()
# schema = DB.get_schema()

# Conexion con la Api IA
client = Together(api_key = api_key)

old_consulta = ""  # Variable para almacenar la consulta anterior del usuario
old_explicacion = ""  # Variable para almacenar la explicacion anterior del ChatBot

old_consulta_text = old_consulta or "no hay"
old_explicacion_text = old_explicacion or "no hay"

def generar_sql(consulta):

    global old_consulta  # Declarar como global para poder modificarla
    global old_explicacion_text  # Declarar como global para poder modificarla

    old_consulta_text = old_consulta or "no hay"
    old_explicacion_text = old_explicacion or "no hay"

    prompt_sql = f"""
    1. *Contexto:*
       - Eres un asistente experto en bases de datos SQL
       - Un usuario te hizo una consulta, tu la tienes que convertir en consulta sql para traer la informacion deseada
       - Fecha actual: {datetime.today()}
       - Unicamente puedes hacer consultas SELECT

    2. *Instrucciones:*
       - Para ahorrar en tokens, solo selecciona los datos que le interesen al usuario
       - No incluyas explicaciones adicionales.
       
    3. *Consulta y explicacion anterior*
        consulta anterior: {old_consulta_text}
        explicacion anterior: {old_explicacion_text}

    4. *Consulta del usuario:*
       {consulta}

    5. *Ejemplos de respuestas válidas:*
       - SELECT nombre, apellido FROM personas WHERE rol = "tio";
       - SELECT nombre, edad FROM personas WHERE rol = "amigo";
       """

    AIresponse = client.chat.completions.create(
        model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
        messages=[{"role": "user", "content": prompt_sql}],
    )

    sql_query = AIresponse.choices[0].message.content

    # Recorte de cadena para evitar texto adicional
    start = sql_query.find("SELECT")
    end = sql_query.find(";", start) + 1
    if start != -1 and end != -1:
        sql_query = sql_query[start:end].strip()

    old_consulta = consulta  # Almacenar la consulta actual para la siguiente consulta

    return sql_query

def explicar_resultado(consulta, resultados):

    global old_explicacion  # Declarar como global para poder modificarla

    prompt_explicacion = f"""
    1. *Contexto:*
       - Eres un asistente que explica respuestas de bases de datos.
       - El usuario hizo una consulta y recibió una respuesta de la base de datos.

    2. *Instrucciones:*
       - Explica al usuario los resultados en un formato fácil de entender.
       - Si no hay resultados, indica que no se encontró nada.
       - Usa numeros y viñetas para organizar la información (123, -).
       - No repitas la consulta del usuario.
       - No seas repetitivo, ve directo al grano.
       - Brinda solo la informacion que le interese al usuario.

    3. *Respuesta anterior*
        {old_explicacion_text}
    4. *Consulta del usuario:*
       {consulta}

    5. *Respuesta de la base de datos:*
       {resultados}
    """

    response = client.chat.completions.create(
        model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
        messages=[{"role": "user", "content": prompt_explicacion}],
    )
    explicacion = response.choices[0].message.content

    old_explicacion = explicacion  # Almacenar la respuesta actual para la siguiente explicación
    return explicacion.strip()


# Prueba
print("Escriba su consulta:")
consulta = None
sql_generado = None
DBresponse = None

while consulta != "exit" and consulta != "salir" and consulta != "quit" and consulta != "" and consulta != "no":

    consulta = input("> ") 

    # Limpiar la consulta
    sql_generado = None
    DBresponse = None

    print("\nGenerando SQL... ", end="")
    sql_generado = generar_sql(consulta)

    if sql_generado:
        print(sql_generado)
    else:
        print("❌ Error: No se pudo generar SQL")
        continue

    """
    print("Consultando a la BD... ", end="")
    DBresponse = DB.send_query(sql_generado)

    if DBresponse:
        print("✅")

        if "SHOWDATA" in consulta:
            print(DBresponse)

        if len(DBresponse) > 500000:
            print("❌ Error: La respuesta es muy larga para ser procesada\n\nEscriba su consulta:")
            continue
    else:
        print("❌ Error: No se pudo obtener respuesta de la BD")
        

    print("Pensando respuesta... (tarda dependiendo de la carga de datos)")
    explicacion = explicar_resultado(consulta, DBresponse)
    

    if explicacion:
        print("\n\nChatBot:\n\n",explicacion)
    else:
        print("❌ Error: No se pudo explicar la respuesta de la BD")
    """


# DB.desconectar(DB.conn, DB.cursor) 