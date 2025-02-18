'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Eye, EyeOff, Pencil, Trash2, Copy } from 'lucide-react'
import CryptoJS from 'crypto-js'
import { PasswordEntry } from '@/types'
import { AddPasswordDialog } from '@/components/add-password-dialog'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { copyToClipboard } from '@/lib/utils'
const updateVault = async (encryptedData: string) => {
  try {
    await fetch('/api/vault', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ encryptedData }),
    })
  } catch (error) {
    console.error('Failed to update vault:', error)
  }
}
export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [passwords, setPasswords] = useState<PasswordEntry[]>([])
  const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchVault = async () => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (session?.user?.email) {
      try {
        setLoading(true)  
        const response = await fetch('/api/vault')
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error('Failed to fetch vault')
        }

        const data = await response.json()
        
        if (data.encryptedData) {
          try {
            const bytes = CryptoJS.AES.decrypt(data.encryptedData, session.user.email)
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8).trim()
            if(!decryptedData) {
              setPasswords([])
            } else {
              setPasswords(JSON.parse(decryptedData))
            }
          } catch (decryptError) {
            console.error('Failed to decrypt vault:', decryptError)
            setPasswords([])
          }
        } else {
          setPasswords([])
        }
      } catch (err) {
        console.error('Failed to fetch vault:', err)
        setPasswords([])
      } finally {
        setLoading(false)
      }
    }
  }

  fetchVault()
}, [session, status, router])

  const updatePassword = async (id: number, updates: Partial<PasswordEntry>) => {
    const newPasswords = passwords.map(p => 
      p.id === id ? { ...p, ...updates } : p
    )
    setPasswords(newPasswords)
    const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(newPasswords),
        session?.user?.email || ''
      ).toString()
      await updateVault(encrypted)
  }

  const handleDelete = async (id: number) => {
    const newPasswords = passwords.filter(p => p.id !== id)
    setPasswords(newPasswords)
    const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(newPasswords),
        session?.user?.email || ''
      ).toString()
      await updateVault(encrypted)
  }

  const handleAddPassword = async (entry: Omit<PasswordEntry, 'id'>) => {
    const newPassword = {
      ...entry,
      id: Date.now()
    }
    const newPasswords = [...passwords, newPassword]
    setPasswords(newPasswords)
    const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(newPasswords),
        session?.user?.email || ''
      ).toString()
      await updateVault(encrypted)
  }

  if (loading) {
    return (
      <main className="container mx-auto p-4">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">PassVault Dashboard</h1>
        <AddPasswordDialog onAdd={handleAddPassword} />
      </div>

      <div className="grid gap-4">
        {passwords.map((pass) => (
          <PasswordCard
            key={pass.id}
            password={pass}
            onUpdate={updatePassword}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </main>
  )
}

function getFaviconUrl(site: string) {
  const domain = site.toLowerCase().replace(/https?:\/\//, '').split('/')[0]
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
}

interface PasswordCardProps {
  password: PasswordEntry;
  onUpdate: (id: number, updates: Partial<PasswordEntry>) => void;
  onDelete: (id: number) => void;
}

function PasswordCard({ password, onUpdate, onDelete }: PasswordCardProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [site, setSite] = useState(password.site)
  const [username, setUsername] = useState(password.username)
  const [pass, setPass] = useState(password.password)
  const [copiedUsername, setCopiedUsername] = useState(false)
  const [copiedPassword, setCopiedPassword] = useState(false)

  const handleSave = () => {
    onUpdate(password.id, {
      site,
      username,
      password: pass,
    })
    setIsEditing(false)
  }
  const handleCopy = async (text: string, type: 'username' | 'password') => {
    await navigator.clipboard.writeText(text)
    if (type === 'username') {
      setCopiedUsername(true)
      setTimeout(() => setCopiedUsername(false), 2000)
    } else {
      setCopiedPassword(true)
      setTimeout(() => setCopiedPassword(false), 2000)
    }
  }

  if (isEditing) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex gap-4 items-center">
            <img
              src={getFaviconUrl(site)}
              alt="Site icon"
              className="w-8 h-8"
            />
            <Input
              placeholder="Site"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="w-full"
            />
          </div>
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full"
          />
          <div className="flex gap-2">
            <Input
              type={showPassword ? "text" : "password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="flex-1"
            />
            <Button variant="ghost" size="icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <img
            src={getFaviconUrl(password.site)}
            alt="Site icon"
            className="w-8 h-8"
          />
<div className="flex-1">
  <div className="flex items-center gap-2">
    <h3 className="font-medium">{password.site}</h3>
  </div>
  <div className="flex items-center gap-2">
    <p className="text-sm text-gray-500">{password.username}</p>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => copyToClipboard(password.username)}
    >
      <Copy className="h-4 w-4" />
    </Button>
  </div>
  <div className="flex items-center mt-2">
    <Input
      type={showPassword ? "text" : "password"}
      value={password.password}
      className="mr-2"
      readOnly
    />
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => copyToClipboard(password.password)}
    >
      <Copy className="h-4 w-4" />
    </Button>
  </div>
</div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Password</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the password for {password.site}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(password.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </Card>
  )
}