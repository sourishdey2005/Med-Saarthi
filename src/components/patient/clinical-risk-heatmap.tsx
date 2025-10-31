'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Medication, Patient } from '@/lib/types';

interface ClinicalRiskHeatmapProps {
  patient: Patient;
}

const timeSlots = ['Morning', 'Afternoon', 'Night'];

// More realistic risk scoring logic
const getRiskScore = (medName: string, time: string, patient: Patient) => {
  let score = 5; // Base risk

  // Medication-specific risks
  if (medName.toLowerCase().includes('aspirin')) score += 15;
  if (medName.toLowerCase().includes('metformin')) score += 10;
  if (medName.toLowerCase().includes('atorvastatin')) score += 10;
  if (medName.toLowerCase().includes('warfarin')) score += 40;
  if (medName.toLowerCase().includes('amlodipine')) score += 5;

  // Time-specific risks
  if (medName.toLowerCase().includes('atorvastatin') && time !== 'Night') {
    score += 20; // Statins are often best taken at night
  }
  if (medName.toLowerCase().includes('aspirin') && (time === 'Morning' || time === 'Afternoon')) {
    score += 10; // GI upset risk
  }

  // Patient-specific risks
  if (patient.age > 75) {
    score += 15; // General elderly risk
  }
  if (patient.egfr && patient.egfr < 60) {
    score += 20; // Renal impairment risk
     if (medName.toLowerCase().includes('metformin')) {
        score += 30; // High risk for metformin with CKD
     }
  }

  return Math.min(100, score + Math.random() * 10); // Add a little randomness
};

const getRiskColor = (score: number) => {
  if (score > 70) return 'bg-red-500/30';
  if (score > 40) return 'bg-yellow-500/30';
  return 'bg-green-500/20';
};

export default function ClinicalRiskHeatmap({ patient }: ClinicalRiskHeatmapProps) {
  const medications = patient.medications.postDischarge;
  const medNames = [...new Set(medications.map((m) => m.name))];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dosing Safety Heatmap</CardTitle>
        <CardDescription>Risk hotspots by medication, time, age, and renal status.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                {timeSlots.map((time) => (
                  <TableHead key={time} className="text-center">{time}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {medNames.map((medName) => (
                <TableRow key={medName}>
                  <TableCell className="font-medium">{medName}</TableCell>
                  {timeSlots.map((time) => {
                    const hasMedicationForTime = medications.some(m => m.name === medName && m.frequency.toLowerCase().includes(time.toLowerCase()));
                    const risk = hasMedicationForTime ? getRiskScore(medName, time, patient) : 0;
                    return (
                      <TableCell key={time} className={`text-center ${risk > 0 ? getRiskColor(risk) : ''}`}>
                        <div className="flex h-12 w-full items-center justify-center rounded-md">
                           {/* Intentionally left blank to create a heatmap cell */}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
         <div className="mt-4 flex items-center justify-end gap-4 text-xs">
            <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-green-500/20"></div>
                <span>Low Risk</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-yellow-500/30"></div>
                <span>Medium Risk</span>
            </div>
             <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-red-500/30"></div>
                <span>High Risk</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
