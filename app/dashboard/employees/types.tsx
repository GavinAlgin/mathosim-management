export type Employee = {
  id: string;
  name: string;
  number: string;
  position: string;
  arrangement: "full-time" | "part-time" | "contract" | "internship";
  status: "pending" | "processing" | "success" | "failed";
  startDate: string;
};


// // components/mock-data.ts
// export type Employee = {
//   id: string
//   name: string
//   number: string
//   position: string
//   arrangement: "full-time" | "part-time" | "contract"
//   status: "pending" | "processing" | "success" | "failed"
//   startDate: string
// }

// export const employees: Employee[] = [
//   {
//     id: "1",
//     name: "Alice Johnson",
//     number: "+1 (555) 123-4567",
//     position: "Software Engineer",
//     arrangement: "full-time",
//     status: "success",
//     startDate: "2023-01-15",
//   },
//   {
//     id: "2",
//     name: "Bob Smith",
//     number: "+1 (555) 987-6543",
//     position: "Product Manager",
//     arrangement: "part-time",
//     status: "pending",
//     startDate: "2022-09-20",
//   },
//   {
//     id: "3",
//     name: "Charlie Kim",
//     number: "+1 (555) 555-2222",
//     position: "UX Designer",
//     arrangement: "contract",
//     status: "processing",
//     startDate: "2023-03-10",
//   },
//   {
//     id: "4",
//     name: "Diana Adams",
//     number: "+1 (555) 999-8888",
//     position: "QA Analyst",
//     arrangement: "full-time",
//     status: "failed",
//     startDate: "2024-06-01",
//   },
// ]
