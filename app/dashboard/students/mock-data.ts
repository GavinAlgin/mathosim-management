export type Student = {
  id: number
  name: string
  number: string
  position: string
  arrangement: string
  status: string
  startDate: string
}

export const studentDataFPM: Student[] = [
  {
    id: 1,
    name: "Alice Johnson",
    number: "STU001",
    position: "Frontend Developer",
    arrangement: "remote",
    status: "Active",
    startDate: "2024-05-01",
  },
  {
    id: 2,
    name: "Bob Smith",
    number: "STU002",
    position: "Backend Developer",
    arrangement: "onsite",
    status: "Inactive",
    startDate: "2023-12-01",
  },
]

export const studentDataSETA: Student[] = [
  {
    id: 3,
    name: "Charlie Davis",
    number: "STU003",
    position: "Data Analyst",
    arrangement: "hybrid",
    status: "Active",
    startDate: "2024-07-01",
  },
  {
    id: 4,
    name: "Dana Lee",
    number: "STU004",
    position: "QA Engineer",
    arrangement: "remote",
    status: "Pending",
    startDate: "2024-08-15",
  },
]
