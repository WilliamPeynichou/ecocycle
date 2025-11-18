# Guide de démarrage rapide - Langchain

## Étape 1 : Installer Ollama

### Sur macOS :
```bash
# Télécharger et installer depuis https://ollama.ai
# Ou utiliser Homebrew :
brew install ollama

# Démarrer Ollama
ollama serve
```

### Alternative : Téléchargement manuel
1. Aller sur https://ollama.ai
2. Télécharger l'installateur pour macOS
3. Installer et lancer Ollama

## Étape 2 : Installer un modèle Ollama

Dans un nouveau terminal (Ollama doit être en cours d'exécution) :

```bash
# Installer le modèle llama2 (recommandé pour commencer)
ollama pull llama2

# Vérifier que le modèle est installé
ollama list
```

**Note** : Le téléchargement peut prendre quelques minutes selon votre connexion.

## Étape 3 : Configurer l'environnement Python

```bash
cd /Applications/MAMP/htdocs/ecocycle/Langchain

# Créer un environnement virtuel
python3 -m venv venv

# Activer l'environnement virtuel
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

## Étape 4 : Configurer le fichier .env

```bash
# Copier le fichier d'exemple
cp config.env.example .env

# Le fichier .env est déjà configuré par défaut, mais vous pouvez le modifier si besoin
```

## Étape 5 : Démarrer le service FastAPI

```bash
# Assurez-vous que l'environnement virtuel est activé
source venv/bin/activate

# Démarrer le serveur
python main.py
```

Le service sera accessible sur : http://127.0.0.1:8000

## Étape 6 : Tester le service FastAPI

Dans un nouveau terminal :

```bash
# Test de santé
curl http://127.0.0.1:8000/health

# Test de chat
curl -X POST http://127.0.0.1:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Bonjour, je cherche un vélo pour la ville"}'
```

## Étape 7 : Configurer Symfony pour utiliser Langchain

### Option A : Via variable d'environnement (recommandé)

Créer ou modifier le fichier `.env` dans le dossier `symfony/` :

```bash
cd /Applications/MAMP/htdocs/ecocycle/symfony
echo "AGENT_TYPE=langchain" >> .env
```

### Option B : Modifier directement services.yaml

Éditer `symfony/config/services.yaml` et changer :
```yaml
agent.type: 'langchain'
```

## Étape 8 : Redémarrer Symfony

```bash
# Arrêter le serveur Symfony actuel (Ctrl+C dans le terminal où il tourne)
# Puis redémarrer :
cd /Applications/MAMP/htdocs/ecocycle/symfony
php -S 127.0.0.1:8082 -t public
```

## Étape 9 : Tester depuis Symfony

```bash
# Vérifier le statut de l'agent
curl http://127.0.0.1:8082/api/agent/status

# Test de santé Langchain
curl http://127.0.0.1:8082/api/langchain/health

# Test de chat Langchain
curl -X POST http://127.0.0.1:8082/api/langchain/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Bonjour, je cherche un vélo"}'
```

## Étape 10 : Tester depuis le frontend React

Une fois tout configuré, l'agent Langchain sera automatiquement utilisé par le frontend via `/api/bike-advice`.

## Dépannage

### Ollama ne démarre pas
- Vérifier qu'Ollama est bien installé : `which ollama`
- Démarrer Ollama : `ollama serve`
- Vérifier qu'il écoute sur le port 11434 : `curl http://localhost:11434/api/tags`

### Le modèle n'est pas trouvé
- Vérifier les modèles installés : `ollama list`
- Installer le modèle : `ollama pull llama2`
- Vérifier le nom du modèle dans `.env` correspond à un modèle installé

### Erreur de connexion FastAPI → Ollama
- Vérifier qu'Ollama est démarré
- Vérifier l'URL dans `.env` : `OLLAMA_BASE_URL=http://localhost:11434`
- Tester manuellement : `curl http://localhost:11434/api/tags`

### Symfony ne trouve pas Langchain
- Vérifier que FastAPI est démarré : `curl http://127.0.0.1:8000/health`
- Vérifier la configuration dans `services.yaml`
- Vérifier que `AGENT_TYPE=langchain` est bien défini

## Retour à n8n

Pour revenir à n8n, simplement :
```bash
# Dans symfony/.env
AGENT_TYPE=n8n
```

Ou modifier `services.yaml` :
```yaml
agent.type: 'n8n'
```

