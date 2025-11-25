#!/bin/bash

# Script pour créer un tunnel TCP gratuit vers MySQL MAMP avec serveo.net
# Utilise SSH (déjà installé sur Mac) - Gratuit, pas besoin de compte

echo "🚀 Démarrage du tunnel SSH gratuit pour MySQL (port 8889)..."
echo ""
echo "📌 Utilisation de serveo.net (gratuit, via SSH)"
echo ""

# Arrêter les tunnels SSH existants
pkill -f "ssh.*serveo.*8889" 2>/dev/null
sleep 1

echo "✅ Création du tunnel TCP..."
echo "   (Cela peut prendre quelques secondes...)"
echo ""

# Créer le tunnel SSH vers serveo.net
# Format: ssh -R port_distant:localhost:port_local serveo.net
# serveo.net assigne automatiquement un port aléatoire
ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=60 -R 0:localhost:8889 serveo.net 2>&1 | tee /tmp/ssh_mysql_tunnel.log &
TUNNEL_PID=$!

# Attendre que le tunnel soit prêt
sleep 5

# Extraire l'URL du tunnel depuis les logs
TUNNEL_INFO=$(grep -E "Forwarding|Allocated port|Remote forwarding" /tmp/ssh_mysql_tunnel.log 2>/dev/null | head -3)

if [ -z "$TUNNEL_INFO" ]; then
    echo "⏳ Tunnel en cours de création..."
    echo ""
    echo "📋 Vérifiez les logs ci-dessus pour l'URL du tunnel"
    echo "   Ou consultez: cat /tmp/ssh_mysql_tunnel.log"
    echo ""
    echo "💡 Le format sera généralement:"
    echo "   serveo.net:PORT"
    echo ""
else
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ TUNNEL CRÉÉ!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "$TUNNEL_INFO"
    echo ""
    echo "📋 Configuration pour n8n MySQL:"
    echo ""
    echo "   Host: serveo.net"
    echo "   Port: [le port affiché ci-dessus]"
    echo "   Database: ecocycle (ou votre nom de base)"
    echo "   User: root"
    echo "   Password: (vide ou 'root')"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
fi

echo "⚠️  Le tunnel restera actif tant que ce script tourne"
echo "   Appuyez sur Ctrl+C pour arrêter le tunnel"
echo ""
echo "💡 Pour voir les logs en temps réel:"
echo "   tail -f /tmp/ssh_mysql_tunnel.log"
echo ""

# Garder le script actif
wait $TUNNEL_PID

