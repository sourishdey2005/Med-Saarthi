import type { Patient } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DischargeSummaryCardProps {
  patient: Patient;
}

export function DischargeSummaryCard({ patient }: DischargeSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          My Discharge Summary
        </CardTitle>
        <CardDescription>A brief overview of your diagnosis and follow-up plan.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm mb-1">Diagnosis</h4>
          <p className="text-sm text-muted-foreground">{patient.diagnosis}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-1">Doctor's Advice</h4>
          <p className="text-sm text-muted-foreground">{patient.followUp}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-1">Key Medications</h4>
          <div className="flex flex-wrap gap-2">
            {patient.medications.postDischarge.slice(0, 3).map((med) => (
              <Badge key={med.id} variant="secondary">{med.name}</Badge>
            ))}
            {patient.medications.postDischarge.length > 3 && (
              <Badge variant="outline">+{patient.medications.postDischarge.length - 3} more</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
