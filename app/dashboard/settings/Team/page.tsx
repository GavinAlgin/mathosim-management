'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
// import {
//   Button,
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   Input,
//   Label,
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogFooter
// } from '@/components/ui'
import { Loader2, Trash, UserPlus, Shield, Table } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialogHeader, AlertDialogFooter } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle } from '@radix-ui/react-alert-dialog'
import { Label } from '@radix-ui/react-dropdown-menu'
import { SelectTrigger, SelectContent, SelectItem } from '@radix-ui/react-select'
import { Select } from 'react-day-picker'
import { Button } from '@/components/ui/button'

type Member = {
  id: string
  email: string
  role: 'admin' | 'manager' | 'member'
}

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [form, setForm] = useState({ email: '', role: 'member' })

  // Fetch team members
  const fetchMembers = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('team_members').select('*')
    if (error) toast.error('Error loading members')
    else setMembers(data)
    setLoading(false)
  }

  // Invite member
  const inviteMember = async () => {
    const { email, role } = form
    const { error } = await supabase.from('team_members').insert([{ email, role }])
    if (error) toast.error('Error inviting member')
    else {
      toast.success('Member invited')
      setForm({ email: '', role: 'member' })
      setInviteOpen(false)
      fetchMembers()
    }
  }

  // Remove member
  const removeMember = async (id: string) => {
    const { error } = await supabase.from('team_members').delete().eq('id', id)
    if (error) toast.error('Error removing member')
    else {
      toast.success('Member removed')
      fetchMembers()
    }
  }

  // Change role
  const updateRole = async (id: string, role: string) => {
    const { error } = await supabase.from('team_members').update({ role }).eq('id', id)
    if (error) toast.error('Error updating role')
    else {
      toast.success('Role updated')
      fetchMembers()
    }
  }

  // Realtime updates
  useEffect(() => {
    fetchMembers()
    const channel = supabase
      .channel('team-members')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, fetchMembers)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Team Members</h1>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button><UserPlus className="mr-2 h-4 w-4" /> Invite</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  placeholder="someone@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger>{form.role}</SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={inviteMember} disabled={!form.email}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Invite
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </TableCell>
              </TableRow>
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-6">
                  No team members yet.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Select value={member.role} onValueChange={(v) => updateRole(member.id, v)}>
                      <SelectTrigger className="w-[120px] capitalize">{member.role}</SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove Member</AlertDialogTitle>
                          <p>Are you sure you want to remove this member?</p>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button variant="destructive" onClick={() => removeMember(member.id)}>Remove</Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
