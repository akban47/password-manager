import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { AuthOptions } from 'next-auth'
  const RATE_LIMIT = 50
export async function POST(req: Request) {

  const session = await getServerSession()
  if (!session?.user?.email) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { encryptedData } = await req.json()
  console.log("recieved data:", !!encryptedData)
  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { vault: true },
    })
    console.log("Found for update: " ,user)

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    if (user.vault) {
      const updated = await prisma.vault.update({
        where: { userId: user.id },
        data: { encryptedData },
      })
      console.log("Updated vault for user:", !!updated)
    } else {
      const created = await prisma.vault.create({
        data: {
          userId: user.id,
          encryptedData,
        },
      })
      console.log("Created vault for user:", !!created)
    }

    return new NextResponse('Success', { status: 200 })
  } catch (error) {
    console.error('Failed to update vault:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
export async function GET() {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { vault: true },
      })
      console.log("Found: " ,user)
  
      if (!user) {
        return new NextResponse('User not found', { status: 404 })
      }
  
      return NextResponse.json({ 
        encryptedData: user.vault?.encryptedData || '' 
      })
    } catch (error) {
      console.error('Failed to fetch vault:', error)
      return new NextResponse('Internal Server Error', { status: 500 })
    }
  }