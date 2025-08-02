import { create } from 'zustand'
import { Shift } from '@/types'
import { getShifts, createShift, updateShift, deleteShift } from '@/lib/api'

interface ShiftStore {
  shifts: Shift[]
  isLoading: boolean
  error: string | null
  fetchShifts: () => Promise<void>
  addShift: (shift: Shift) => Promise<void>
  updateShift: (shiftId: string, updates: Partial<Shift>) => Promise<void>
  deleteShift: (shiftId: string) => Promise<void>
  getShiftById: (shiftId: string) => Shift | undefined
  getShiftsForUser: (userId: string) => Shift[]
  resetShifts: () => void
}

export const useShiftStore = create<ShiftStore>((set, get) => ({
  shifts: [],
  isLoading: false,
  error: null,

  fetchShifts: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await getShifts()
      if (response.success) {
        set({ shifts: response.data, isLoading: false })
      } else {
        set({ error: response.message || 'Failed to fetch shifts', isLoading: false })
      }
    } catch (error) {
      set({ error: 'Failed to fetch shifts', isLoading: false })
    }
  },

  addShift: async (shift: Shift) => {
    set({ isLoading: true, error: null })
    try {
      const response = await createShift({
        userId: shift.userId,
        locationId: shift.locationId,
        date: shift.date.toISOString().split('T')[0],
        startTime: shift.startTime,
        endTime: shift.endTime,
        role: shift.role,
        notes: shift.notes
      })
      if (response.success) {
        set(state => ({
          shifts: [...state.shifts, response.data],
          isLoading: false
        }))
      } else {
        set({ error: response.message || 'Failed to create shift', isLoading: false })
      }
    } catch (error) {
      set({ error: 'Failed to create shift', isLoading: false })
    }
  },

  updateShift: async (shiftId: string, updates: Partial<Shift>) => {
    set({ isLoading: true, error: null })
    try {
      const response = await updateShift(shiftId, updates)
      if (response.success) {
        set(state => ({
          shifts: state.shifts.map((shift) =>
            shift.id === shiftId
              ? { ...shift, ...response.data, updatedAt: new Date() }
              : shift
          ),
          isLoading: false
        }))
      } else {
        set({ error: response.message || 'Failed to update shift', isLoading: false })
      }
    } catch (error) {
      set({ error: 'Failed to update shift', isLoading: false })
    }
  },

  deleteShift: async (shiftId: string) => {
    set({ isLoading: true, error: null })
    try {
      const response = await deleteShift(shiftId)
      if (response.success) {
        set(state => ({
          shifts: state.shifts.filter((shift) => shift.id !== shiftId),
          isLoading: false
        }))
      } else {
        set({ error: response.message || 'Failed to delete shift', isLoading: false })
      }
    } catch (error) {
      set({ error: 'Failed to delete shift', isLoading: false })
    }
  },

  getShiftById: (shiftId: string) => {
    return get().shifts.find((shift) => shift.id === shiftId)
  },

  getShiftsForUser: (userId: string) => {
    return get().shifts.filter((shift) => shift.userId === userId)
  },

  resetShifts: () => {
    set({ shifts: [], isLoading: false, error: null })
  },
})) 