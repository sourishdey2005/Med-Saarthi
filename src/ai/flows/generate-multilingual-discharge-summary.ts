'use server';
/**
 * @fileOverview A multilingual discharge summary generator AI agent.
 *
 * - generateMultilingualDischargeSummary - A function that handles the generation of multilingual discharge summaries.
 * - GenerateMultilingualDischargeSummaryInput - The input type for the generateMultilingualDischargeSummary function.
 * - GenerateMultilingualDischargeSummaryOutput - The return type for the generateMultilingualDischargeSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMultilingualDischargeSummaryInputSchema = z.object({
  patientDetails: z.string().describe('Details of the patient including name, ABHA ID, and admission date.'),
  diagnosis: z.string().describe('Diagnosis of the patient using ICD-10 or SNOMED-CT codes.'),
  medications: z.string().describe('Pre- and post-discharge medication comparison.'),
  followUp: z.string().describe('Follow-up instructions including time, doctor, and hospital contact.'),
  languagePreference: z.enum(['en', 'hi', 'bn', 'ta', 'mr']).describe('The language in which the discharge summary should be generated. en = English, hi = Hindi, bn = Bengali, ta = Tamil, mr = Marathi'),
});
export type GenerateMultilingualDischargeSummaryInput = z.infer<typeof GenerateMultilingualDischargeSummaryInputSchema>;

const GenerateMultilingualDischargeSummaryOutputSchema = z.object({
  dischargeSummary: z.string().describe('The generated discharge summary in the requested language.'),
});
export type GenerateMultilingualDischargeSummaryOutput = z.infer<typeof GenerateMultilingualDischargeSummaryOutputSchema>;

export async function generateMultilingualDischargeSummary(input: GenerateMultilingualDischargeSummaryInput): Promise<GenerateMultilingualDischargeSummaryOutput> {
  return generateMultilingualDischargeSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMultilingualDischargeSummaryPrompt',
  input: {schema: GenerateMultilingualDischargeSummaryInputSchema},
  output: {schema: GenerateMultilingualDischargeSummaryOutputSchema},
  prompt: `You are a clinical expert responsible for generating discharge summaries for patients in their preferred language. Your response must be culturally and regionally aware, especially regarding dietary advice.

Generate a discharge summary in {{{languagePreference}}} based on the following information:

Patient Details: {{{patientDetails}}}
Diagnosis: {{{diagnosis}}}
Medications: {{{medications}}}
Follow-up Instructions: {{{followUp}}}

Instructions:
1.  **Language**: The entire summary must be in the requested language: {{{languagePreference}}}.
2.  **Clarity**: Use simple, clear language suitable for a patient with low health literacy.
3.  **Cultural Context**: When providing advice (e.g., diet), consider common Indian dietary habits. For example, if mentioning dietary restrictions related to medication, use examples of common Indian foods to avoid.
4.  **Structure**: The summary should be well-structured with clear headings for Diagnosis, Medications, and Follow-up.
5.  **Tone**: Maintain a supportive and empathetic tone.

Example for dietary advice: If a patient is on warfarin, instead of just "Avoid Vitamin K rich foods," you might add "(जैसे की पालक, सरसों का साग, और अन्य हरी पत्तेदार सब्जियाँ कम खाएं)" if the language is Hindi.

Ensure the final discharge summary is easy to understand and provides clear, actionable instructions for the patient.`,
});

const generateMultilingualDischargeSummaryFlow = ai.defineFlow(
  {
    name: 'generateMultilingualDischargeSummaryFlow',
    inputSchema: GenerateMultilingualDischargeSummaryInputSchema,
    outputSchema: GenerateMultilingualDischargeSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
