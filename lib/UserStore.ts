import { create } from 'zustand';
interface State { user: User|null; role: 'admin'|'user'|null; set(data: {user:User|null, role: 'admin'|'user'|null}): void; }
export const useUserStore = create<State>((set)=>({
  user: null, role: null,
  set: (data)=> set(data),
}));
