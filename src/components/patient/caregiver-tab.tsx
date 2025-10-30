import type { Patient } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { PlusCircle, Trash2 } from 'lucide-react'

interface CaregiverTabProps {
  patient: Patient
}

export default function CaregiverTab({ patient }: CaregiverTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Caregiver Information</CardTitle>
            <CardDescription>Manage patient's support network.</CardDescription>
          </div>
          <Button size="sm" variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Caregiver
          </Button>
        </CardHeader>
        <CardContent>
          {patient.caregivers.length > 0 ? (
            <ul className="space-y-4">
              {patient.caregivers.map((caregiver) => (
                <li key={caregiver.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={caregiver.avatarUrl} alt={caregiver.name} />
                      <AvatarFallback>{caregiver.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{caregiver.name}</p>
                      <p className="text-sm text-muted-foreground">{caregiver.relation} | {caregiver.phone}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No caregivers added for this patient.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Communication & Reminders</CardTitle>
          <CardDescription>Configure adherence nudges via WhatsApp and SMS.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="whatsapp-reminders" className="font-semibold">WhatsApp Reminders</Label>
                    <Switch id="whatsapp-reminders" defaultChecked/>
                </div>
                <p className="text-sm text-muted-foreground">Send daily medication reminders and educational videos to the patient and caregivers.</p>
            </div>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="sms-reminders" className="font-semibold">SMS Reminders</Label>
                    <Switch id="sms-reminders" />
                </div>
                 <p className="text-sm text-muted-foreground">Send critical alerts and follow-up appointment reminders via SMS.</p>
            </div>
            <Button variant="secondary" className="w-full">Send Test Reminder</Button>
        </CardContent>
      </Card>
    </div>
  )
}
