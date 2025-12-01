// app/admin/dashboard/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/lib/UserStore'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, role } = useUserStore()

  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else if (role !== 'admin') {
      router.push('/user/dashboard') // or a 403 page
    }
  }, [user, role])

  return (
    <div>
      <h1 className="text-xl">Admin Dashboard</h1>
    </div>
  )
}
