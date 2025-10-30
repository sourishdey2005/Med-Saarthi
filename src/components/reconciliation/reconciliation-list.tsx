import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowRight, Bot } from 'lucide-react'

const reconciliationQueue = [
    { id: 'rec1', patientId: '1', name: 'Priya Sharma', avatarUrl: 'https://picsum.photos/seed/patient1/100/100', admissionDate: '2024-05-10', attending: 'Dr. Mehta', risk: 'High' },
    { id: 'rec2', patientId: '4', name: 'Vikram Singh', avatarUrl: 'https://picsum.photos/seed/patient4/100/100', admissionDate: '2024-05-15', attending: 'Dr. Desai', risk: 'High' },
    { id: 'rec3', patientId: '5', name: 'Suresh Gupta', avatarUrl: 'https://picsum.photos/seed/patient5/100/100', admissionDate: '2024-05-16', attending: 'Dr. Verma', risk: 'Medium' },
    { id: 'rec4', patientId: '6', name: 'Lalita Iyer', avatarUrl: 'https://picsum.photos/seed/patient6/100/100', admissionDate: '2024-05-17', attending: 'Dr. Mehta', risk: 'Medium' },
    { id: 'rec5', patientId: '7', name: 'Ramesh Reddy', avatarUrl: 'https://picsum.photos/seed/patient7/100/100', admissionDate: '2024-05-18', attending: 'Dr. Desai', risk: 'Low' },
    { id: 'rec6', patientId: '8', name: 'Sunita Patil', avatarUrl: 'https://picsum.photos/seed/patient8/100/100', admissionDate: '2024-05-18', attending: 'Dr. Verma', risk: 'Low' },
    { id: 'rec7', patientId: '9', name: 'Arun Joshi', avatarUrl: 'https://picsum.photos/seed/patient9/100/100', admissionDate: '2024-05-19', attending: 'Dr. Mehta', risk: 'High' },
    { id: 'rec8', patientId: '10', name: 'Gita Menon', avatarUrl: 'https://picsum.photos/seed/patient10/100/100', admissionDate: '2024-05-20', attending: 'Dr. Desai', risk: 'Medium' },
    { id: 'rec9', patientId: '11', name: 'Kiran Desai', avatarUrl: 'https://picsum.photos/seed/patient11/100/100', admissionDate: '2024-05-20', attending: 'Dr. Verma', risk: 'Low' },
    { id: 'rec10', patientId: '12', name: 'Manju Devi', avatarUrl: 'https://picsum.photos/seed/patient12/100/100', admissionDate: '2024-05-21', attending: 'Dr. Mehta', risk: 'Medium' },
]

export function ReconciliationList() {
    const getRiskBadgeVariant = (risk: string): 'destructive' | 'secondary' | 'outline' => {
        if (risk === 'High') return 'destructive';
        if (risk === 'Medium') return 'secondary';
        return 'outline';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reconciliation Queue</CardTitle>
                <CardDescription>Patients needing medication reconciliation before discharge.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead>Admission Date</TableHead>
                            <TableHead>Attending Physician</TableHead>
                            <TableHead>AI Risk Score</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reconciliationQueue.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={item.avatarUrl} alt={item.name} />
                                            <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">{item.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{new Date(item.admissionDate).toLocaleDateString()}</TableCell>
                                <TableCell>{item.attending}</TableCell>
                                <TableCell>
                                    <Badge variant={getRiskBadgeVariant(item.risk)}>{item.risk}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/patients/${item.patientId}?tab=medication`}>
                                            Start Reconciliation <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
