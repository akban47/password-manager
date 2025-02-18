'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"

export function Navigation() {
  const { data: session } = useSession()

  return (
    <nav className="flex justify-between items-center w-full">
      <Link 
        href={session ? "/dashboard" : "/"} 
        className="text-xl font-bold hover:text-primary"
      >
      </Link>
      
      <div className="flex items-center gap-4">
        {!session ? (
          <Link 
            href="/login"
            className="text-sm font-medium hover:text-primary"
          >
            Login
          </Link>
        ) : (
          <>
            <Link 
              href="/dashboard"
              className="text-sm font-medium hover:text-primary"
            >
              Dashboard
            </Link>
            <Link 
              href="/settings"
              className="text-sm font-medium hover:text-primary"
            >
              Settings
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                  <User className="h-5 w-5 mr-2" />
                  <span>{session.user?.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/login' })}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </nav>
  )
}