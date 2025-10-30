'use server';

/**
 * @fileOverview A flow that summarizes a patient's medical history from their ABHA record.
 *
 * - summarizeMedicalHistory - A function that handles the summarization of medical history.
 * - SummarizeMedicalHistoryInput - The input type for the summarizeMedicalHistory function.
 * - SummarizeMedicalHistoryOutput - The return type for the summarizeMedicalHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMedicalHistoryInputSchema = z.object({
  abhaRecord: z
    .string()
    .describe('The patient medical history from ABHA record.'),
});
export type SummarizeMedicalHistoryInput = z.infer<typeof SummarizeMedicalHistoryInputSchema>;

const SummarizeMedicalHistoryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the patient medical history.'),
});
export type SummarizeMedicalHistoryOutput = z.infer<typeof SummarizeMedicalHistoryOutputSchema>;

export async function summarizeMedicalHistory(input: SummarizeMedicalHistoryInput): Promise<SummarizeMedicalHistoryOutput> {
  return summarizeMedicalHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMedicalHistoryPrompt',
  input: {schema: SummarizeMedicalHistoryInputSchema},
  output: {schema: SummarizeMedicalHistoryOutputSchema},
  prompt: `You are an expert medical summarizer.
  Your goal is to provide a concise and accurate summary of a patient's medical history based on their ABHA record.
  Focus on key conditions, medications, and relevant past events.

  ABHA Record: {{{abhaRecord}}}`,
});

const summarizeMedicalHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeMedicalHistoryFlow',
    inputSchema: SummarizeMedicalHistoryInputSchema,
    outputSchema: SummarizeMedicalHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
