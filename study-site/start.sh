#!/bin/sh
# Serves the study site. Open http://localhost:8000 on this machine,
# or http://<this-mac's-ip>:8000 on a phone on the same Wi-Fi.
cd "$(dirname "$0")"
IP=$(ipconfig getifaddr en0 2>/dev/null)
echo "Local:  http://localhost:8000"
[ -n "$IP" ] && echo "Phone:  http://$IP:8000"
python3 -m http.server 8000 --bind 0.0.0.0
