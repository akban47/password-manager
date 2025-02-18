"use client"

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, RefreshCw, Copy, Check, EyeOff, Eye } from "lucide-react"
import { PasswordEntry } from '@/types'
import { PasswordStrength } from './password-strength'

interface PasswordConfig {
  length: number
  includeNumbers: boolean
  includeSymbols: boolean
  includeLowercase: boolean
  includeUppercase: boolean
}

interface Props {
  onAdd: (entry: Omit<PasswordEntry, 'id'>) => void
}

export function AddPasswordDialog({ onAdd }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [site, setSite] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [copied, setCopied] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [config, setConfig] = useState<PasswordConfig>({
    length: 16,
    includeNumbers: true,
    includeSymbols: true,
    includeLowercase: true,
    includeUppercase: true
  })
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      setConfig({
        length: parseInt(localStorage.getItem('passwordLength') || '16'),
        includeNumbers: localStorage.getItem('requireNumbers') !== 'false',
        includeSymbols: localStorage.getItem('requireSpecialChars') !== 'false',
        includeLowercase: localStorage.getItem('includeLowercase')
          ? localStorage.getItem('includeLowercase') === 'true'
          : true,
        includeUppercase: localStorage.getItem('includeUppercase')
          ? localStorage.getItem('includeUppercase') === 'true'
          : true,
      })
    }
  }, [isOpen])

  const generatePassword = () => {
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    let chars = ''
    if (config.includeLowercase) chars += lowercase
    if (config.includeUppercase) chars += uppercase
    if (config.includeNumbers) chars += numbers
    if (config.includeSymbols) chars += symbols
    if (chars === '') chars = lowercase 
    let newPassword = ''
    for (let i = 0; i < config.length; i++) {
      newPassword += chars[Math.floor(Math.random() * chars.length)]
    }
    setPassword(newPassword)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = () => {
    onAdd({
      site,
      username,
      password
    })
    setIsOpen(false)
    setSite('')
    setUsername('')
    setPassword('')
  }

  const getFaviconUrl = (site: string) => {
    const domain = site.toLowerCase().replace(/https?:\/\//, '').split('/')[0]
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          Add Password <Plus className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-4 items-center">
            <img 
              src={site ? getFaviconUrl(site) : '/placeholder-icon.png'} 
              alt="Site icon" 
              className="w-8 h-8"
            />
            <Input
              placeholder="Site or URL"
              value={site}
              onChange={(e) => setSite(e.target.value)}
            />
          </div>
          <Input
            placeholder="Username or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showNewPassword ? "text" : "password"}
                className="font-mono flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={generatePassword}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <PasswordStrength password={password} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}