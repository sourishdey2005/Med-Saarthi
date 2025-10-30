'use client'

import React, { useState, useTransition } from 'react'
import { summarizeMedicalHistory } from '@/ai/flows/summarize-medical-history'
import type { Patient } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Bot, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface MedicalHistorySummaryProps {
  patient: Patient
}

export function MedicalHistorySummary({ patient }: MedicalHistorySummaryProps) {
  const [abhaRecord, setAbhaRecord] = useState(patient.abhaRecord)
  const [summary, setSummary] = useState('')
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const handleSummarize = () => {
    startTransition(async () => {
      try {
        const result = await summarizeMedicalHistory({ abhaRecord })
        setSummary(result.summary)
        toast({
            title: "Success",
            description: "Medical history summarized successfully."
        })
      } catch (error) {
        console.error('Error summarizing medical history:', error)
        toast({
            title: "Error",
            description: "Failed to summarize medical history.",
            variant: "destructive"
        })
      }
    })
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Medical History Summary</CardTitle>
        <CardDescription>
          Patient's medical history from ABHA record and its AI-generated summary.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <label htmlFor="abha-record" className="text-sm font-medium">
            ABHA Health Record
          </label>
          <Textarea
            id="abha-record"
            value={abhaRecord}
            onChange={(e) => setAbhaRecord(e.target.value)}
            rows={8}
            className="mt-1"
          />
        </div>
        <Button onClick={handleSummarize} disabled={isPending || !abhaRecord}>
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Bot className="mr-2 h-4 w-4" />
          )}
          Summarize with AI
        </Button>
        {summary && (
          <div className="rounded-md border bg-muted/50 p-4">
            <h4 className="font-semibold mb-2">AI Summary</h4>
            <p className="text-sm whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
