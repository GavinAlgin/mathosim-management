import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface StudentPanelProps {
  isOpen: boolean;
  onClose: () => void;
  studentCount: number;
}

type StudentStatus = "active" | "inactive";
type SetaType = "fpm-seta" | "wr-seta";

interface StudentForm {
  studentName: string;
  studentNumber: string;
  course: string;
  status: StudentStatus;
  startDate: string;
  setaType: SetaType;
  docsUpload: FileList | null;
}

type FormErrors = Partial<Record<keyof StudentForm, string>>;

const StudentPanel: React.FC<StudentPanelProps> = ({ isOpen, onClose, studentCount }) => {
  const [form, setForm] = useState<StudentForm>({
    studentName: "",
    studentNumber: "",
    course: "",
    status: "active",
    startDate: "",
    setaType: "fpm-seta",
    docsUpload: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Generate student number
  useEffect(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const count = String(studentCount || 1).padStart(3, "0");

    setForm(prev => ({
      ...prev,
      studentNumber: `STU${month}${year}${count}`,
    }));
  }, [studentCount]);

  // Validation
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.studentName.trim()) newErrors.studentName = "Student name is required.";
    if (!form.course.trim()) newErrors.course = "Course is required.";
    if (!form.startDate) newErrors.startDate = "Start date is required.";
    if (!form.setaType) newErrors.setaType = "SETA type is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle file uploads
  const handleUploadDocs = async (studentId: string) => {
    if (!form.docsUpload || form.docsUpload.length === 0) return;

    for (let i = 0; i < form.docsUpload.length; i++) {
      const file = form.docsUpload[i];
      const filePath = `students/${studentId}/${file.name}`;

      const { data, error } = await supabase.storage
        .from("student-docs")
        .upload(filePath, file);

      if (error) {
        console.error("File upload error:", error.message);
      } else {
        await supabase.from("student_documents").insert({
          student_id: studentId,
          file_url: data.path,
          file_name: file.name,
        });
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("User not authenticated");
      setLoading(false);
      return;
    }

    const { data: student, error } = await supabase
      .from("students")
      .insert({
        student_name: form.studentName,
        student_number: form.studentNumber,
        course: form.course,
        status: form.status,
        start_date: form.startDate,
        seta_type: form.setaType,
        user_id: user.id,
      })
      .select()
      .single();

    if (error || !student) {
      console.error("Error inserting student:", error?.message);
      setLoading(false);
      return;
    }

    // Upload supporting documents
    await handleUploadDocs(student.id);

    // Reset form and close panel
    setForm({
      studentName: "",
      studentNumber: "",
      course: "",
      status: "active",
      startDate: "",
      setaType: "fpm-seta",
      docsUpload: null,
    });
    setErrors({});
    setLoading(false);
    onClose();
  };

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "file") {
      setForm(prev => ({ ...prev, [target.name]: target.files }));
    } else {
      setForm(prev => ({ ...prev, [target.name]: target.value }));
    }
  };


  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose} />}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Add New Student</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded">
            <IconX size={20} />
          </button>
        </div>

        <form className="p-6 space-y-6 overflow-y-auto h-[calc(100%-64px)]" onSubmit={handleSubmit} noValidate>
          {/* Student Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Student Name *</label>
            <input
              type="text"
              name="studentName"
              value={form.studentName}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                errors.studentName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="Jane Doe"
            />
            {errors.studentName && <p className="text-red-600 text-sm mt-1">{errors.studentName}</p>}
          </div>

          {/* Auto-generated Student Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Student Number</label>
            <input
              type="text"
              value={form.studentNumber}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 px-3 py-2 shadow-sm"
            />
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Course *</label>
            <input
              type="text"
              name="course"
              value={form.course}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                errors.course ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
              }`}
              placeholder="Business Management"
            />
            {errors.course && <p className="text-red-600 text-sm mt-1">{errors.course}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 border-gray-300"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                errors.startDate ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
              }`}
            />
            {errors.startDate && <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>}
          </div>

          {/* SETA Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">SETA Type *</label>
            <select
              name="setaType"
              value={form.setaType}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
                errors.setaType ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
              }`}
            >
              <option value="fpm-seta">FPM & SETA</option>
              <option value="wr-seta">WR & SETA</option>
            </select>
            {errors.setaType && <p className="text-red-600 text-sm mt-1">{errors.setaType}</p>}
          </div>

          {/* Upload Documents */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Upload Documents</label>
            <input
              type="file"
              name="docsUpload"
              multiple
              onChange={handleChange}
              className="mt-1 block w-full"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" className="mr-2" onClick={() => { setErrors({}); onClose(); }}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Student"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default StudentPanel;



// import React, { useEffect, useState } from "react";
// import { IconX } from "@tabler/icons-react"; // Adjust import to your icon lib
// import { Button } from "@/components/ui/button"; // Your custom Button component

// const StudentPanel = ({ isOpen, onClose, onSave, studentCount }) => {
//   const [form, setForm] = useState({
//     studentName: "",
//     studentNumber: "",
//     course: "",
//     status: "active",
//     startDate: "",
//     setaType: "fpm-seta",
//     docsUpload: null,
//   });

//   const [errors, setErrors] = useState({});

//   // Generate student number: STU + Month + Year + Count
//   useEffect(() => {
//     const now = new Date();
//     const month = String(now.getMonth() + 1).padStart(2, "0");
//     const year = now.getFullYear();
//     const count = String(studentCount || 1).padStart(3, "0");
//     setForm((prev) => ({
//       ...prev,
//       studentNumber: `STU${month}${year}${count}`,
//     }));
//   }, [studentCount]);

//   const validate = () => {
//     const newErrors = {};
//     if (!form.studentName.trim()) newErrors.studentName = "Student name is required.";
//     if (!form.course.trim()) newErrors.course = "Course is required.";
//     if (!form.startDate) newErrors.startDate = "Start date is required.";
//     if (!form.setaType) newErrors.setaType = "SETA type is required.";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!validate()) return;
//     onSave(form);
//     onClose();
//   };

//   return (
//     <>
//       {/* Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-40 z-40"
//           onClick={onClose}
//         />
//       )}

//       {/* Side Panel */}
//       <div
//         className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
//         ${isOpen ? "translate-x-0" : "translate-x-full"}
//       `}>
//         <div className="flex items-center justify-between p-4 border-b">
//           <h3 className="text-lg font-semibold">Add New Student</h3>
//           <button
//             onClick={onClose}
//             aria-label="Close panel"
//             className="p-2 hover:bg-gray-200 rounded">
//             <IconX size={20} />
//           </button>
//         </div>

//         <form
//           className="p-6 space-y-6 overflow-y-auto h-[calc(100%-64px)]"
//           onSubmit={handleSubmit}
//           noValidate
//         >
//           {/* Student Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Student Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={form.studentName}
//               onChange={(e) =>
//                 setForm({ ...form, studentName: e.target.value })
//               }
//               className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
//                 errors.studentName
//                   ? "border-red-500 focus:ring-red-500"
//                   : "border-gray-300 focus:ring-indigo-500"
//               }`}
//               placeholder="Jane Doe"
//             />
//             {errors.studentName && (
//               <p className="text-red-600 text-sm mt-1">{errors.studentName}</p>
//             )}
//           </div>

//           {/* Auto-generated Student Number */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Student Number
//             </label>
//             <input
//               type="text"
//               value={form.studentNumber}
//               readOnly
//               className="mt-1 block w-full rounded-md border-gray-200 bg-gray-100 px-3 py-2 shadow-sm"
//             />
//           </div>

//           {/* Course */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Course <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={form.course}
//               onChange={(e) =>
//                 setForm({ ...form, course: e.target.value })
//               }
//               className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
//                 errors.course
//                   ? "border-red-500 focus:ring-red-500"
//                   : "border-gray-300 focus:ring-indigo-500"
//               }`}
//               placeholder="Business Management"
//             />
//             {errors.course && (
//               <p className="text-red-600 text-sm mt-1">{errors.course}</p>
//             )}
//           </div>

//           {/* Status */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Status
//             </label>
//             <select
//               value={form.status}
//               onChange={(e) =>
//                 setForm({ ...form, status: e.target.value })
//               }
//               className="mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 border-gray-300"
//             >
//               <option value="active">Active</option>
//               <option value="inactive">Inactive</option>
//             </select>
//           </div>

//           {/* Start Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Start Date <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="date"
//               value={form.startDate}
//               onChange={(e) =>
//                 setForm({ ...form, startDate: e.target.value })
//               }
//               className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
//                 errors.startDate
//                   ? "border-red-500 focus:ring-red-500"
//                   : "border-gray-300 focus:ring-indigo-500"
//               }`}
//             />
//             {errors.startDate && (
//               <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>
//             )}
//           </div>

//           {/* SETA Type */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               SETA Type <span className="text-red-500">*</span>
//             </label>
//             <select
//               value={form.setaType}
//               onChange={(e) =>
//                 setForm({ ...form, setaType: e.target.value })
//               }
//               className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${
//                 errors.setaType
//                   ? "border-red-500 focus:ring-red-500"
//                   : "border-gray-300 focus:ring-indigo-500"
//               }`}
//             >
//               <option value="fpm-seta">FPM & SETA</option>
//               <option value="wr-seta">WR & SETA</option>
//             </select>
//             {errors.setaType && (
//               <p className="text-red-600 text-sm mt-1">{errors.setaType}</p>
//             )}
//           </div>

//           {/* Upload Documents */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Upload Documents
//             </label>
//             <input
//               type="file"
//               multiple
//               onChange={(e) =>
//                 setForm({ ...form, docsUpload: e.target.files })
//               }
//               className="mt-1 block w-full"
//             />
//           </div>

//           {/* Footer Buttons */}
//           <div className="flex justify-end pt-4 border-t">
//             <Button
//               variant="outline"
//               className="mr-2"
//               onClick={(e) => {
//                 e.preventDefault();
//                 setErrors({});
//                 onClose();
//               }}
//             >
//               Cancel
//             </Button>
//             <Button type="submit">Save Student</Button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// };

// export default StudentPanel;
