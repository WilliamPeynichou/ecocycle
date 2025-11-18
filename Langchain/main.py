"""
FastAPI service pour l'agent vélo avec Langchain et Ollama
"""
import os
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from langchain_community.llms import Ollama
from langchain.schema import HumanMessage, SystemMessage
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)

# Charge les variables d'environnement
load_dotenv()

app = FastAPI(
    title="Ecocycle Bike Advisor API",
    description="API FastAPI pour l'agent conseiller vélo avec Langchain et Ollama",
    version="1.0.0"
)

# Configuration CORS pour permettre les requêtes depuis Symfony
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier les origines autorisées
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration Ollama
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama2")
SYSTEM_MESSAGE = os.getenv(
    "AGENT_SYSTEM_MESSAGE",
    "Tu es Conseiller Vélo Virtuel, un assistant expert en vente de vélos pour Ecocycle. "
    "Tu communiques exclusivement en français, avec un ton professionnel, amical et passionné."
)

# Initialisation du modèle Ollama
llm = Ollama(
    base_url=OLLAMA_BASE_URL,
    model=OLLAMA_MODEL,
    temperature=0.7,
)

# Stockage des sessions de conversation en mémoire
# En production, utiliser Redis ou une base de données
conversation_memories: Dict[str, ConversationBufferMemory] = {}


# Modèles Pydantic pour les requêtes/réponses
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    success: bool
    advice: Optional[str] = None
    session_id: str
    error: Optional[str] = None
    timestamp: str
    model: str = OLLAMA_MODEL


def get_or_create_memory(session_id: str) -> ConversationBufferMemory:
    """Récupère ou crée une mémoire de conversation pour une session"""
    if session_id not in conversation_memories:
        conversation_memories[session_id] = ConversationBufferMemory(
            return_messages=True,
            memory_key="history"
        )
    return conversation_memories[session_id]


def create_conversation_chain(memory: ConversationBufferMemory) -> ConversationChain:
    """Crée une chaîne de conversation avec le prompt système"""
    prompt = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template(SYSTEM_MESSAGE),
        MessagesPlaceholder(variable_name="history"),
        HumanMessagePromptTemplate.from_template("{input}")
    ])
    
    chain = ConversationChain(
        llm=llm,
        prompt=prompt,
        memory=memory,
        verbose=False
    )
    
    return chain


@app.get("/")
async def root():
    """Endpoint de santé"""
    return {
        "status": "ok",
        "service": "Ecocycle Bike Advisor API",
        "model": OLLAMA_MODEL,
        "ollama_url": OLLAMA_BASE_URL
    }


@app.get("/health")
async def health_check():
    """Vérification de santé avec test de connexion Ollama"""
    try:
        # Test simple de connexion à Ollama
        test_response = llm("test")
        return {
            "status": "healthy",
            "ollama_connected": True,
            "model": OLLAMA_MODEL
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "ollama_connected": False,
            "error": str(e),
            "model": OLLAMA_MODEL
        }


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Endpoint principal pour envoyer un message à l'agent
    
    Args:
        request: ChatRequest contenant le message et optionnellement le session_id
        
    Returns:
        ChatResponse avec la réponse de l'agent
    """
    try:
        # Génère un session_id si non fourni
        session_id = request.session_id or f"session-{os.urandom(8).hex()}"
        
        # Récupère ou crée la mémoire de conversation
        memory = get_or_create_memory(session_id)
        
        # Crée la chaîne de conversation
        chain = create_conversation_chain(memory)
        
        # Invoke la chaîne avec le message de l'utilisateur
        response = chain.invoke({"input": request.message})
        
        # Extrait la réponse (format peut varier selon la version de langchain)
        if isinstance(response, dict):
            advice = response.get("response", response.get("output", ""))
        else:
            advice = str(response)
        
        return ChatResponse(
            success=True,
            advice=advice,
            session_id=session_id,
            timestamp=__import__("datetime").datetime.now().isoformat(),
            model=OLLAMA_MODEL
        )
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Erreur dans /chat: {error_details}")
        
        return ChatResponse(
            success=False,
            advice=None,
            session_id=request.session_id or "error-session",
            error=str(e),
            timestamp=__import__("datetime").datetime.now().isoformat(),
            model=OLLAMA_MODEL
        )


@app.delete("/chat/{session_id}")
async def clear_session(session_id: str):
    """Efface la mémoire d'une session de conversation"""
    if session_id in conversation_memories:
        del conversation_memories[session_id]
        return {"success": True, "message": f"Session {session_id} effacée"}
    return {"success": False, "message": f"Session {session_id} non trouvée"}


@app.get("/sessions")
async def list_sessions():
    """Liste toutes les sessions actives (pour debug)"""
    return {
        "sessions": list(conversation_memories.keys()),
        "count": len(conversation_memories)
    }


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("FASTAPI_HOST", "127.0.0.1")
    port = int(os.getenv("FASTAPI_PORT", "8000"))
    uvicorn.run(app, host=host, port=port)

