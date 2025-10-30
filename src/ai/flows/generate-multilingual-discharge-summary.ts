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
  prompt: `You are a clinical expert responsible for generating discharge summaries for patients in their preferred language.

Generate a discharge summary in {{{languagePreference}}} based on the following information:

Patient Details: {{{patientDetails}}}
Diagnosis: {{{diagnosis}}}
Medications: {{{medications}}}
Follow-up Instructions: {{{followUp}}}

Ensure the discharge summary is easy to understand and provides clear instructions for the patient.`,
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
