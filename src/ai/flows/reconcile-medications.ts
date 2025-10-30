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
  }),
  preAdmissionMedications: z.array(z.string()).describe('A list of medications the patient was taking before admission.'),
  postDischargeMedications: z.array(z.string()).describe('A list of medications prescribed for the patient after discharge.'),
});
export type ReconcileMedicationsInput = z.infer<typeof ReconcileMedicationsInputSchema>;

const AlertSchema = z.object({
    id: z.string(),
    type: z.enum(['Drug-Interaction', 'Dosage-Warning', 'Formulary-Alert', 'Anomaly-Detection']),
    severity: z.enum(['Critical', 'Warning', 'Info']),
    description: z.string(),
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
  prompt: `You are an AI-powered Medical Safety Engine. Your task is to analyze a patient's medication list for potential risks.

Patient Profile:
- Age: {{patientInfo.age}}
- Gender: {{patientInfo.gender}}
- Known Conditions: {{patientInfo.conditions}}

Medication Lists:
- Pre-Admission: {{#each preAdmissionMedications}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
- Post-Discharge: {{#each postDischargeMedications}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}

Analyze the transition from pre-admission to post-discharge medications. Identify and generate alerts for the following issues:
1.  **Anomaly Detection**: Flag any unusual or potentially dangerous changes (e.g., stopping a critical medication without a clear replacement, adding multiple drugs from the same class).
2.  **Dosage Intelligence**: Based on the patient's age ({{patientInfo.age}}), check for medications that require dosage adjustments for senior citizens.
3.  **Interaction Alerts**: Check for significant interactions between the post-discharge medications. Include interactions with common Ayurvedic supplements like Ashwagandha or Turmeric if relevant.
4.  **Formulary Alerts**: Flag if any medication is not standard for the patient's conditions.

Generate a list of alerts with a unique ID, type, severity, and a clear, concise description for the clinician. If no significant issues are found, return an empty array for the alerts.`,
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
