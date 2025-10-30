'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecoveryMilestone } from '@/lib/types';
import { CheckCircle2, CircleDashed, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

interface RecoveryMilestoneLadderProps {
  milestones: RecoveryMilestone[];
}

const statusIcons: { [key in RecoveryMilestone['status']]: React.ReactNode } = {
  Completed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
  'In-Progress': <CircleDot className="h-5 w-5 text-yellow-500 animate-pulse" />,
  'Not-Started': <CircleDashed className="h-5 w-5 text-muted-foreground" />,
};

const statusColors: { [key in RecoveryMilestone['status']]: string } = {
    Completed: 'border-green-500/50',
    'In-Progress': 'border-yellow-500/50',
    'Not-Started': 'border-border',
};

export default function RecoveryMilestoneLadder({ milestones }: RecoveryMilestoneLadderProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recovery Milestone Ladder</CardTitle>
        <CardDescription>Visual checklist of rehabilitation progress.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-4 pl-8">
            <div className="absolute left-[1.3rem] top-4 h-[calc(100%-2rem)] w-0.5 bg-border -translate-x-1/2" />
            {milestones.map((milestone) => (
                <div key={milestone.id} className="relative flex items-start">
                    <div className={cn("absolute left-0 top-1.5 h-6 w-6 rounded-full bg-background border-2 flex items-center justify-center", statusColors[milestone.status])}>
                         {statusIcons[milestone.status]}
                    </div>
                    <div className="pl-8">
                        <p className="font-medium">{milestone.name}</p>
                        {milestone.status === 'Completed' && milestone.date && (
                            <p className="text-xs text-muted-foreground">
                                Completed on {format(parseISO(milestone.date), 'PPP')}
                            </p>
                        )}
                        {milestone.status === 'In-Progress' && (
                             <p className="text-xs text-muted-foreground">
                                Currently working on this goal.
                            </p>
                        )}
                         {milestone.status === 'Not-Started' && (
                             <p className="text-xs text-muted-foreground">
                                Yet to be started.
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
