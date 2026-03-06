# 💪 WorkoutApp

**Progressive Web App** per allenamenti completa: timer HIIT, log esercizi, calendario settimanale/mensile, costruttore programmi e tracker progressi.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

### ⏱️ **Timer avanzati**
- **Cronometro** con lap tracking
- **Countdown** personalizzabile (minuti + secondi)
- **Timer a intervalli** (HIIT/Tabata) con lavoro/riposo configurabili
- **Rest timer rapido** (30s, 1min, 90s, 2min, 3min)
- Notifiche audio (Web Audio API)

### 💪 **Workout Logger**
- Traccia esercizi, serie, ripetizioni e pesi
- Esercizi rapidi preimpostati (Squat, Panca, Stacco, Trazioni...)
- Cronometro automatico durata sessione
- Salvataggio sessioni con timestamp

### 📋 **Costruttore Programmi**
- Crea programmi **settimanali** (1 settimana) o **mensili** (4 settimane)
- Editor giorno per giorno (riposo o allenamento)
- Assegna esercizi con serie/rip per ogni giorno
- Gestione completa: modifica, elimina, duplica

### 📅 **Calendario Allenamenti**
- Vista **settimanale** e **mensile**
- Visualizzazione giorni allenati
- Lista sessioni della settimana corrente
- Statistiche: **streak settimanale**, totale allenamenti, media settimanale

### 📈 **Progressi & Analytics**
- **Grafico volume settimanale** (ultime 8 settimane)
- **Record personali** per esercizio (peso massimo + rip)
- Cronologia completa allenamenti
- Calcolo volume (rip × kg)

---

## 🛠️ Tech Stack

- **React 18** + **Vite** (build tool veloce)
- **Zustand** (state management con persistenza localStorage)
- **React Router** (navigazione SPA)
- **Chart.js** (grafici interattivi)
- **Tailwind CSS 4** (styling utility-first)
- **date-fns** (manipolazione date)
- **Vite PWA Plugin** (Service Worker + manifest)

---

## 💻 Installazione

### Prerequisiti
- **Node.js 18+** e npm

### Setup locale

```bash
# Clona la repository
git clone https://github.com/Heryx/workout-app.git
cd workout-app

# Installa dipendenze
npm install

# Avvia dev server
npm run dev
```

Apri [http://localhost:5173](http://localhost:5173) nel browser.

### Build per produzione

```bash
npm run build
npm run preview  # testa la build
```

I file compilati saranno in `dist/`.

---

## 📱 Installazione come PWA

### Su smartphone (iOS/Android)

1. Apri l'app nel browser (Chrome, Safari)
2. **iOS**: Tocca "Condividi" > "Aggiungi a Home"
3. **Android**: Tocca menu (⋮) > "Installa app" o "Aggiungi a schermata Home"

L'app funzionerà offline e avrà un'icona dedicata!

### Su PC (Chrome/Edge)

1. Clicca l'icona **installa** (➕) nella barra URL
2. Conferma l'installazione
3. L'app apparirà nel menu Start/Applicazioni

---

## 💾 Persistenza dati

Tutti i dati (sessioni, programmi, record) vengono salvati in **localStorage** del browser. Per esportare/importare:

```javascript
// Esporta (apri DevTools Console)
JSON.stringify(localStorage.getItem('workout-app-store'))

// Importa
localStorage.setItem('workout-app-store', 'IL_TUO_JSON')
```

**Nota**: cancellare la cache del browser cancellerà i dati. Prossima versione includerà backup su cloud.

---

## 🔧 Struttura progetto

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Router + bottom nav
├── store/
│   └── useStore.js       # Zustand store globale
├── pages/
│   ├── Timer.jsx         # Stopwatch, Countdown, Interval
│   ├── Workout.jsx       # Logger sessione attiva
│   ├── Programs.jsx      # Costruttore programmi
│   ├── Calendar.jsx      # Vista calendario + stats
│   └── Progress.jsx      # Grafici + PRs + cronologia
└── utils/
    ├── audio.js          # Web Audio beep
    └── dates.js          # Formattazione date
```

---

## 👥 Contribuire

Pull requests benvenute! Per modifiche importanti:

1. Apri una issue per discutere il cambiamento
2. Fork la repo
3. Crea un branch (`git checkout -b feature/nuova-feature`)
4. Commit (`git commit -m 'Aggiunge nuova feature'`)
5. Push (`git push origin feature/nuova-feature`)
6. Apri una Pull Request

---

## 📄 Licenza

MIT License - vedi [LICENSE](LICENSE)

---

## 📧 Contatti

**Giuseppe Guarino** - [@Heryx](https://github.com/Heryx)

Repository: [https://github.com/Heryx/workout-app](https://github.com/Heryx/workout-app)

---

## 🗺️ Roadmap

- [ ] Backup su cloud (Firebase/Supabase)
- [ ] Grafici progressi per singolo esercizio
- [ ] Esportazione PDF allenamenti
- [ ] Timer vocale (Text-to-Speech)
- [ ] Modalità scura/chiara
- [ ] Integrazione con smartwatch
- [ ] Social: condividi progressi

---

**Buon allenamento!** 💪🔥