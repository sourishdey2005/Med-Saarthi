import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MedSaarthiIcon, AbhaIcon } from '@/components/icons'
import { Separator } from '@/components/ui/separator'

export default function PatientLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <MedSaarthiIcon className="h-16 w-16" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Patient Portal</CardTitle>
          <CardDescription className="text-muted-foreground">Welcome to your digital health companion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Link href="/patient/dashboard">
              <Button variant="outline" className="w-full">
                <AbhaIcon className="mr-2 h-5 w-5" />
                Login with ABHA
              </Button>
            </Link>
          </div>
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-border" />
            <span className="mx-4 flex-shrink text-sm text-muted-foreground">OR</span>
            <div className="flex-grow border-t border-border" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" placeholder="Enter your mobile number" required />
            </div>
            <Link href="/patient/dashboard" className="w-full">
              <Button className="w-full">Send OTP</Button>
            </Link>
          </div>
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              New user?{' '}
              <Link href="/patient/register" className="underline">
                Create an account
              </Link>
            </p>
          </div>
          <Separator className="my-6" />
           <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Are you a clinician?</p>
              <Link href="/login">
                <Button variant="link">Go to Clinician Portal</Button>
              </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
