# Intégration Langchain + Ollama - Guide d'utilisation

Ce document explique comment utiliser l'agent Langchain comme alternative à n8n pour le conseiller vélo.

## Architecture

```
React Frontend
    ↓
Symfony API (/api/bike-advice)
    ↓
[Agent Service] → n8n (par défaut) OU Langchain (optionnel)
    ↓
FastAPI (Langchain + Ollama)
```

## Prérequis

### 1. Installer Ollama

Télécharger et installer Ollama depuis : https://ollama.ai

```bash
# Vérifier l'installation
ollama --version

# Télécharger un modèle (exemple avec llama2)
ollama pull llama2

# Vérifier les modèles disponibles
ollama list
```

### 2. Démarrer Ollama

Ollama doit être en cours d'exécution avant de démarrer le service FastAPI.

```bash
# Ollama démarre automatiquement après l'installation
# Vérifier qu'il est actif
curl http://localhost:11434/api/tags
```

## Installation du service FastAPI

### 1. Créer l'environnement virtuel Python

```bash
cd Langchain
python3 -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

### 2. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 3. Configurer l'environnement

```bash
# Copier le fichier d'exemple
cp config.env.example .env

# Éditer .env selon vos besoins
# Notamment : OLLAMA_MODEL (doit correspondre à un modèle installé)
```

## Démarrage du service FastAPI

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

## Configuration Symfony

### 1. Variable d'environnement

Pour activer l'agent Langchain au lieu de n8n, définir la variable d'environnement :

```bash
# Dans votre fichier .env de Symfony ou dans votre environnement
AGENT_TYPE=langchain
```

Par défaut, si `AGENT_TYPE` n'est pas défini, Symfony utilisera `n8n`.

### 2. URL de l'API Langchain

L'URL de l'API Langchain est configurée dans `symfony/config/services.yaml` :

```yaml
langchain.api.url: '%env(default::http://127.0.0.1:8000:LANGCHAIN_API_URL)%'
```

Vous pouvez la surcharger avec la variable d'environnement `LANGCHAIN_API_URL`.

## Test de l'intégration

### 1. Vérifier que FastAPI fonctionne

```bash
# Test de santé
curl http://127.0.0.1:8000/health

# Test de chat
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Bonjour, je cherche un vélo pour la ville"}'
```

### 2. Vérifier depuis Symfony

```bash
# Vérifier le statut de l'agent actif
curl http://127.0.0.1:8082/api/agent/status

# Test de santé Langchain
curl http://127.0.0.1:8082/api/langchain/health

# Test de chat Langchain
curl -X POST http://127.0.0.1:8082/api/langchain/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Bonjour, je cherche un vélo"}'
```

### 3. Test depuis le frontend React

Une fois `AGENT_TYPE=langchain` configuré, l'agent Langchain sera automatiquement utilisé par le frontend via `/api/bike-advice`.

## Basculer entre n8n et Langchain

### Utiliser n8n (par défaut)

```bash
# Ne pas définir AGENT_TYPE ou le définir à 'n8n'
AGENT_TYPE=n8n
```

### Utiliser Langchain

```bash
# Définir AGENT_TYPE à 'langchain'
AGENT_TYPE=langchain
```

**Important** : Assurez-vous que le service FastAPI est démarré avant de basculer vers Langchain.

## Dépannage

### Erreur : "Connection refused" lors de l'appel à FastAPI

- Vérifier que le service FastAPI est démarré : `curl http://127.0.0.1:8000/health`
- Vérifier l'URL dans `symfony/config/services.yaml` ou `LANGCHAIN_API_URL`

### Erreur : "Ollama not connected"

- Vérifier qu'Ollama est démarré : `ollama list`
- Vérifier l'URL Ollama dans `.env` du service FastAPI
- Tester manuellement : `curl http://localhost:11434/api/tags`

### Erreur : "Model not found"

- Installer le modèle : `ollama pull llama2` (ou le modèle configuré)
- Vérifier les modèles disponibles : `ollama list`
- Mettre à jour `OLLAMA_MODEL` dans `.env` du service FastAPI

### L'agent ne répond pas correctement

- Vérifier les logs du service FastAPI
- Vérifier que le modèle Ollama est bien installé et fonctionne
- Tester directement avec Ollama : `ollama run llama2`

## Retirer l'intégration Langchain

Si vous souhaitez retirer complètement l'intégration Langchain :

1. **Ne pas définir `AGENT_TYPE=langchain`** (ou le définir à `n8n`)
2. **Optionnel** : Supprimer le dossier `Langchain/` si vous n'en avez plus besoin
3. **Optionnel** : Supprimer `LangchainAgentService.php` et les routes associées dans `ApiController.php`

L'agent n8n continuera de fonctionner normalement.

## Endpoints disponibles

### FastAPI (Langchain)

- `GET /` : Vérification de base
- `GET /health` : Vérification de santé avec test Ollama
- `POST /chat` : Envoyer un message à l'agent
- `DELETE /chat/{session_id}` : Effacer une session
- `GET /sessions` : Lister les sessions actives
- `GET /docs` : Documentation Swagger UI
- `GET /redoc` : Documentation ReDoc

### Symfony

- `GET /api/agent/status` : Statut des deux agents (n8n et langchain)
- `GET /api/langchain/health` : Santé du service Langchain
- `POST /api/langchain/test` : Test de l'agent Langchain
- `POST /api/bike-advice` : Endpoint principal (utilise l'agent actif selon `AGENT_TYPE`)

## Notes importantes

1. **Mémoire des conversations** : Actuellement, les sessions sont stockées en mémoire dans FastAPI. Redémarrer le service effacera toutes les conversations. Pour la production, envisager Redis ou une base de données.

2. **Performance** : Les modèles Ollama locaux peuvent être plus lents que les API cloud. Ajuster le timeout dans `LangchainAgentService.php` si nécessaire.

3. **Sécurité** : En production, configurer CORS correctement dans `main.py` et utiliser HTTPS.

4. **Modèles Ollama** : Tester différents modèles pour trouver celui qui convient le mieux :
   - `llama2` : Modèle généraliste
   - `mistral` : Modèle plus performant
   - `codellama` : Si besoin de code
   - `llama2:13b` : Version plus grande (nécessite plus de RAM)

