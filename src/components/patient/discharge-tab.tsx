'use client'

import React, { useState, useTransition } from 'react'
import Image from 'next/image'
import { generateMultilingualDischargeSummary } from '@/ai/flows/generate-multilingual-discharge-summary'
import { explainMedication } from '@/ai/flows/explain-medication'
import { generateAudioGuidance } from '@/ai/flows/generate-audio-guidance'
import type { Patient } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog'
import { Bot, Loader2, Volume2, QrCode, Sparkles } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { AfternoonIcon, MorningIcon, NightIcon, WithFoodIcon } from '../icons'
import DischargeReadinessChart from './discharge-readiness-chart'
import HealthLiteracyGauge from './health-literacy-gauge'

interface DischargeTabProps {
  patient: Patient
}

const languages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी (Hindi)' },
  { value: 'bn', label: 'বাংলা (Bengali)' },
  { value: 'ta', label: 'தமிழ் (Tamil)' },
  { value: 'mr', label: 'मराठी (Marathi)' },
]

function MedicationExplanationDialog({ medicationName, language }: { medicationName: string; language: string }) {
  const [explanation, setExplanation] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleExplain = () => {
    startTransition(async () => {
      try {
        const result = await explainMedication({ medicationName, language });
        setExplanation(result.explanation);
      } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: `Failed to explain ${medicationName}.`, variant: 'destructive' });
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="h-auto p-0" onClick={handleExplain}>
          <Sparkles className="mr-1 h-3 w-3" /> Explain
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>What is {medicationName}?</DialogTitle>
          <DialogDescription>
            A simple explanation of this medication.
          </DialogDescription>
        </DialogHeader>
        <div className="prose prose-sm max-w-none">
          {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <p>{explanation}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AudioGuidanceDialog({ summary, language }: { summary: string; language: string }) {
  const [audioDataUri, setAudioDataUri] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerateAudio = () => {
    if (!summary) {
      toast({ title: 'No Summary', description: 'Please generate a summary first.', variant: 'destructive' });
      return;
    }
    startTransition(async () => {
      try {
        const result = await generateAudioGuidance({ text: summary, language });
        setAudioDataUri(result.audioDataUri);
      } catch (error) {
        console.error(error);
        toast({ title: 'Audio Generation Failed', description: 'Could not generate audio guidance.', variant: 'destructive' });
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={handleGenerateAudio} disabled={!summary}>
          <Volume2 className="mr-2 h-4 w-4" />
          Audio Guidance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Audio Guidance</DialogTitle>
          <DialogDescription>Listen to the discharge summary instructions.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          {isPending ? (
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          ) : audioDataUri ? (
            <audio controls src={audioDataUri} className="w-full">
              Your browser does not support the audio element.
            </audio>
          ) : (
            <p className="text-muted-foreground">Click the button to generate audio.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


export default function DischargeTab({ patient }: DischargeTabProps) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const [summary, setSummary] = useState('')
  
  const qrCodeImage = PlaceHolderImages.find(img => img.id === 'qr-code');

  const [formState, setFormState] = useState({
    patientDetails: `Name: ${patient.name}, ABHA ID: ${patient.abhaId}, Admission Date: ${patient.admissionDate}`,
    diagnosis: patient.diagnosis,
    medications: `Pre-admission: ${patient.medications.preAdmission.map(m => m.name).join(', ')}. Post-discharge: ${patient.medications.postDischarge.map(m => `${m.name} (${m.dosage})`).join(', ')}.`,
    followUp: patient.followUp,
    languagePreference: 'en',
  })

  const handleGenerateSummary = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        const result = await generateMultilingualDischargeSummary({
          ...formState,
          languagePreference: formState.languagePreference as 'en' | 'hi' | 'bn' | 'ta' | 'mr',
        })
        setSummary(result.dischargeSummary)
        toast({ title: 'Success', description: 'Discharge summary generated.' })
      } catch (error) {
        console.error(error)
        toast({ title: 'Error', description: 'Failed to generate summary.', variant: 'destructive' })
      }
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }

  const handleSelectChange = (value: string) => {
    setFormState({ ...formState, languagePreference: value })
  }
  
  const readinessData = [
    { metric: 'Medication Plan Understood', score: 85, fullMark: 100 },
    { metric: 'Vitals Stable', score: 90, fullMark: 100 },
    { metric: 'Follow-up Scheduled', score: 100, fullMark: 100 },
    { metric: 'Caregiver Prepared', score: 70, fullMark: 100 },
    { metric: 'Red Flags Resolved', score: 80, fullMark: 100 },
    { metric: 'Patient Confident', score: 75, fullMark: 100 },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Generate Discharge Summary</CardTitle>
          <CardDescription>Use AI to generate a multilingual summary for the patient.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerateSummary} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientDetails">Patient Details</Label>
              <Textarea id="patientDetails" name="patientDetails" value={formState.patientDetails} onChange={handleInputChange} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Input id="diagnosis" name="diagnosis" value={formState.diagnosis} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medications">Medications</Label>
              <Textarea id="medications" name="medications" value={formState.medications} onChange={handleInputChange} rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="followUp">Follow-up Instructions</Label>
              <Textarea id="followUp" name="followUp" value={formState.followUp} onChange={handleInputChange} rows={2} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="languagePreference">Language</Label>
              <Select name="languagePreference" value={formState.languagePreference} onValueChange={handleSelectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              Generate Summary
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="md:col-span-3 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Discharge Summary Preview</CardTitle>
            <CardDescription>The generated summary will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {summary ? (
              <div className="space-y-6">
                  <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">{summary}</div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Medication Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                          {patient.medications.postDischarge.map(med => (
                            <li key={med.id} className="flex justify-between items-center">
                              <span>{med.name} ({med.dosage}) - {med.frequency}</span>
                              <MedicationExplanationDialog medicationName={med.name} language={formState.languagePreference} />
                            </li>
                          ))}
                        </ul>
                    </CardContent>
                  </Card>

                  <div className="rounded-lg border p-4 space-y-4">
                      <h4 className="font-semibold">Pictogram Instructions</h4>
                      <div className="flex items-center justify-around text-center text-xs text-muted-foreground">
                          <div className="flex flex-col items-center gap-1">
                              <MorningIcon className="h-8 w-8 text-primary"/>
                              <span>Morning</span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                              <AfternoonIcon className="h-8 w-8 text-primary"/>
                              <span>Afternoon</span>
                          </div>
                           <div className="flex flex-col items-center gap-1">
                              <NightIcon className="h-8 w-8 text-primary"/>
                              <span>Night</span>
                          </div>
                           <div className="flex flex-col items-center gap-1">
                              <WithFoodIcon className="h-8 w-8 text-primary"/>
                              <span>With Food</span>
                          </div>
                      </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-lg border p-4">
                      <div className="space-y-2">
                          <h4 className="font-semibold">Verification & Guidance</h4>
                          <AudioGuidanceDialog summary={summary} language={formState.languagePreference} />
                          <p className="text-xs text-muted-foreground">Scan for pharmacist verification.</p>
                      </div>
                       {qrCodeImage && (
                          <Image 
                              src={qrCodeImage.imageUrl} 
                              alt={qrCodeImage.description} 
                              width={120} 
                              height={120}
                              data-ai-hint={qrCodeImage.imageHint}
                              className="rounded-md"
                          />
                      )}
                  </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
                <p className="text-muted-foreground">No summary generated yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Discharge Readiness</CardTitle>
                    <CardDescription>At-a-glance view of patient's readiness for discharge.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DischargeReadinessChart data={readinessData} />
                </CardContent>
            </Card>
             {patient.healthLiteracyScore && (
                <HealthLiteracyGauge score={patient.healthLiteracyScore} />
            )}
        </div>
      </div>
    </div>
  )
}
