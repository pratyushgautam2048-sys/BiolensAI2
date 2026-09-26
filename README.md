# BioLens AI — Intelligent Clinical Information Platform

Medora AI is a modern healthcare web application designed to empower patients with AI-assisted translations of medical reports, vision identification of home medical equipment, and an interactive health companion grounded in verified user health dossiers.

## Design Aesthetic
- **Color Palette**: Primary `#18A66A` (Emerald), Dark Green `#0F7F51`, Soft Mint `#EAFFF4`, Neutral Background `#F5FBF7`, Deep Slate `#12201B`.
- **Liquid Glass / Glassmorphism UI**: High backdrop-blur filters, large rounded cards (`rounded-3xl`), semi-transparent white containers, and animated ambient floating gradient blobs.
- **Micro-Interactions**: Smooth hover elevations, live step progress indicators during AI generation, and accessible WCAG-compliant contrasts.

---

## Key Features

### 1. Dashboard
- **Hero**: "Your health, explained." with quick actions for report analysis and equipment scanning.
- **Status Indicator**: Live pulsing "AI Health Assistant Ready" status.
- **Health Overview Cards**: Reports Analyzed, Health Records count, Profile Completeness gauge, and Next Scheduled Health Check-in.
- **Recent Health Activity**: Chronological event feed combining labs, equipment, medications, and visits.
- **Prominent Medical Disclaimer**: Clear education-only boundary.

### 2. Medical Report Analyzer
- **Multi-Format Upload**: PDF, JPG, JPEG, PNG, WEBP with drag-and-drop and 25MB safety boundary.
- **Sample Clinical Reports**: Preloaded tests (CBC with Differential, CMP, Fasting Lipid Panel) clearly labeled `DEMO DATA — NOT A REAL MEDICAL REPORT`.
- **Loading Experience**:
  - `Reading your report...`
  - `Extracting medical values...`
  - `Preparing a clear explanation...`
- **Structured Output**:
  - Report Summary in simple human language
  - Key Findings bullet points
  - Test Results with status indicators (*Within range*, *Above range*, *Below range*, *Unknown*)
  - "What This May Mean" using non-diagnostic safety phrasing
  - "Things to Discuss With Your Doctor" (clinical prompt sheet)
  - General Next Steps & Urgency triage

### 3. Medical Equipment Scanner
- **Dual Capture**: Live webcam/camera capture + image file upload.
- **Sample Devices**: Digital pulse oximeter, blood glucose meter, blood pressure cuff, and mesh nebulizer.
- **Visual Analysis**:
  - Device identification with confidence metrics (*High*, *Moderate*, *Low*, *Uncertain*).
  - Explicit uncertainty declaration if unrecognized: *"Device identification is uncertain."*
  - Operating mechanisms, general educational usage instructions, and safety contraindications.
  - Requirement notice if clinical training is needed.

### 4. My Health Profile
- **Personal Information**: Full demographics, blood type, height/weight, emergency contact.
- **Allergies**: Reaction and severity categorization (*Mild*, *Moderate*, *Severe*).
- **Conditions**: Current vs. past resolved diagnoses.
- **Medications**: Current vs. past prescriptions with strict guardrails against autonomous AI dosage changes.
- **Medical Reports & Equipment Archives**: Historical catalog with details inspection.
- **Appointments**: Upcoming and past visits.
- **Unified Health Timeline**: Chronological progression with category filters.

### 5. Grounded AI Health Assistant
- Floating trigger button with liquid pulse effect in bottom-right corner.
- Glassmorphism slide-out chat interface.
- Strictly grounds responses in user-authorized profile data (medications, conditions, reports) while separating direct record citations from general medical knowledge.
- Safety guardrails: No prescribing, no diagnosing, directs acute symptoms to emergency services.

### 6. Authentication & Onboarding Setup Wizard
- Sign in, Sign up, Forgot password, and 1-click Eleanor Vance demo switch.
- 7-step guided setup wizard for new patient profiles with skip capabilities.

### 7. Security, Privacy & Compliance
- **Zero Frontend Secret Exposure**: Gemini API keys are server-side only via Express backend.
- **Data Erasure**: Right-to-erasure endpoint to permanently delete health records.
- **Data Portability**: Full JSON export and printable clinic summary format.

---

## Getting Started

### Prerequisites
- Node.js 20+ or 22+
- Gemini API key (optional for demo mode, required for live AI generation)

### Installation
```bash
npm install
```

### Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `GEMINI_API_KEY` is specified.

### Running Development Server
```bash
npm run dev
```
The full-stack application will run on [http://localhost:3000](http://localhost:3000).

### Building for Production
```bash
npm run build
npm start
```
