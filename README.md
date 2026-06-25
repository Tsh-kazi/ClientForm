# ONICC Digital Infrastructure Onboarding Form

A branded client onboarding web form for ONICC (Ohms Network Infrastructure & Communications Ltd). Clients fill in their Digital Infrastructure Blueprint, and submissions are stored in a local JSON database with logo file uploads.

## Project Structure

```
ClientFormSubmission/
├── index.html        # The onboarding form (frontend)
├── server.js         # Local Node.js/Express backend
├── package.json      # Dependencies
├── .gitignore
└── README.md
```

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the local server
```bash
npm start
```

### 3. Open the form
Visit [http://localhost:3020](http://localhost:3020) in your browser.

## Production Deployment

### Frontend
Upload `index.html` to your cPanel hosting or drag-and-drop to [Netlify Drop](https://app.netlify.com/drop).

### Backend — Google Sheets Integration
Follow the [Hosting & Data Retrieval Guide](https://github.com) to set up a free Google Apps Script web app endpoint that stores submissions in a Google Sheet and sends email alerts.

Once deployed, paste your Google Apps Script URL into `index.html`:
```js
const PROD_WEB_APP_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

## Tech Stack
- **Frontend**: HTML, Vanilla CSS, JavaScript
- **Backend (local)**: Node.js, Express
- **Production backend**: Google Apps Script → Google Sheets + Drive
