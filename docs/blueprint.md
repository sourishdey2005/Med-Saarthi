# **App Name**: Med-Saarthi: Digital Discharge Companion

## Core Features:

- Medication Reconciliation: Automated reconciliation of pre-admission and discharge medications, cross-referencing ABHA health records and hospital data.
- Interaction Flagging: Flags drug-drug, drug-disease, and allergy interactions using SNOMED-CT, RxNorm-India, NLEM, and FHIR resources.
- Multilingual Discharge Summaries: Generates simplified discharge summaries in English, Hindi, Bengali, Tamil, and Marathi, powered by an LLM tool. Summaries are structured and FHIR-compatible.
- WhatsApp Integration: Sends patient education videos and medication reminders via WhatsApp API and SMS.
- Risk Scoring & Alerting: Implements risk scoring based on DDI, DDI-Ayurveda interactions, and renal/hepatic dose adjustments, with red-flag alerts for elderly and pediatric patients.
- ABHA Integration: Integration with Ayushman Bharat Digital Mission (ABDM) via ABHA-linked login for secure access.
- Caregiver Support: Digital caregiver support module, providing medication adherence nudges and access to patient information with appropriate permissions.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to convey trust and reliability, reminiscent of traditional healthcare settings. 
- Background color: Light blue (#E3F2FD), a desaturated version of the primary to create a calm and trustworthy backdrop.
- Accent color: Indigo (#5C6BC0), a harmonious variation on the primary blue, to add visual interest while maintaining a professional appearance.
- Body and headline font: 'PT Sans', a humanist sans-serif with a modern, accessible feel, for both headlines and body text.
- Use universally recognizable icons supplemented with pictograms adapted for low-literacy users. These will visually represent dosage times and potential warnings, which is in line with Indian standards for effective, multimodal health communication.
- Implement a clean, low-literacy UI design with ample spacing and clear hierarchy to ensure ease of use for diverse populations, compliant with digital health record guidelines.
- Use subtle, non-distracting animations for transitions and feedback, reinforcing user actions without overwhelming users, especially elderly.