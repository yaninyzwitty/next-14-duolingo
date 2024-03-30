import { create } from 'zustand'

type Props = {
    isOpen: boolean

    open: () => void
    close: () => void


}


export const useExitModal = create<Props>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false })
}))