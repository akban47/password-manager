'use client'

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import { useEffect } from "react"

export default function SettingsPage() {
  const { setTheme, theme } = useTheme()
  const [passwordLength, setPasswordLength] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('passwordLength') || '16')
    }
    return 16
  })
  const [requireSpecialChars, setRequireSpecialChars] = useState(true)
  const [requireNumbers, setRequireNumbers] = useState(true)
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(3)
  
  const handleExportData = () => {
    const encryptedPasswords = localStorage.getItem('passwords')
    if (!encryptedPasswords) {
      alert('No passwords to export.')
      return
    }
    const blob = new Blob([encryptedPasswords], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `passwords-${new Date().toISOString()}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
  }
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')
    if (!confirmed) return

    try {
      const res = await fetch('/api/account/delete', {
        method: 'DELETE'
      })
      if (res.ok) {
        alert('Your account has been deleted.')
        signOut({ callbackUrl: '/login' })
      } else {
        const errorData = await res.json()
        alert(`Failed to delete account: ${errorData.error}`)
      }
    } catch (err) {
      console.error(err)
      alert('Error deleting account.')
    }
  }
  useEffect(() => {
    localStorage.setItem('passwordLength', passwordLength.toString())
    localStorage.setItem('requireSpecialChars', requireSpecialChars.toString())
    localStorage.setItem('requireNumbers', requireNumbers.toString())
  }, [passwordLength, requireSpecialChars, requireNumbers])

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">Dark Mode</Label>
            <Switch
              id="theme"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Password Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Default Password Length ({passwordLength})</Label>
            <Slider
              value={[passwordLength]}
              onValueChange={([value]) => setPasswordLength(value)}
              min={12}
              max={32}
              step={1}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="special">Require Special Characters</Label>
            <Switch
              id="special"
              checked={requireSpecialChars}
              onCheckedChange={setRequireSpecialChars}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="numbers">Require Numbers</Label>
            <Switch
              id="numbers"
              checked={requireNumbers}
              onCheckedChange={setRequireNumbers}
            />
          </div>
          <div className="space-y-2">
            <Label>Maximum Login Attempts ({maxLoginAttempts})</Label>
            <Slider
              value={[maxLoginAttempts]}
              onValueChange={([value]) => setMaxLoginAttempts(value)}
              min={1}
              max={5}
              step={1}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Auto-logout Timer (minutes)</Label>
            <Slider
              defaultValue={[30]}
              min={5}
              max={60}
              step={5}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            onClick={handleExportData}
          >
            Export Passwords
          </Button>
          <Button 
            variant="destructive"
            className="ml-4"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}