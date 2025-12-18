export type EmployeeItem = {
  id: string;
  label: string;
  value: string;
};

export type Employee = {
  id: string;
  name: string;
  number: string;
  position: string;
  arrangement: "full-time" | "part-time" | "contract" | "internship";
  status: "pending" | "processing" | "success" | "failed";
  startDate: string;
  items: EmployeeItem[];
};
