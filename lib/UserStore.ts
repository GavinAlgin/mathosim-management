// import { create } from 'zustand';
// interface State { user: User|null; role: 'admin'|'user'|null; set(data: {user:User|null, role: 'admin'|'user'|null}): void; }
// export const useUserStore = create<State>((set)=>({
//   user: null, role: null,
//   set: (data)=> set(data),
// }));
// lib/UserStore.ts
import { create } from 'zustand'

// Example User type — adjust fields to your app
interface User {
  id: string
  name: string
  email: string
}

interface State {
  user: User | null
  role: 'admin' | 'user' | null
  set(data: { user: User | null; role: 'admin' | 'user' | null }): void
}

export const useUserStore = create<State>((set) => ({
  user: null,
  role: null,
  set: (data) => set(data),
}))
