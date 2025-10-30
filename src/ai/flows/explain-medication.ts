'use server';
/**
 * @fileOverview An LLM-based agent to explain medications in simple terms.
 *
 * - explainMedication - A function that provides a simple explanation for a given medication.
 * - ExplainMedicationInput - The input type for the explainMedication function.
 * - ExplainMedicationOutput - The return type for the explainMedication function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainMedicationInputSchema = z.object({
  medicationName: z.string().describe('The name of the medication to be explained.'),
  language: z.string().describe('The language for the explanation (e.g., "English", "Hindi").'),
});
export type ExplainMedicationInput = z.infer<typeof ExplainMedicationInputSchema>;

const ExplainMedicationOutputSchema = z.object({
  explanation: z.string().describe('A simple, easy-to-understand explanation of the medication.'),
});
export type ExplainMedicationOutput = z.infer<typeof ExplainMedicationOutputSchema>;

export async function explainMedication(input: ExplainMedicationInput): Promise<ExplainMedicationOutput> {
  return explainMedicationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainMedicationPrompt',
  input: {schema: ExplainMedicationInputSchema},
  output: {schema: ExplainMedicationOutputSchema},
  prompt: `You are a helpful medical assistant. Explain the medication "{{medicationName}}" in very simple, easy-to-understand terms for a patient who may have low health literacy. Provide the explanation in {{language}}.

Focus on:
1.  What is this medicine for? (its main purpose)
2.  What is the most important thing to know about taking it?

Keep the explanation to 2-3 short sentences.`,
});

const explainMedicationFlow = ai.defineFlow(
  {
    name: 'explainMedicationFlow',
    inputSchema: ExplainMedicationInputSchema,
    outputSchema: ExplainMedicationOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
