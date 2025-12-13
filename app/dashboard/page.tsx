'use client'

import { useEffect, useState } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Loader2 } from 'lucide-react'

type Invoice = {
  id: string
  client: string
  status: 'Paid' | 'Pending' | 'Overdue'
  amount: number
}

export default function DashboardPage() {
  const user = useUser()
  const supabase = useSupabaseClient()

  const [studentsCount, setStudentsCount] = useState<number>(0)
  const [employeesCount, setEmployeesCount] = useState<number>(0)
  const [inventoryCount, setInventoryCount] = useState<number>(0)
  const [uploadsCount, setUploadsCount] = useState<number>(0)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchCounts = async () => {
      setLoading(true)
      const [{ count: studentCount }, { count: employeeCount }, { count: inventoryCount }, { count: uploadCount }] =
        await Promise.all([
          supabase.from('students').select('*', { count: 'exact', head: true }),
          supabase.from('employees').select('*', { count: 'exact', head: true }),
          supabase.from('inventory').select('*', { count: 'exact', head: true }),
          supabase.from('uploads').select('*', { count: 'exact', head: true })
        ])

      const { data: invoiceData, error } = await supabase
        .from('invoices')
        .select('id, client, status, amount')
        .order('created_at', { ascending: false })
        .limit(5)

      if (!error && invoiceData) {
        setInvoices(invoiceData as Invoice[])
      }

      setStudentsCount(studentCount || 0)
      setEmployeesCount(employeeCount || 0)
      setInventoryCount(inventoryCount || 0)
      setUploadsCount(uploadCount || 0)

      setLoading(false)
    }

    fetchCounts()
  }, [user, supabase])

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-gray-500"><Loader2 className="h-8 w-8 animate-spin text-gray-600" /></span>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Welcome, {user.user_metadata?.full_name || user.email}</h2>

      {/* Metrics Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Students" count={studentsCount} />
        <DashboardCard title="Employees" count={employeesCount} />
        <DashboardCard title="Inventory" count={inventoryCount} />
        <DashboardCard title="File Uploads" count={uploadsCount} />
      </div>

      {/* Invoices Table */}
      <div className="space-y-2">
        <h3 className="text-xl font-medium">Recent Invoices</h3>
        <Card className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${statusStyle(invoice.status)}`}
                      >
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">${invoice.amount}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No invoices found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}

function DashboardCard({ title, count }: { title: string; count: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{count}</div>
      </CardContent>
    </Card>
  )
}

function statusStyle(status: 'Paid' | 'Pending' | 'Overdue') {
  switch (status) {
    case 'Paid':
      return 'bg-green-100 text-green-700'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-700'
    case 'Overdue':
      return 'bg-red-100 text-red-700'
  }
}
