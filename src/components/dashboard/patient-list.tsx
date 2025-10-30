import Link from 'next/link'
import { patients } from '@/lib/data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { PlusCircle } from 'lucide-react'

export function PatientList() {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'Reconciliation Pending':
        return 'destructive'
      case 'Discharged':
        return 'secondary'
      case 'Admitted':
      default:
        return 'default'
    }
  }

  return (
    <div>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Your Patients</h2>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Patient
            </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {patients.map((patient) => (
            <Card key={patient.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarImage src={patient.avatarUrl} alt={patient.name} />
                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                <CardTitle className="text-lg">{patient.name}</CardTitle>
                <CardDescription>ABHA: {patient.abhaId}</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="grid gap-2 flex-grow">
                <div className="text-sm text-muted-foreground">
                {patient.age} years old, {patient.gender}
                </div>
                <div className="text-sm text-muted-foreground">
                Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
                </div>
                <div>
                <Badge variant={getBadgeVariant(patient.status)}>{patient.status}</Badge>
                </div>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                <Link href={`/dashboard/patients/${patient.id}`}>View Details</Link>
                </Button>
            </CardFooter>
            </Card>
        ))}
        </div>
    </div>
  )
}
