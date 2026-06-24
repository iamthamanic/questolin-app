# Questolin — Persönliche Nutzung (local-first)

Anleitung für Solo-Nutzung auf dem Mac und optional auf dem Handy — **vor** PWA-Install.

## Tutor einrichten (Ollama lokal, empfohlen)

```bash
# Terminal 1 — LLM
ollama serve
ollama pull llama3.2

# Terminal 2 — App (Repo-Root)
cp .env.example .env   # optional; Default = localhost:11434
npm run dev
```

Default ohne `.env`: `TUTOR_LLM_BASE_URL=http://localhost:11434/v1`, Modell `llama3.2`.

### Tutor manuell testen

1. Browser: [http://localhost:3047/topic/api](http://localhost:3047/topic/api)
2. Questolin-FAB unten → Frage stellen → Antwort sollte kommen

### Tutor API Smoke (Terminal)

```bash
npm run dev          # Questolin auf :3047 (Standard — kein Konflikt mit Scriptony :3000)
npm run smoke:tutor  # oder: bash scripts/smoke-tutor.sh http://localhost:3047
```

**Hinweis:** Standard-Port ist **3047**. Bei Abweichung: `lsof -i :3047` prüfen.

Ohne laufenden Dev-Server oder Ollama bricht das Skript mit Hinweis ab (kein Fehler im CI).

**Alternativen:** Ollama Cloud (`OLLAMA_API_KEY`) oder `OPENAI_API_KEY` — siehe `.env.example`.

---

## Handy: Wie erreicht das Gerät die App?

| Modus | Wann | Tutor | PWA / Home-Screen |
|-------|------|-------|-------------------|
| **Nur Mac** | Lernen am Rechner | Ollama lokal ✅ | nicht nötig |
| **WLAN (LAN)** | Handy im selben Netz | Ollama nur am Mac ⚠️ | `http://<mac-ip>:3047` — **kein** iOS-PWA-Install ohne HTTPS |
| **Tailscale** | Handy unterwegs, Mac zu Hause | wie LAN | HTTPS über Tailscale Funnel/serve möglich |
| **Deploy** (Vercel/Render) | Ohne laufenden Mac | Ollama Cloud / OpenAI in Server-Env | HTTPS ✅ — Voraussetzung für saubere iOS-PWA |

### Empfehlung (Solo)

1. **Primär:** `npm run dev` + Ollama auf dem Mac  
2. **Handy im Haus:** Mac-IP im Browser (`npm run dev -- -H 0.0.0.0`)  
3. **Handy + PWA:** erst nach **Deploy mit HTTPS** oder Tailscale mit TLS — siehe Issue PWA minimal

### Dev-Server im LAN erreichbar machen

```bash
npm run dev -- -H 0.0.0.0
# Handy: http://<deine-mac-lan-ip>:3047
```

Firewall am Mac ggf. Port 3047 erlauben.

---

## PWA: Zum Home-Bildschirm hinzufügen

Questolin ist als **Web-App** installierbar (`app/manifest.ts`, Icons unter `public/icons/`).

### iOS (Safari)

1. App unter **HTTPS** öffnen (Deploy) oder `localhost` zum Testen am Mac
2. Teilen → **„Zum Home-Bildschirm“**
3. Icon „Questolin“ erscheint wie eine native App

**Ohne HTTPS** (nur `http://192.168.x.x`) erlaubt iOS oft **keine** Installation — dann Deploy oder Tailscale nutzen.

### Android (Chrome)

1. App im Browser öffnen (HTTPS empfohlen)
2. Menü → **„App installieren“** / „Zum Startbildschirm hinzufügen“
3. Standalone-Modus ohne Browser-Leiste

### Manifest prüfen

```bash
curl -s http://localhost:3047/manifest.webmanifest | head
```

Oder DevTools → Application → Manifest.
