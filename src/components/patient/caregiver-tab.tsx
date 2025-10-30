import type { Patient } from '@/lib/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { PlusCircle, Trash2, UserCheck, Send, MessageCircleWarning } from 'lucide-react'

interface CaregiverTabProps {
  patient: Patient
}

export default function CaregiverTab({ patient }: CaregiverTabProps) {
    const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Acknowledged':
        return 'secondary'
      case 'Declined':
        return 'destructive'
      case 'Pending':
      default:
        return 'outline'
    }
  }
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Caregiver Information</CardTitle>
            <CardDescription>Manage patient's support network and home-nurse integration.</CardDescription>
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
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Caregiver Engagement</CardTitle>
            <CardDescription>Verify family comprehension of the care plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {patient.caregivers.map(cg => (
                <div key={cg.id} className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">{cg.name}</p>
                        <p className="text-xs text-muted-foreground">Plan Comprehension</p>
                    </div>
                    <Badge variant={getBadgeVariant(cg.comprehensionStatus)}>
                        {cg.comprehensionStatus === 'Acknowledged' && <UserCheck className="mr-2 h-4 w-4"/>}
                        {cg.comprehensionStatus === 'Pending' && <MessageCircleWarning className="mr-2 h-4 w-4"/>}
                        {cg.comprehensionStatus}
                    </Badge>
                </div>
            ))}
             <Button variant="secondary" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send Comprehension Check
            </Button>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
            <CardTitle>Communication & Reminders</CardTitle>
            <CardDescription>Configure adherence nudges.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="whatsapp-reminders" className="font-normal">WhatsApp Reminders</Label>
                    <Switch id="whatsapp-reminders" defaultChecked/>
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="sms-reminders" className="font-normal">SMS Reminders</Label>
                    <Switch id="sms-reminders" />
                </div>
            </CardContent>
        </Card>
      </div>

    </div>
  )
}
