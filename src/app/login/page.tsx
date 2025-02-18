'use client'

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session) {
      router.push('/dashboard')
    }
  }, [session, router])

  const handleLogin = async (provider: string) => {
    setIsLoading(true)
    await signIn(provider, { callbackUrl: '/dashboard' })
  }

  if (status === 'loading' || isLoading) {
    return (
      <Card className="max-w-md mx-auto mt-16">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Loading...</h2>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto mt-16">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Sign in to PassVault</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handleLogin("google")}
        >
          Sign in with Google
        </Button>
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => handleLogin("github")}
        >
          Sign in with GitHub
        </Button>
      </CardContent>
    </Card>
  )
}