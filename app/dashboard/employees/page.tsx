'use client';

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { IconFileExport, IconPlus, IconX } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

export default function Employees() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("start_date", { ascending: false });

      if (error) {
        console.error("Error fetching employees:", error.message);
      } else {
        const formatted = data.map((emp: any): Employee => ({
          id: emp.id,
          name: emp.name,
          number: emp.number,
          position: emp.position,
          arrangement: emp.arrangement,
          status: emp.status || "pending",
          startDate: emp.start_date,
        }));
        setEmployeeData(formatted);
      }

      setLoading(false);
    };

    fetchEmployees();
  }, []);

  const [form, setForm] = useState({
    employeeName: "",
    cellNumber: "",
    position: "",
    arrangement: "",
    dateStarted: "",
    docsUpload: null as FileList | null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.employeeName.trim()) newErrors.employeeName = "Employee name is required";
    if (!form.cellNumber.trim()) newErrors.cellNumber = "Cell number is required";
    if (!form.position.trim()) newErrors.position = "Position is required";
    if (!form.arrangement) newErrors.arrangement = "Arrangement is required";
    if (!form.dateStarted) newErrors.dateStarted = "Date started is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validate()) {
      toast("Please fix the errors in the form.");
      return;
    }

    try {
      // Upload files if any
      let uploadedFiles: string[] = [];
      if (form.docsUpload && form.docsUpload.length > 0) {
        for (const file of Array.from(form.docsUpload)) {
          const filePath = `employee-docs/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from("employee-docs")
            .upload(filePath, file);

          if (uploadError) {
            console.error("Upload error:", uploadError);
            toast.error("Failed to upload document.");
            return;
          }

          uploadedFiles.push(filePath);
        }
      }

      const { error } = await supabase.from("employees").insert([
        {
          name: form.employeeName,
          phone: form.cellNumber,
          position: form.position,
          arrangement: form.arrangement,
          date_started: form.dateStarted,
          documents: uploadedFiles, // You can save paths or URLs here
        },
      ]);

      if (error) {
        console.error("Insert error:", error);
        toast.error("Error saving employee.");
        return;
      }

      toast.success("Employee added successfully!");
      setIsPanelOpen(false);
      setLoading(false);

      // Reset form
      setForm({
        employeeName: "",
        cellNumber: "",
        position: "",
        arrangement: "",
        dateStarted: "",
        docsUpload: null,
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="container mx-auto py-5 relative">
      <Toaster position="top-right" />

      <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Employee Management</h2>
          <p className="text-sm text-gray-500">
            View and manage employee records with easy search, filter, and bulk action options.
          </p>
        </div>

        <div className="flex flex-row gap-2">
          <Button variant="outline" className="text-black">
            <IconFileExport className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={() => setIsPanelOpen(true)}>
            <IconPlus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        </div>
      </div>

      <Separator className="mt-4" />

      <div className="py-10">
        <DataTable columns={columns} data={employeeData} loading={loading} />
      </div>

      {/* Side Panel Overlay */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsPanelOpen(false)}
        />
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
          ${isPanelOpen ? "translate-x-0" : "translate-x-full"}
        `}>
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Add New Employee</h3>
          <button
            onClick={() => setIsPanelOpen(false)}
            aria-label="Close panel"
            className="p-2 hover:bg-gray-200 rounded">
            <IconX size={20} />
          </button>
        </div>

        <form className="p-6 space-y-6 overflow-y-auto h-[calc(100%-64px)]" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700">
              Employee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="employeeName"
              name="employeeName"
              value={form.employeeName}
              onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                errors.employeeName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="John Doe"
            />
            {errors.employeeName && (
              <p className="text-red-600 text-sm mt-1">{errors.employeeName}</p>
            )}
          </div>

          <div>
            <label htmlFor="cellNumber" className="block text-sm font-medium text-gray-700">
              Cell Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="cellNumber"
              name="cellNumber"
              value={form.cellNumber}
              onChange={(e) => setForm({ ...form, cellNumber: e.target.value })}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                errors.cellNumber
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="+1234567890"
            />
            {errors.cellNumber && (
              <p className="text-red-600 text-sm mt-1">{errors.cellNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">
              Position <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                errors.position
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="Software Engineer"
            />
            {errors.position && (
              <p className="text-red-600 text-sm mt-1">{errors.position}</p>
            )}
          </div>

          <div>
            <label htmlFor="arrangement" className="block text-sm font-medium text-gray-700">
              Arrangement <span className="text-red-500">*</span>
            </label>
            <select
              id="arrangement"
              name="arrangement"
              value={form.arrangement}
              onChange={(e) => setForm({ ...form, arrangement: e.target.value })}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                errors.arrangement
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}>
              <option value="" disabled>
                Select arrangement
              </option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
            {errors.arrangement && (
              <p className="text-red-600 text-sm mt-1">{errors.arrangement}</p>
            )}
          </div>

          <div>
            <label htmlFor="dateStarted" className="block text-sm font-medium text-gray-700">
              Date Started <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dateStarted"
              name="dateStarted"
              value={form.dateStarted}
              onChange={(e) => setForm({ ...form, dateStarted: e.target.value })}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                errors.dateStarted
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-indigo-500"
              }`}
            />
            {errors.dateStarted && (
              <p className="text-red-600 text-sm mt-1">{errors.dateStarted}</p>
            )}
          </div>

          <div>
            <label htmlFor="docsUpload" className="block text-sm font-medium text-gray-700">
              Upload Documents
            </label>
            <input
              type="file"
              id="docsUpload"
              name="docsUpload"
              multiple
              onChange={(e) => setForm({ ...form, docsUpload: e.target.files })}
              className="mt-1 block w-full"
            />
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              variant="outline"
              className="mr-2"
              onClick={(e) => {
                e.preventDefault();
                setIsPanelOpen(false);
                setErrors({});
              }}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>{loading ? ( <Loader2 /> ) : ( "Save Employee" )}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
