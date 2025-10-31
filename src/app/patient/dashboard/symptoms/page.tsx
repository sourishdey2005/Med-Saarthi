import { getPatientById } from '@/lib/data'
import { PageHeader } from '@/components/page-header'
import { notFound } from 'next/navigation'
import SymptomDiaryTab from '@/components/patient/symptom-diary-tab'

export default function PatientSymptomsPage() {
  const patient = getPatientById('1');

  if (!patient) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <PageHeader 
        title="Symptom Diary" 
        breadcrumbs={[
            { label: 'My Dashboard', href: '/patient/dashboard' },
            { label: 'Symptom Diary', href: '/patient/dashboard/symptoms' }
        ]}
      />
      <div className="grid gap-6">
        <SymptomDiaryTab patient={patient} />
      </div>
    </main>
  );
}
