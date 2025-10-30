'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Medication } from '@/lib/types';

interface ClinicalRiskHeatmapProps {
  medications: Medication[];
}

const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

// Simple logic to generate a risk score - in a real app, this would be complex
const getRiskScore = (medName: string, time: string) => {
  let score = Math.random() * 20; // Base random risk
  if (medName.toLowerCase().includes('aspirin') && (time === 'Morning' || time === 'Afternoon')) {
    score += 30;
  }
  if (medName.toLowerCase().includes('atorvastatin') && time === 'Night') {
    score += 25;
  }
  if (medName.toLowerCase().includes('metformin') && (time === 'Morning' || time === 'Evening')) {
    score += 15;
  }
  return Math.min(100, score);
};

const getRiskColor = (score: number) => {
  if (score > 60) return 'bg-red-500/30';
  if (score > 30) return 'bg-yellow-500/30';
  return 'bg-green-500/20';
};

export default function ClinicalRiskHeatmap({ medications }: ClinicalRiskHeatmapProps) {
  const medNames = [...new Set(medications.map((m) => m.name))];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Risk Heatmap</CardTitle>
        <CardDescription>Potential risk hotspots based on medication timing.</CardDescription>
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
                    const risk = getRiskScore(medName, time);
                    return (
                      <TableCell key={time} className={`text-center ${getRiskColor(risk)}`}>
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
