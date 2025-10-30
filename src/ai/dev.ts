import { config } from 'dotenv';
config();

import '@/ai/flows/generate-multilingual-discharge-summary.ts';
import '@/ai/flows/summarize-medical-history.ts';
import '@/ai/flows/reconcile-medications.ts';
import '@/ai/flows/explain-medication.ts';
