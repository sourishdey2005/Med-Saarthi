import type { Patient, Medication } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, ArrowRight, CheckCircle, MinusCircle, PlusCircle, XCircle } from 'lucide-react'

interface MedicationTabProps {
  patient: Patient
}

const statusIcons: { [key: string]: React.ReactNode } = {
  New: <PlusCircle className="h-4 w-4 text-green-500" />,
  Changed: <ArrowRight className="h-4 w-4 text-blue-500" />,
  Unchanged: <CheckCircle className="h-4 w-4 text-gray-500" />,
  Discontinued: <MinusCircle className="h-4 w-4 text-red-500" />,
}

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    New: 'default',
    Changed: 'default',
    Unchanged: 'secondary',
    Discontinued: 'destructive'
}

function MedicationList({ title, medications }: { title: string, medications: Medication[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Medication</TableHead>
                            <TableHead>Dosage</TableHead>
                            <TableHead>Frequency</TableHead>
                            {medications[0]?.status && <TableHead>Status</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {medications.map(med => (
                            <TableRow key={med.id}>
                                <TableCell className="font-medium">{med.name}</TableCell>
                                <TableCell>{med.dosage}</TableCell>
                                <TableCell>{med.frequency}</TableCell>
                                {med.status && (
                                    <TableCell>
                                        <Badge variant={statusColors[med.status]}>
                                            {statusIcons[med.status]}
                                            <span className="ml-1">{med.status}</span>
                                        </Badge>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

export default function MedicationTab({ patient }: MedicationTabProps) {
  return (
    <div className="grid gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Medication Reconciliation</CardTitle>
                <CardDescription>Comparison of pre-admission and post-discharge medications.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
                <MedicationList title="Pre-Admission Medications" medications={patient.medications.preAdmission} />
                <MedicationList title="Post-Discharge Medications" medications={patient.medications.postDischarge} />
            </CardContent>
        </Card>
      
        <Card>
            <CardHeader>
                <CardTitle>Interaction Alerts</CardTitle>
                <CardDescription>Potential drug-drug, drug-disease, and allergy interactions.</CardDescription>
            </CardHeader>
            <CardContent>
            {patient.alerts.length > 0 ? (
                <ul className="space-y-3">
                {patient.alerts.filter(a => a.type !== 'Dose').map((alert) => (
                    <li key={alert.id} className="flex items-start gap-3 rounded-md border p-3">
                    <div>
                        {alert.severity === 'Warning' ? <AlertTriangle className="h-5 w-5 text-yellow-500" /> : <XCircle className="h-5 w-5 text-destructive" />}
                    </div>
                    <div>
                        <p className="font-semibold">{alert.type}</p>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                    </li>
                ))}
                </ul>
            ) : (
                <p className="text-sm text-muted-foreground">No interaction alerts flagged.</p>
            )}
            </CardContent>
        </Card>
    </div>
  )
}
