'use server';
/**
 * @fileOverview An AI agent for advanced medication reconciliation and safety checks.
 *
 * - reconcileMedications - A function that analyzes medication changes and flags potential risks.
 * - ReconcileMedicationsInput - The input type for the reconcileMedications function.
 * - ReconcileMedicationsOutput - The return type for the reconcileMedications function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReconcileMedicationsInputSchema = z.object({
  patientInfo: z.object({
    age: z.number().describe('Age of the patient.'),
    gender: z.string().describe('Gender of the patient.'),
    conditions: z.string().describe('Patient\'s existing conditions (e.g., "Type 2 Diabetes, Hypertension, Renal impairment").'),
    egfr: z.number().optional().describe('Estimated Glomerular Filtration Rate (eGFR) for renal function assessment.'),
    lft: z.string().optional().describe('Liver Function Test summary (e.g., "Normal", "Slightly Elevated").'),
  }),
  preAdmissionMedications: z.array(z.string()).describe('A list of medications the patient was taking before admission.'),
  postDischargeMedications: z.array(z.string()).describe('A list of medications prescribed for the patient after discharge.'),
});
export type ReconcileMedicationsInput = z.infer<typeof ReconcileMedicationsInputSchema>;

const AlertSchema = z.object({
    id: z.string(),
    type: z.enum(['Drug-Interaction', 'Dosage-Warning', 'Formulary-Alert', 'Anomaly-Detection', 'Antibiotic-Stewardship', 'Dosage-Adjustment-Needed', 'Polypharmacy-Risk', 'Drug-Food-Interaction', 'Cognitive-Screening-Recommended']),
    severity: z.enum(['Critical', 'Warning', 'Info']),
    description: z.string(),
    reasoning: z.string().describe('A brief, SHAP-style explanation for why the alert was triggered, for clinician transparency.'),
    mechanism: z.string().optional().describe('For drug interactions, explain the metabolic pathway (e.g., CYP enzyme inhibition, QT prolongation) in simple terms.')
});

const ReconcileMedicationsOutputSchema = z.object({
  alerts: z.array(AlertSchema).describe('A list of potential safety alerts based on the medication reconciliation.'),
});
export type ReconcileMedicationsOutput = z.infer<typeof ReconcileMedicationsOutputSchema>;

export async function reconcileMedications(input: ReconcileMedicationsInput): Promise<ReconcileMedicationsOutput> {
  return reconcileMedicationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'reconcileMedicationsPrompt',
  input: {schema: ReconcileMedicationsInputSchema},
  output: {schema: ReconcileMedicationsOutputSchema},
  prompt: `You are an AI-powered Medical Safety Engine. Your task is to analyze a patient's medication list for a comprehensive set of potential risks and provide clear, explainable alerts based on Indian medical guidelines.

Patient Profile:
- Age: {{patientInfo.age}}
- Gender: {{patientInfo.gender}}
- Known Conditions: {{patientInfo.conditions}}
- Renal Function (eGFR): {{#if patientInfo.egfr}}{{patientInfo.egfr}} ml/min/1.73m²{{else}}Not Provided{{/if}}
- Liver Function: {{#if patientInfo.lft}}{{patientInfo.lft}}{{else}}Not Provided{{/if}}

Medication Lists:
- Pre-Admission: {{#each preAdmissionMedications}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
- Post-Discharge: {{#each postDischargeMedications}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}

Analyze the medication lists and patient profile. Generate alerts for the following issues:
1.  **Anomaly Detection**: Flag any unusual or potentially dangerous changes (e.g., stopping a critical medication like an anticoagulant without a clear replacement, adding multiple drugs from the same class).
2.  **Dosage Intelligence**: Based on the patient's age ({{patientInfo.age}}), check for medications that require dosage adjustments for senior citizens or have specific warnings for the elderly.
3.  **Interaction Alerts**: Check for significant drug-drug interactions between the post-discharge medications. For each 'Drug-Interaction' alert, **you must** provide a 'mechanism' field explaining the interaction pathway (e.g., "CYP3A4 Inhibition", "Additive QT Prolongation", "Increased Bleeding Risk", "Serotonin Syndrome"). The mechanism should be technical but concise.
4.  **Drug-Food Interaction Assistant**: Identify potential interactions with common foods (e.g., grapefruit and statins) or Ayurvedic/Indian spices (e.g., turmeric).
5.  **Formulary Alerts**: Flag if any medication is not standard first-line therapy for the patient's conditions based on Indian treatment guidelines.
6.  **Antibiotic Stewardship (ICMR Guidelines)**: If an antibiotic is prescribed, verify if it's a first-line agent for the given diagnosis ({{patientInfo.conditions}}). Flag broad-spectrum antibiotics if a narrower-spectrum one would suffice.
7.  **Renal/Hepatic Dosing**: If the patient has impaired renal (eGFR < 60) or hepatic function, check if any post-discharge medications require dose adjustment. Generate a 'Dosage-Adjustment-Needed' alert with a suggestion.
8.  **Polypharmacy Complexity Index**: If the patient is on more than 5 medications post-discharge, generate a 'Polypharmacy-Risk' alert. Mention the number of medications.
9.  **Cognitive Impairment Screening**: If the patient is elderly (age > 65) and has a complex medication regimen (e.g., high polypharmacy score, multiple timing changes), generate a 'Cognitive-Screening-Recommended' alert.

For each alert, generate a unique ID, type, severity, a concise description, and a 'reasoning' field. The reasoning should be a SHAP-style explanation (e.g., "TRIGGER: Statin added. REASON: Patient has Unstable Angina. ACTION: Recommended first-line therapy."). If no significant issues are found, return an empty array for the alerts.`,
});

const reconcileMedicationsFlow = ai.defineFlow(
  {
    name: 'reconcileMedicationsFlow',
    inputSchema: ReconcileMedicationsInputSchema,
    outputSchema: ReconcileMedicationsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
