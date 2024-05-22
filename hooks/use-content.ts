import { Id } from "@/convex/_generated/dataModel";
import { create } from "zustand";


type ContentStore = {
  content: string;
  setContent: (newContent: string) => void;
  isSaved: boolean;
  saveContent: () => void
}

export const useContent = create<ContentStore>((set) => ({
  content: "",
  setContent: (newContent) => set({ content: newContent, isSaved: false }),
  isSaved: true,
  saveContent: () => {
    set({ isSaved: true })
  }
})) 