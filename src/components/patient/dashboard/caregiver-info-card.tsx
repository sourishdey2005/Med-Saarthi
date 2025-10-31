import type { Caregiver } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users } from 'lucide-react';

interface CaregiverInfoCardProps {
  caregivers: Caregiver[];
}

export function CaregiverInfoCard({ caregivers }: CaregiverInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          My Caregivers
        </CardTitle>
        <CardDescription>Your support network for a smooth recovery.</CardDescription>
      </CardHeader>
      <CardContent>
        {caregivers.length > 0 ? (
          <ul className="space-y-4">
            {caregivers.map((caregiver) => (
              <li key={caregiver.id} className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={caregiver.avatarUrl} alt={caregiver.name} />
                  <AvatarFallback>{caregiver.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{caregiver.name}</p>
                  <p className="text-sm text-muted-foreground">{caregiver.relation} | {caregiver.phone}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-center text-muted-foreground py-8">
            You haven't added any caregivers yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
