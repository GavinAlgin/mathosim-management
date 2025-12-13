'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { FileVolume, Loader2, PlusIcon } from "lucide-react";
import { EmployeeForm } from "./employee-form";
import { SideDrawer } from "./components/SideDrawer";
import { DataTable } from "./data-table";
import { Employee } from "./types";
import { Separator } from "@radix-ui/react-separator";

export default function EmployeesPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);

  /** Check logged in user sessions */
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.replace("/");
        return;
      }

      setCheckingAuth(false);
    };

    checkSession();
  }, [router]);

  /** Fetch all the users from the database */
  const fetchEmployees = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setEmployees(
        data.map((e) => ({
          id: e.id,
          name: e.employee_name,
          number: e.cell_number,
          position: e.position,
          arrangement: e.arrangement,
          status: "success",
          startDate: e.date_started,
          items: [],
        }))
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);



  /** ⏳ Block render until auth check completes */
  if (checkingAuth) {
    return (    
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
    </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col items-center md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Employee Management</h2>
          <p className="text-[16px] text-gray-500">
            Insert, View and manage employees with easy search, filter, and bulk action options.
          </p>
        </div>

        <div className="flex flex-row xs:flex-row gap-2">
          <Button className="border bg-transparent hover:bg-[#f7f7f7] text-black cursor-pointer">
            <FileVolume />
            Export
          </Button>

          <Button className="cursor-pointer" onClick={() => setOpen(true)}>
            <PlusIcon />
            Add Employee
          </Button>
        </div>
      </div>

      <Separator className="mt-4 border" />

      {/* Your DataTable stays here */}
      <DataTable data={employees} />

      <SideDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Add New Employee">
        <EmployeeForm onSuccess={() => setOpen(false)} />
      </SideDrawer>
    </div>
  );
}
