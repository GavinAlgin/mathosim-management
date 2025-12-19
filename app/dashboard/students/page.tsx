'use client'

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { FileVolume } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudentPanel from './StudentPanel';
import { columns } from './columns';
import { DataTable } from './data-table';
import { supabase } from '@/lib/supabaseClient';
import { Student } from './types';

const StudentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState<'fpm' | 'seta'>('fpm');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [fpmStudents, setFpmStudents] = useState<Student[]>([]);
  const [setaStudents, setSetaStudents] = useState<Student[]>([]);

  // Fetch students
  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching students:', error.message);
      return;
    }

    // Map DB fields to table-compatible fields
    const mapped: Student[] = (data || []).map((s) => ({
      id: s.id,
      name: s.studentName,
      number: s.studentNumber,
      position: s.course || '',
      arrangement: '',
      status: s.status,
      startDate: s.startDate,
      setaType: s.setaType,
    }));

    setFpmStudents(mapped.filter((s) => s.setaType === 'fpm-seta'));
    setSetaStudents(mapped.filter((s) => s.setaType === 'wr-seta'));
  };

  useEffect(() => {
    fetchStudents();
  }, [refreshKey]);

  const filterStudents = (students: Student[]) =>
    students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.number.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredFpm = filterStudents(fpmStudents);
  const filteredSeta = filterStudents(setaStudents);

  // Delete student
  const handleDeleteStudent = async () => {
    if (!deleteStudent) return;
    const { error } = await supabase.from('students').delete().eq('id', deleteStudent.id);
    if (error) {
      console.error('Error deleting student:', error.message);
      return;
    }
    setDeleteStudent(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto py-5">
      {/* Header */}
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

      {/* Tabs */}
      <Tabs defaultValue="fpm" value={tab} onValueChange={(value) => setTab(value as 'fpm' | 'seta')}>
        <TabsList className="mb-4">
          <TabsTrigger value="fpm">FPM & SETA</TabsTrigger>
          <TabsTrigger value="seta">WR & SETA</TabsTrigger>
        </TabsList>

        <TabsContent value="fpm">
          <DataTable columns={columns} key={refreshKey} data={filteredFpm} />
        </TabsContent>

        <TabsContent value="seta">
          <DataTable columns={columns} key={refreshKey} data={filteredSeta} />
        </TabsContent>
      </Tabs>

      {/* Student Panel */}
      <StudentPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        studentCount={(tab === 'fpm' ? fpmStudents.length : setaStudents.length) + 1}
      />

      {/* Delete Confirmation */}
      {deleteStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p>
              Are you sure you want to delete <strong>{deleteStudent.name}</strong>?
            </p>
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
  );
};

export default StudentsPage;
