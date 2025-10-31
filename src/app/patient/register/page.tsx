import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MedSaarthiIcon } from '@/components/icons'

export default function PatientRegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
           <div className="mb-4 flex justify-center">
            <MedSaarthiIcon className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>
            Join Med-Saarthi to manage your health journey.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" placeholder="Priya Sharma" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="Enter your mobile number" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="abhaId">ABHA ID (Optional)</Label>
              <Input id="abhaId" placeholder="12-3456-7890-1234" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Link href="/patient/dashboard">
              <Button type="submit" className="w-full">
                Register
              </Button>
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/patient/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
