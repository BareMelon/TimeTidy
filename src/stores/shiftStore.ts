import { create } from 'zustand'
import { Shift } from '@/types'
import { mockShifts } from '@/lib/mock-data'

interface ShiftStore {
  shifts: Shift[]
  updateShift: (shiftId: string, updates: Partial<Shift>) => void
  deleteShift: (shiftId: string) => void
  addShift: (shift: Shift) => void
  addShifts: (shifts: Shift[]) => void
  getShiftById: (shiftId: string) => Shift | undefined
  getShiftsForUser: (userId: string) => Shift[]
  resetShifts: () => void
}

export const useShiftStore = create<ShiftStore>((set, get) => ({
  shifts: mockShifts,

  updateShift: (shiftId: string, updates: Partial<Shift>) =>
    set((state) => ({
      shifts: state.shifts.map((shift) =>
        shift.id === shiftId
          ? { ...shift, ...updates, updatedAt: new Date() }
          : shift
      ),
    })),

  deleteShift: (shiftId: string) =>
    set((state) => ({
      shifts: state.shifts.filter((shift) => shift.id !== shiftId),
    })),

  addShift: (shift: Shift) =>
    set((state) => ({
      shifts: [...state.shifts, shift],
    })),

  addShifts: (newShifts: Shift[]) =>
    set((state) => ({
      shifts: [...state.shifts, ...newShifts],
    })),

  getShiftById: (shiftId: string) => {
    return get().shifts.find((shift) => shift.id === shiftId)
  },

  getShiftsForUser: (userId: string) => {
    return get().shifts.filter((shift) => shift.userId === userId)
  },

  resetShifts: () =>
    set({ shifts: mockShifts }),
})) 