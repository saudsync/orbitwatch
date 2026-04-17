# OrbitWatch 🛰️

**Live Satellite Tracker with AI Astronomy Assistant**

A beautiful, free, browser-based satellite tracking application with a 3D globe, real-time telemetry, and an AI-powered astronomy chat agent (ARIA).

## 🌐 Live Demo

Deploy to GitHub Pages and visit: `https://yourusername.github.io/orbitwatch/`

## ✨ Features

- **3D Interactive Globe** — Rotating Earth with live satellite positions, orbit trails, continent outlines
- **Real-Time Telemetry** — Altitude, velocity, latitude, longitude via SGP4 orbital mechanics
- **12 Tracked Satellites** — ISS, Hubble, Tiangong, Starlink, Sentinel, Terra, GPS, GOES-18, and more
- **Satellite Database** — Searchable, filterable catalog with detailed mission info and orbital params
- **Featured Home Screen** — Satellite cards with live data and Track Now buttons
- **ARIA AI Chat** — Claude-powered astronomy assistant for space Q&A
- **Mobile Responsive** — Works on all screen sizes

## 📁 Project Structure

```
orbitwatch/
├── index.html              ← Home page with featured satellites
├── css/
│   └── style.css           ← Shared styles for all pages
├── js/
│   ├── satellites.js       ← Satellite database + SGP4 wrapper
│   ├── home.js             ← Home page logic (star field, cards)
│   └── tracker.js          ← 3D globe renderer + tracker UI
└── pages/
    ├── tracker.html        ← Full 3D tracker page
    ├── database.html       ← Satellite database with modals
    └── chat.html           ← AI astronomy chat (ARIA)
```

## 🚀 Deploy to GitHub Pages

### Method 1: GitHub Web UI
1. Create a new GitHub repository named `orbitwatch`
2. Upload all files maintaining the folder structure
3. Go to **Settings → Pages**
4. Set Source to **Deploy from a branch → main → / (root)**
5. Visit `https://yourusername.github.io/orbitwatch/`

### Method 2: Git CLI
```bash
git init
git add .
git commit -m "Initial commit: OrbitWatch satellite tracker"
git branch -M main
git remote add origin https://github.com/YOURUSERNAME/orbitwatch.git
git push -u origin main
```
Then enable GitHub Pages in repo Settings.

## 🤖 AI Chat Setup (ARIA)

The ARIA chat agent requires an Anthropic API key:

1. Get a key from [console.anthropic.com](https://console.anthropic.com)
2. Open the AI Chat page (`pages/chat.html`)
3. Enter your API key in the banner at the top
4. Start chatting about space!

> **Note:** The API key is stored in browser localStorage and never sent anywhere except the Anthropic API.

## 🛰️ Satellite Data

TLE (Two-Line Element) data is included directly in `js/satellites.js`. For production use with live TLE updates, integrate with:
- [CelesTrak](https://celestrak.org/) — Free TLE data
- [Space-Track.org](https://www.space-track.org/) — Official USSPACECOM data

## 🛠️ Technologies

- Pure HTML/CSS/JavaScript (no build step required)
- [Satellite.js](https://github.com/shashwatak/satellite-js) — SGP4 orbital propagation
- [Claude API](https://anthropic.com) — AI astronomy assistant
- HTML5 Canvas — 3D globe rendering
- Google Fonts (Syne + Space Mono)

## 📄 License

MIT License — free to use, modify, and deploy.

---

Built with ❤️ for space enthusiasts.

