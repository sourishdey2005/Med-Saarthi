import type { Medication } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pill, AlertCircle } from 'lucide-react';
import { AfternoonIcon, MorningIcon, NightIcon, WithFoodIcon } from '@/components/icons';

interface MedicationTimelineProps {
  medications: Medication[];
}

const getTimeIcon = (frequency: string) => {
    const freq = frequency.toLowerCase();
    if (freq.includes('morning')) return <MorningIcon className="h-6 w-6 text-primary" />;
    if (freq.includes('afternoon') || freq.includes('twice')) return <AfternoonIcon className="h-6 w-6 text-primary" />;
    if (freq.includes('night') || freq.includes('evening')) return <NightIcon className="h-6 w-6 text-primary" />;
    return <Pill className="h-6 w-6 text-primary" />;
};

export function MedicationTimeline({ medications }: MedicationTimelineProps) {
  const morningMeds = medications.filter(m => m.frequency.toLowerCase().includes('morning') || m.frequency.toLowerCase().includes('once a day'));
  const afternoonMeds = medications.filter(m => m.frequency.toLowerCase().includes('afternoon') || m.frequency.toLowerCase().includes('twice a day'));
  const nightMeds = medications.filter(m => m.frequency.toLowerCase().includes('night') || m.frequency.toLowerCase().includes('evening'));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-primary" />
          My Medication Schedule
        </CardTitle>
        <CardDescription>Your daily medication plan. Follow the instructions carefully.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Morning */}
        <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1">
                <MorningIcon className="h-8 w-8 text-yellow-500"/>
                <span className="text-xs font-bold">Morning</span>
            </div>
            <div className="flex-1 space-y-2 rounded-md border p-3">
                {morningMeds.length > 0 ? morningMeds.map(med => (
                    <div key={med.id} className="text-sm">
                        <span className="font-semibold">{med.name}</span> ({med.dosage})
                    </div>
                )) : <p className="text-sm text-muted-foreground">No medications scheduled.</p>}
            </div>
        </div>
        {/* Afternoon */}
        <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1">
                <AfternoonIcon className="h-8 w-8 text-orange-500"/>
                <span className="text-xs font-bold">Afternoon</span>
            </div>
            <div className="flex-1 space-y-2 rounded-md border p-3">
                 {afternoonMeds.length > 0 ? afternoonMeds.map(med => (
                    <div key={med.id} className="text-sm">
                        <span className="font-semibold">{med.name}</span> ({med.dosage})
                    </div>
                )) : <p className="text-sm text-muted-foreground">No medications scheduled.</p>}
            </div>
        </div>
        {/* Night */}
         <div className="flex gap-4">
            <div className="flex flex-col items-center gap-1">
                <NightIcon className="h-8 w-8 text-indigo-500"/>
                <span className="text-xs font-bold">Night</span>
            </div>
            <div className="flex-1 space-y-2 rounded-md border p-3">
                 {nightMeds.length > 0 ? nightMeds.map(med => (
                    <div key={med.id} className="text-sm">
                        <span className="font-semibold">{med.name}</span> ({med.dosage})
                    </div>
                )) : <p className="text-sm text-muted-foreground">No medications scheduled.</p>}
            </div>
        </div>
        <div className="flex items-start gap-3 rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-3">
            <AlertCircle className="h-5 w-5 text-yellow-700 mt-1" />
            <div className="text-sm text-yellow-800">
                <p className="font-semibold">Important Instructions</p>
                <p>Always take Atorvastatin at night. Take Aspirin with food to avoid stomach upset.</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
