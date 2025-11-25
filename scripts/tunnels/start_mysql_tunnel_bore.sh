#!/bin/bash

# Script pour créer un tunnel TCP gratuit vers MySQL MAMP avec bore
# bore est gratuit, open source, et ne nécessite pas de compte

echo "🚀 Démarrage du tunnel bore pour MySQL (port 8889)..."
echo ""
echo "📌 Utilisation de bore.pub (gratuit, open source)"
echo ""

# Charger l'environnement Rust si nécessaire
if ! command -v bore &> /dev/null; then
    export PATH="$HOME/.cargo/bin:$PATH"
    if ! command -v bore &> /dev/null; then
        echo "❌ bore n'est pas installé"
        echo "   Installez-le avec: cargo install bore-cli"
        exit 1
    fi
fi

# Arrêter les tunnels bore existants
pkill -f "bore.*8889" 2>/dev/null
sleep 1

echo "✅ Création du tunnel TCP..."
echo "   (Cela peut prendre quelques secondes...)"
echo ""

# Créer le tunnel TCP avec bore
# Format: bore local [port_local] --to bore.pub
bore local 8889 --to bore.pub 2>&1 | tee /tmp/bore_mysql_tunnel.log &
TUNNEL_PID=$!

# Attendre que le tunnel soit prêt
sleep 4

# Extraire l'URL du tunnel depuis les logs
TUNNEL_INFO=$(grep -E "bore.pub|listening|tunnel" /tmp/bore_mysql_tunnel.log 2>/dev/null | head -5)
HOST_PORT=$(grep -oE "[a-z0-9-]+\.bore\.pub:[0-9]+" /tmp/bore_mysql_tunnel.log 2>/dev/null | head -1)

if [ -z "$HOST_PORT" ]; then
    echo "⏳ Tunnel en cours de création..."
    echo ""
    if [ ! -z "$TUNNEL_INFO" ]; then
        echo "$TUNNEL_INFO"
        echo ""
    fi
    echo "📋 Vérifiez les logs ci-dessus pour l'URL du tunnel"
    echo "   Ou consultez: cat /tmp/bore_mysql_tunnel.log"
    echo ""
else
    HOST=$(echo "$HOST_PORT" | cut -d':' -f1)
    PORT=$(echo "$HOST_PORT" | cut -d':' -f2)
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ TUNNEL CRÉÉ AVEC SUCCÈS!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📋 Configuration pour n8n MySQL:"
    echo ""
    echo "   Host: $HOST"
    echo "   Port: $PORT"
    echo "   Database: ecocycle (ou votre nom de base)"
    echo "   User: root"
    echo "   Password: (vide ou 'root')"
    echo ""
    echo "🌐 URL complète: $HOST_PORT"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
fi

echo "⚠️  Le tunnel restera actif tant que ce script tourne"
echo "   Appuyez sur Ctrl+C pour arrêter le tunnel"
echo ""
echo "💡 Pour voir les logs en temps réel:"
echo "   tail -f /tmp/bore_mysql_tunnel.log"
echo ""

# Garder le script actif
wait $TUNNEL_PID

