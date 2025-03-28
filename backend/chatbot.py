from together import Together
from datetime import datetime
import BD
import os
from dotenv import load_dotenv

# IMPORTANTE: 
# - descarga el Together con "pip install together"
# - listop

load_dotenv() # Cargar las variables de entorno
api_key = os.getenv("TOGETHER_API_KEY") 


client = Together(api_key = api_key)


def analisisIA(consulta):
    
    prompt = f"""Eres IAzul, tu propósito es ayudar a los clientes del local respondiendo sus preguntas o generando consultas SQL cuando sea necesario.
    Instrucciones:
    - Si la consulta requiere obtener información específica de la base de datos, responde únicamente con comando SQL (sin explicaciones adicionales).
    - Si puedes responder sin acceder a la base de datos, proporciona una respuesta directa y concisa.
    - Si la consulta está fuera de tu alcance o requiere acciones prohibidas (ej. `DROP`, `ALTER`), indicarlo.
    - Si se requiere una consulta SQL, responde con la consulta `SELECT` en una sola línea, sin texto adicional.
    - No expliques cómo generaste la consulta ni agregues detalles innecesarios.
    - Nunca juntes una respuesta rápida con un SQL, debes responder con uno u otro, nunca ambos en la misma respuesta.
    - Si pide listados de productos, selecciona solo las columnas relevantes.
    - Si tenes que buscar un nombre, consulta por los productos que tengan el nombre similar al que te pidieron.
    - Si tenes que buscar stock o precio, consulta por nombre de producto, el stock y el precio.
    Contexto del Asistente:
    - Eres un chatbot creado por Julián Codina para demostrar el potencial de aplicar IA a bases de datos.
    - Julián Codina es un programador de Argentina, Chaco estudia en la UTN y trabaja en InterSoft Sistemas como Junior.
    - Sus habilidades incluyen: HTML, CSS, JavaScript, TypeScript, React, Python, Node.js, Bootstrap, Java, C# y bases de datos.
    - Ha desarrollado proyectos como una página web de un spa, un reproductor de podcast y su portafolio web:(https://codina-portfolio.vercel.app).
    - El contacto de Julian es, tel: 54 3624249451, email: depedrojulianismael@gmail.com.
    - Para más información sobre Julián, puedes invitar a los usuarios a visitar su portafolio.
    - Fecha actual: {datetime.today()}
    Información del local:
        Las categorias de los productos son:
        - componentes de computadoras
        - celulares
        - perifericos
        - electrodomesticos
        Horario de atención: Lunes a Viernes de 9:00 a 18:00 y Sábados de 9:00 a 13:00
        Servicio técnico: Sí, contamos con servicio técnico especializado para reparación de computadoras, celulares y otros dispositivos electrónicos
        Medios de pago: Aceptamos todas las tarjetas de crédito y débito, efectivo y transferencias bancarias
        Envíos: Realizamos envíos a domicilio en toda la ciudad y alrededores. El costo varía según la zona
        Garantía: Todos nuestros productos tienen garantía oficial del fabricante por 12 meses 
    Recuerda seguir estas instrucciones al pie de la letra.
    
    Esquema de la BD:
    compras: id_c (bigint), id_p (bigint), fecha (timestamp), proveedor (varchar), cantidad (bigint), total (double), costo_unit (double)
    inventario: id_producto (bigint), stock_inicial (bigint), stock_actual (bigint), id (bigint)
    productos: id (bigint), nombre (varchar), categoria (varchar), marca (varchar), precio (double), fecha_ingreso (date)
    ventas: id_v (bigint), id_p (bigint), fecha (timestamp), cliente (varchar), cantidad (bigint), total (double)
    
    Ejemplos:
    - consulta: cuando Nacio Michael Jackson? | respuesta: Nació el 29 de agosto del 1958
    - consulta: que mouse tienen? | respuesta: SELECT nombre, marca, precio FROM productos WHERE nombre LIKE '%mouse%'
    - consulta: Cuál es el precio de la RTX 3080? | respuesta: SELECT nombre, marca, precio from productos where nombre like '%rtx 3080%'
    - consulta: cual es el producto mas vendido? | respuesta: SELECT p.nombre, p.marca, p.precio, SUM(v.cantidad) AS total_vendido FROM productos p JOIN ventas v ON p.id_producto = v.id_producto GROUP BY p.nombre_producto ORDER BY total_vendido DESC LIMIT 1;
    """
    
    AIresponse = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": consulta},
            ]
        )
    
    return AIresponse.choices[0].message.content

def estructurar_datos(resultados, description):
    # Verificar si hay resultados
    if not resultados or not resultados[0]:
        return []
    
    # Obtener los nombres de las columnas de la descripción
    columnas = [desc[0] for desc in description]
    
    # Convertir los resultados en una lista numerada con nombres de columnas
    datos_estructurados = []
    for i, fila in enumerate(resultados, 1):
        datos_fila = dict(zip(columnas, fila))
        datos_estructurados.append({
            'num': i,
            'datos': datos_fila
        })
    
    return datos_estructurados

def explicarIA(consulta, resultados):
    if not resultados:
        return "Lo siento, no pude encontrar la información que buscas."
    
    prompt = f"""
    Eres un asistente de atención al público de un local de electrónica que explica resultados de bases de datos a los clientes. 
    
    Instrucciones:
    - Explica los resultados de la consulta en formato claro, conciso y directo.
    - Usa viñetas (-) para organizar la información.
    - Por cada producto, SOLO muestra:
      * Nombre del producto
      * Marca
      * Precio
    - NO muestres otros datos como fechas, categorías o números de referencia a menos que sean específicamente solicitados.
    - Debes responder como si la empresa fuera tuya.
    
    Ejemplos:
    - consulta: cual es el producto mas vendido? | respuesta: Nuestro producto mas vendido es el "Mouse Gamer Logitech" con 100 unidades vendidas.
    - consulta: que marcas de celulares tienen? | respuesta: Tenemos marcas como Samsung, Apple, Huawei, Xiaomi y Motorola.
    - consulta: que mouse tienen? | respuesta: 
      Tenemos disponible:
      - Mouse Gamer RGB (Logitech) - $45.99
      
    Respuesta de la Base de Datos:
    {resultados}
    """
    print("debbug resultados: ", resultados)
    
    try:
        # Llamada a la API para obtener la explicación
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": consulta},
            ]
        )

        # Obtener la explicación generada por la IA
        explicacion = response.choices[0].message.content.strip()
        return explicacion

    except Exception as e:
        # Manejo de errores en caso de fallo con la API
        return f"Ocurrió un error al procesar la consulta: {str(e)}"

def chatbot(consulta):
    try:
        respuestaIA = analisisIA(consulta)
        
        if 'SELECT' in respuestaIA:  
            if respuestaIA:  
                respuestaIA = respuestaIA.lower()
                print("debbug sql: ", respuestaIA)
                
                resultadosBD, description = BD.send_query(respuestaIA)
                # Estructurar los datos antes de enviarlos a la IA
                resultadosBD = estructurar_datos(resultadosBD, description)
                
                return explicarIA(consulta, resultadosBD)
            else:
                return "No se pudo generar una consulta SQL válida."
        
        return respuestaIA
        
    except Exception as e:
        print(f"Error en la ejecución: {str(e)}")  # Para debugging
        return "Ups. Algo hice mal. Por favor, intenta de nuevo"

"""
# Prueba
print("Escriba su consulta:")

while True:

    consulta = input("> ") 
    
    print("\nGenerando respuesta...\n")
    respuestaIA = chatbot(consulta)

    print(respuestaIA)"""
