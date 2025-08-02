import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types'
import { mockUsers } from '@/lib/mock-data'

interface UserStore {
  users: User[]
  updateUser: (userId: string, updates: Partial<User>) => void
  deleteUser: (userId: string) => void
  addUser: (user: User) => void
  getUserById: (userId: string) => User | undefined
  toggleUserStatus: (userId: string) => void
  resetUsers: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      users: mockUsers,

      updateUser: (userId: string, updates: Partial<User>) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId
              ? { ...user, ...updates, updatedAt: new Date() }
              : user
          ),
        })),

      deleteUser: (userId: string) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== userId),
        })),

      addUser: (user: User) =>
        set((state) => ({
          users: [...state.users, user],
        })),

      getUserById: (userId: string) => {
        return get().users.find((user) => user.id === userId)
      },

      toggleUserStatus: (userId: string) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === userId
              ? { ...user, isActive: !user.isActive, updatedAt: new Date() }
              : user
          ),
        })),

      resetUsers: () =>
        set({ users: mockUsers }),
    }),
    {
      name: 'timetidy-users',
    }
  )
) 