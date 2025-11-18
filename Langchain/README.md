# Agent Vélo Langchain + Ollama

Service FastAPI pour l'agent conseiller vélo utilisant Langchain et Ollama.

## Prérequis

1. **Python 3.9+** installé
2. **Ollama** installé et démarré
   - Télécharger depuis : https://ollama.ai
   - Installer un modèle : `ollama pull llama2` (ou un autre modèle)

## Installation

1. Créer un environnement virtuel Python :
```bash
cd Langchain
python3 -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

2. Installer les dépendances :
```bash
pip install -r requirements.txt
```

3. Configurer l'environnement :
```bash
cp .env.example .env
# Éditer .env selon vos besoins
```

## Configuration

Éditer le fichier `.env` :

- `OLLAMA_BASE_URL` : URL de base d'Ollama (par défaut: http://localhost:11434)
- `OLLAMA_MODEL` : Modèle à utiliser (par défaut: llama2)
- `FASTAPI_HOST` : Host pour FastAPI (par défaut: 127.0.0.1)
- `FASTAPI_PORT` : Port pour FastAPI (par défaut: 8000)
- `AGENT_SYSTEM_MESSAGE` : Message système pour l'agent

## Démarrage

```bash
# Activer l'environnement virtuel
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Démarrer le serveur
python main.py
```

Ou avec uvicorn directement :
```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Le service sera accessible sur : http://127.0.0.1:8000

## Documentation API

Une fois le serveur démarré, la documentation interactive est disponible sur :
- Swagger UI : http://127.0.0.1:8000/docs
- ReDoc : http://127.0.0.1:8000/redoc

## Endpoints

### GET `/`
Vérification de base du service

### GET `/health`
Vérification de santé avec test de connexion Ollama

### POST `/chat`
Envoie un message à l'agent

**Body:**
```json
{
  "message": "Je cherche un vélo pour la ville",
  "session_id": "session-123"  // Optionnel
}
```

**Response:**
```json
{
  "success": true,
  "advice": "Bonjour ! Je serais ravi de vous aider...",
  "session_id": "session-123",
  "timestamp": "2024-01-01T12:00:00",
  "model": "llama2"
}
```

### DELETE `/chat/{session_id}`
Efface la mémoire d'une session

### GET `/sessions`
Liste toutes les sessions actives (debug)

## Test

```bash
# Test de santé
curl http://127.0.0.1:8000/health

# Test de chat
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Bonjour, je cherche un vélo pour la ville"}'
```

## Intégration avec Symfony

Ce service est appelé par le `LangchainAgentService` de Symfony via l'endpoint `/chat`.

Pour activer l'agent Langchain au lieu de n8n, configurer dans `symfony/config/services.yaml` :
- `langchain.api.url` : URL du service FastAPI (ex: http://127.0.0.1:8000)

Et dans `symfony/config/packages/framework.yaml` ou via variable d'environnement :
- `AGENT_TYPE=langchain` pour utiliser Langchain
- `AGENT_TYPE=n8n` pour utiliser n8n (par défaut)

## Dépannage

### Ollama n'est pas accessible
- Vérifier qu'Ollama est démarré : `ollama list`
- Vérifier l'URL dans `.env`
- Tester manuellement : `curl http://localhost:11434/api/tags`

### Le modèle n'existe pas
- Installer le modèle : `ollama pull llama2`
- Vérifier les modèles disponibles : `ollama list`
- Mettre à jour `OLLAMA_MODEL` dans `.env`

### Erreurs de mémoire
- Les sessions sont stockées en mémoire (redémarrer efface tout)
- En production, utiliser Redis ou une base de données pour la persistance

