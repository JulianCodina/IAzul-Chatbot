from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
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

class Consulta(BaseModel):
    consulta: str

@app.post("/responder")
def responder(consulta: Consulta):
    return {"mensaje": bot.chatbot(consulta.consulta)}

# Ejecutar con: 
# uvicorn main:app --reload
