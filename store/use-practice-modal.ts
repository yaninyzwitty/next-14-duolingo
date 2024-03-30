import { create } from 'zustand'

type Props = {
    isOpen: boolean

    open: () => void
    close: () => void


}


export const usePracticeModal = create<Props>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
}))