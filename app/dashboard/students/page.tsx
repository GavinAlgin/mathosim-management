'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FileVolume } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTable } from './data-table'
import { columns } from './columns'
import { studentDataFPM, studentDataSETA, Student } from './mock-data'
import StudentPanel from './StudentPanel' // ✅ import your panel here

const StudentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [tab, setTab] = useState('fpm')
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // To trigger table refresh


  const [fpmStudents, setFpmStudents] = useState<Student[]>(studentDataFPM)
  const [setaStudents, setSetaStudents] = useState<Student[]>(studentDataSETA)

  const currentData = tab === 'fpm' ? fpmStudents : setaStudents

  const filteredData = currentData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const dataWithActions = filteredData.map((student) => ({
    ...student,
    onEdit: (s: Student) => {
      setEditStudent(s);
      setIsPanelOpen(true);
    },
    onDelete: (s: Student) => {
      setDeleteStudent(s);
    },
  }));


  const handleAddStudent = (newStudent: Omit<Student, "id">) => {
    if (editStudent) {
      const updated = { ...editStudent, ...newStudent };
      if (tab === "fpm") {
        setFpmStudents((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
      } else {
        setSetaStudents((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
      }
    } else {
      const newEntry: Student = { ...newStudent, id: Date.now() };
      if (tab === "fpm") {
        setFpmStudents((prev) => [...prev, newEntry]);
      } else {
        setSetaStudents((prev) => [...prev, newEntry]);
      }
    }

    setEditStudent(null);
    setIsPanelOpen(false);
  };


  const handleDeleteStudent = () => {
    if (!deleteStudent) return;
    if (tab === "fpm") {
      setFpmStudents((prev) => prev.filter((s) => s.id !== deleteStudent.id));
    } else {
      setSetaStudents((prev) => prev.filter((s) => s.id !== deleteStudent.id));
    }
    setDeleteStudent(null);
  }


  return (
    <div className="container mx-auto py-5">
      <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Student Management</h2>
          <p className="text-[14px] text-gray-500">
            View and manage student records with easy search, filter, and bulk action options.
          </p>
        </div>

        <div className="flex flex-row gap-2">
          <Button className="border bg-transparent hover:bg-[#f7f7f7] text-black">
            <FileVolume className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsPanelOpen(true)}>Add Student</Button>
        </div>
      </div>

      <Separator className="my-4" />

      <Tabs defaultValue="fpm" value={tab} onValueChange={setTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="fpm">FPM & SETA</TabsTrigger>
          <TabsTrigger value="seta">WRSETA</TabsTrigger>
        </TabsList>

        <TabsContent value="fpm">
          <DataTable columns={columns} data={filteredData} data={dataWithActions} key={refreshKey} />
        </TabsContent>

        <TabsContent value="seta">
          <DataTable columns={columns} data={filteredData} data={dataWithActions} key={refreshKey} />
        </TabsContent>
      </Tabs>

      {/* ✅ Add the StudentPanel component here */}
      <StudentPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onSave={handleAddStudent}
        studentCount={(tab === 'fpm' ? fpmStudents.length : setaStudents.length) + 1}
      />
      {deleteStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete <strong>{deleteStudent.name}</strong>?</p>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteStudent(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteStudent}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default StudentsPage
