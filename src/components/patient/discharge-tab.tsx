'use client'

import React, { useState, useTransition } from 'react'
import Image from 'next/image'
import { generateMultilingualDischargeSummary } from '@/ai/flows/generate-multilingual-discharge-summary'
import type { Patient } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bot, Loader2, Volume2, QrCode } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { AfternoonIcon, MorningIcon, NightIcon, WithFoodIcon } from '../icons'

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

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Discharge Summary Preview</CardTitle>
          <CardDescription>The generated summary will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {summary ? (
            <div className="space-y-6">
                <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">{summary}</div>
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
                        <Button variant="outline" size="sm"><Volume2 className="mr-2 h-4 w-4"/>Audio Guidance</Button>
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
    </div>
  )
}
