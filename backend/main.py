from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import chatbot as bot

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

@app.get("/consultar")
def get_prueba():
    return {"mensaje": bot.prueba()}

@app.get("/responder")
def get_prueba():
    return {"mensaje": bot.prueba()}

# Ejecutar con: uvicorn main:app --reload
