'use server';
/**
 * @fileOverview An AI agent for triaging patient-reported symptoms.
 *
 * - triageSymptoms - A function that analyzes symptoms and provides a triage assessment.
 * - TriageSymptomsInput - The input type for the triageSymptoms function.
 * - TriageSymptomsOutput - The return type for the triageSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SymptomSchema = z.object({
  date: z.string(),
  symptom: z.string(),
  severity: z.string(),
  notes: z.string(),
});

export const TriageSymptomsInputSchema = z.object({
  patientContext: z.object({
    age: z.number(),
    gender: z.string(),
    conditions: z.string(),
  }),
  symptoms: z.array(SymptomSchema),
});
export type TriageSymptomsInput = z.infer<typeof TriageSymptomsInputSchema>;

export const TriageSymptomsOutputSchema = z.object({
  triageLevel: z.enum(['Routine', 'Urgent', 'Emergency']),
  recommendation: z.string().describe('A concise recommendation for the clinician based on the triage level and symptoms.'),
  reasoning: z.string().describe('A brief explanation for the triage assessment.'),
});
export type TriageSymptomsOutput = z.infer<typeof TriageSymptomsOutputSchema>;

export async function triageSymptoms(input: TriageSymptomsInput): Promise<TriageSymptomsOutput> {
  return triageSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'triageSymptomsPrompt',
  input: {schema: TriageSymptomsInputSchema},
  output: {schema: TriageSymptomsOutputSchema},
  prompt: `You are a clinical triage assistant AI. Your role is to analyze patient-reported symptoms and provide a triage assessment for a supervising clinician.

Patient Profile:
- Age: {{patientContext.age}}
- Gender: {{patientContext.gender}}
- Known Conditions: {{patientContext.conditions}}

Reported Symptoms:
{{#each symptoms}}
- Date: {{date}}, Symptom: {{symptom}} (Severity: {{severity}}), Notes: {{notes}}
{{/each}}

Based on the patient's profile and the reported symptoms, perform the following:
1.  **Assess Severity**: Determine the urgency of the situation.
2.  **Triage Level**: Categorize the situation as 'Routine', 'Urgent', or 'Emergency'.
    - 'Emergency': Symptoms suggest a life-threatening condition (e.g., severe chest pain, difficulty breathing). Recommend immediate medical attention.
    - 'Urgent': Symptoms are serious and require prompt attention but are not immediately life-threatening (e.g., worsening of a chronic condition). Recommend contacting the patient soon.
    - 'Routine': Symptoms are mild and likely not indicative of a serious issue. Recommend continued monitoring.
3.  **Provide a Recommendation**: Give a clear, actionable next step for the clinician.
4.  **Explain Reasoning**: Briefly explain why you arrived at your conclusion.

Focus on the combination of symptoms and the patient's underlying conditions. For example, shortness of breath is more concerning in a patient with a history of heart disease.
`,
});

const triageSymptomsFlow = ai.defineFlow(
  {
    name: 'triageSymptomsFlow',
    inputSchema: TriageSymptomsInputSchema,
    outputSchema: TriageSymptomsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
