import { notFound } from 'next/navigation'
import { getPatientById } from '@/lib/data'
import type { Patient } from '@/lib/types'
import { PageHeader } from '@/components/page-header'
import { PatientHeaderActions } from '@/components/patient/patient-header-actions'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import OverviewTab from '@/components/patient/overview-tab'
import MedicationTab from '@/components/patient/medication-tab'
import DischargeTab from '@/components/patient/discharge-tab'
import CaregiverTab from '@/components/patient/caregiver-tab'
import AdherenceTab from '@/components/patient/adherence-tab'
import { FileText, Pill, Users, LayoutGrid, ClipboardCheck } from 'lucide-react'

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = getPatientById(params.id)

  if (!patient) {
    notFound()
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader
        title={patient.name}
        breadcrumbs={[
          { href: '/dashboard', label: 'Dashboard' },
          { href: `/patients/${patient.id}`, label: 'Patient Details' },
        ]}
        actions={<PatientHeaderActions />}
      />

      <div className="mb-4 flex items-center gap-4">
        <Avatar className="h-16 w-16 border">
          <AvatarImage src={patient.avatarUrl} alt={patient.name} />
          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-muted-foreground">ABHA ID: {patient.abhaId}</p>
          <p className="text-muted-foreground">
            {patient.age} y/o {patient.gender} | Admitted: {new Date(patient.admissionDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="grid gap-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="overview"><LayoutGrid className="mr-2 h-4 w-4"/>Overview</TabsTrigger>
          <TabsTrigger value="medication"><Pill className="mr-2 h-4 w-4"/>Medication</TabsTrigger>
          <TabsTrigger value="adherence"><ClipboardCheck className="mr-2 h-4 w-4"/>Adherence</TabsTrigger>
          <TabsTrigger value="discharge"><FileText className="mr-2 h-4 w-4"/>Discharge</TabsTrigger>
          <TabsTrigger value="caregivers"><Users className="mr-2 h-4 w-4"/>Caregivers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
            <OverviewTab patient={patient} />
        </TabsContent>
        <TabsContent value="medication">
            <MedicationTab patient={patient} />
        </TabsContent>
         <TabsContent value="adherence">
            <AdherenceTab patient={patient} />
        </TabsContent>
        <TabsContent value="discharge">
            <DischargeTab patient={patient} />
        </TabsContent>
        <TabsContent value="caregivers">
            <CaregiverTab patient={patient} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
