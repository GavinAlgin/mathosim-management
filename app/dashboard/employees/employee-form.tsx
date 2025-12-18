'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

interface EmployeeFormProps {
  onSuccess: () => void;
}

type FormState = {
  employee_name: string;
  cell_number: string;
  position: string;
  arrangement: string;
  date_started: string;
  docs: FileList | null;
};

type TextFieldKey = keyof Pick<
  FormState,
  "employee_name" | "cell_number" | "position"
>;

const textFields: Array<{
  key: TextFieldKey;
  label: string;
  type: string;
}> = [
  { key: "employee_name", label: "Employee Name", type: "text" },
  { key: "cell_number", label: "Cell Number", type: "tel" },
  { key: "position", label: "Position", type: "text" },
];

export function EmployeeForm({ onSuccess }: EmployeeFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    employee_name: "",
    cell_number: "",
    position: "",
    arrangement: "",
    date_started: "",
    docs: null,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});

  const validate = () => {
    const e: Partial<Record<keyof FormState, string>> = {};

    if (!form.employee_name.trim()) e.employee_name = "Required";
    if (!form.cell_number.trim()) e.cell_number = "Required";
    if (!form.position.trim()) e.position = "Required";
    if (!form.arrangement) e.arrangement = "Required";
    if (!form.date_started) e.date_started = "Required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix form errors");
      return;
    }

    setLoading(true);

    try {
      /** Upload documents (optional) */
      const docs_paths: string[] = [];

      if (form.docs?.length) {
        for (const file of Array.from(form.docs)) {
          const path = `employees/${crypto.randomUUID()}-${file.name}`;
          const { error } = await supabase
            .storage
            .from("employee-docs")
            .upload(path, file);

          if (error) throw error;
          docs_paths.push(path);
        }
      }

      /** Insert employee */
      const { error } = await supabase
        .from("employees")
        .insert({
          employee_name: form.employee_name,
          cell_number: form.cell_number,
          position: form.position,
          arrangement: form.arrangement,
          date_started: form.date_started,
          docs_paths,
        });

      if (error) throw error;

      toast.success("Employee added");
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
      {textFields.map(({ key, label, type }) => (
        <div key={key}>
          <label className="block text-sm font-medium">
            {label} <span className="text-red-500">*</span>
          </label>

          <input
            type={type}
            value={form[key]}
            onChange={(e) =>
              setForm({
                ...form,
                [key]: e.target.value,
              })
            }
            className={`mt-1 w-full rounded border px-3 py-2 ${
              errors[key] ? "border-red-500" : "border-gray-300"
            }`}
          />

          {errors[key] && (
            <p className="text-sm text-red-600">{errors[key]}</p>
          )}
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium">
          Arrangement <span className="text-red-500">*</span>
        </label>
        <select
          value={form.arrangement}
          onChange={(e) =>
            setForm({ ...form, arrangement: e.target.value })
          }
          className="mt-1 w-full rounded border px-3 py-2"
        >
          <option value="" disabled>
            Select
          </option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
        {errors.arrangement && (
          <p className="text-sm text-red-600">{errors.arrangement}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">
          Date Started <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          value={form.date_started}
          onChange={(e) =>
            setForm({ ...form, date_started: e.target.value })
          }
          className="mt-1 w-full rounded border px-3 py-2"
        />
        {errors.date_started && (
          <p className="text-sm text-red-600">{errors.date_started}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">Documents</label>
        <input
          type="file"
          multiple
          onChange={(e) =>
            setForm({ ...form, docs: e.target.files })
          }
        />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="animate-spin" /> : "Save Employee"}
        </Button>
      </div>
    </form>
  );
}



// 'use client';

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import { supabase } from "@/lib/supabaseClient";

// interface EmployeeFormProps {
//   onSuccess: () => void;
// }

// type FormState = {
//   employee_name: string;
//   cell_number: string;
//   position: string;
//   arrangement: string;
//   date_started: string;
//   docs: FileList | null;
// };

// export function EmployeeForm({ onSuccess }: EmployeeFormProps) {
//   const [loading, setLoading] = useState(false);
//   const [form, setForm] = useState<FormState>({
//     employee_name: "",
//     cell_number: "",
//     position: "",
//     arrangement: "",
//     date_started: "",
//     docs: null,
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const validate = () => {
//     const e: Record<string, string> = {};

//     if (!form.employee_name.trim()) e.employee_name = "Required";
//     if (!form.cell_number.trim()) e.cell_number = "Required";
//     if (!form.position.trim()) e.position = "Required";
//     if (!form.arrangement) e.arrangement = "Required";
//     if (!form.date_started) e.date_started = "Required";

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) {
//       toast.error("Please fix form errors");
//       return;
//     }

//     setLoading(true);

//     try {
//       /** Upload documents (optional) */
//       const docs_paths: string[] = [];

//       if (form.docs?.length) {
//         for (const file of Array.from(form.docs)) {
//           const path = `employees/${crypto.randomUUID()}-${file.name}`;
//           const { error } = await supabase
//             .storage
//             .from("employee-docs")
//             .upload(path, file);

//           if (error) throw error;
//           docs_paths.push(path);
//         }
//       }

//       /** SAFE INSERT — matches your schema exactly */
//       const { error } = await supabase
//         .from("employees")
//         .insert({
//           employee_name: form.employee_name,
//           cell_number: form.cell_number,
//           position: form.position,
//           arrangement: form.arrangement,
//           date_started: form.date_started,
//           docs_paths,
//         });

//       if (error) throw error;

//       toast.success("Employee added");
//       onSuccess();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to save employee");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-6 space-y-5" noValidate>
//       {[
//         ["employee_name", "Employee Name", "text"],
//         ["cell_number", "Cell Number", "tel"],
//         ["position", "Position", "text"],
//       ].map(([key, label, type]) => (
//         <div key={key}>
//           <label className="block text-sm font-medium">
//             {label} <span className="text-red-500">*</span>
//           </label>
//           <input
//             type={type}
//             value={(form as any)[key]}
//             onChange={(e) =>
//               setForm({ ...form, [key]: e.target.value })
//             }
//             className={`mt-1 w-full rounded border px-3 py-2 ${
//               errors[key] ? "border-red-500" : "border-gray-300"
//             }`}
//           />
//           {errors[key] && (
//             <p className="text-sm text-red-600">{errors[key]}</p>
//           )}
//         </div>
//       ))}

//       <div>
//         <label className="block text-sm font-medium">
//           Arrangement <span className="text-red-500">*</span>
//         </label>
//         <select
//           value={form.arrangement}
//           onChange={(e) =>
//             setForm({ ...form, arrangement: e.target.value })
//           }
//           className="mt-1 w-full rounded border px-3 py-2"
//         >
//           <option value="" disabled>Select</option>
//           <option value="full-time">Full-time</option>
//           <option value="part-time">Part-time</option>
//           <option value="contract">Contract</option>
//           <option value="internship">Internship</option>
//         </select>
//         {errors.arrangement && (
//           <p className="text-sm text-red-600">{errors.arrangement}</p>
//         )}
//       </div>

//       <div>
//         <label className="block text-sm font-medium">
//           Date Started <span className="text-red-500">*</span>
//         </label>
//         <input
//           type="date"
//           value={form.date_started}
//           onChange={(e) =>
//             setForm({ ...form, date_started: e.target.value })
//           }
//           className="mt-1 w-full rounded border px-3 py-2"
//         />
//         {errors.date_started && (
//           <p className="text-sm text-red-600">{errors.date_started}</p>
//         )}
//       </div>

//       <div>
//         <label className="block text-sm font-medium">Documents</label>
//         <input
//           type="file"
//           multiple
//           onChange={(e) =>
//             setForm({ ...form, docs: e.target.files })
//           }
//         />
//       </div>

//       <div className="flex justify-end gap-2 pt-4 border-t">
//         <Button type="submit" disabled={loading}>
//           {loading ? <Loader2 className="animate-spin" /> : "Save Employee"}
//         </Button>
//       </div>
//     </form>
//   );
// }
