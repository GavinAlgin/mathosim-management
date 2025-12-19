// types.ts
export type StudentStatus = "active" | "inactive";
export type SetaType = "fpm-seta" | "wr-seta";

export interface Student {
  id: string;
  name: string;          // maps to studentName in DB
  number: string;        // maps to studentNumber in DB
  position: string;      // optional, or map from course maybe
  arrangement: string;   // optional, can be empty string if not used
  status: StudentStatus;
  startDate: string;
  setaType: SetaType;
}
