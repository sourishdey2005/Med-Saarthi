'use server';
/**
 * @fileOverview A Text-to-Speech (TTS) AI agent for generating audio guidance.
 *
 * - generateAudioGuidance - A function that converts text to speech.
 * - GenerateAudioGuidanceInput - The input type for the generateAudioGuidance function.
 * - GenerateAudioGuidanceOutput - The return type for the generateAudioGuidance function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const GenerateAudioGuidanceInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
  language: z.string().describe('The language of the text (e.g., "en", "hi").'),
});
export type GenerateAudioGuidanceInput = z.infer<typeof GenerateAudioGuidanceInputSchema>;

const GenerateAudioGuidanceOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated audio as a data URI. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type GenerateAudioGuidanceOutput = z.infer<typeof GenerateAudioGuidanceOutputSchema>;

export async function generateAudioGuidance(input: GenerateAudioGuidanceInput): Promise<GenerateAudioGuidanceOutput> {
  return generateAudioGuidanceFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateAudioGuidanceFlow = ai.defineFlow(
  {
    name: 'generateAudioGuidanceFlow',
    inputSchema: GenerateAudioGuidanceInputSchema,
    outputSchema: GenerateAudioGuidanceOutputSchema,
  },
  async ({ text, language }) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A voice that may support multiple languages
          },
        },
      },
      prompt: text,
    });

    if (!media) {
      throw new Error('No audio media was generated.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
