# IAzul - Asistente Virtual Inteligente

IAzul es un asistente virtual inteligente desarrollado como una aplicación web full-stack que combina la potencia de la Inteligencia Artificial con la capacidad de interactuar con bases de datos. Este proyecto demuestra la integración de tecnologías modernas para crear una experiencia de usuario innovadora y eficiente.

## 🎯 Propósito

El objetivo principal de IAzul es proporcionar una interfaz conversacional que permita:
- Interactuar con una base de datos de manera natural a través de lenguaje conversacional
- Obtener respuestas precisas y contextualizadas
- Proporcionar una experiencia de usuario intuitiva y amigable
- Demostrar el potencial de la IA en la gestión de datos

## 🚀 Características

- **Chatbot Inteligente**: Utiliza el modelo Llama-3.3-70B-Instruct-Turbo para procesar consultas
- **Integración con Base de Datos**: Conexión directa con PostgreSQL
- **Interfaz Moderna**: Diseño responsive y atractivo
- **Síntesis de Voz**: Capacidad de leer respuestas en voz alta
- **Historial de Chat**: Mantiene un registro de las conversaciones
- **Diseño Modular**: Arquitectura limpia y mantenible

## 🛠️ Tecnologías Utilizadas

### Backend
- Python
- FastAPI
- PostgreSQL
- Together AI API
- Uvicorn

### Frontend
- React
- Vite
- CSS Modules
- Supabase

## 📋 Requisitos Previos

- Python 3.8+
- Node.js 16+
- PostgreSQL
- Cuenta en Together AI (para la API key)

## 🔧 Guía de Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/JulianCodina/IAzul-Chatbot.git
cd IAzul-Chatbot
```

### 2. Configurar el Backend

```bash
cd backend
python -m venv venv
# En Windows
venv\Scripts\activate
# En Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

Crear un archivo `.env` en el directorio `backend` con las siguientes variables:
```env
user=tu_usuario_db
password=tu_password_db
host=tu_host_db
port=tu_puerto_db
dbname=tu_nombre_db
TOGETHER_API_KEY=tu_api_key_together
```

### 3. Configurar el Frontend

```bash
cd frontend
npm install
```

Crear un archivo `.env.local` en el directorio `frontend` con las siguientes variables:
```env
VITE_SUPABASE_URL=tu_url_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_supabase
```

### 4. Iniciar la Aplicación

1. Iniciar el Backend:
```bash
cd backend
uvicorn main:app --reload
```

2. Iniciar el Frontend:
```bash
cd frontend
npm run dev
```

## 🌐 Despliegue

El proyecto está configurado para ser desplegado en:
- Frontend: Vercel
- Backend: Railway
- Base de Datos: PostgreSQL (Supabase)

