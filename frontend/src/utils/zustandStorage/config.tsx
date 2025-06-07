// import { create } from 'zustand';
// import { APIFile } from '@/utils/types';
// import { persist, createJSONStorage } from 'zustand/middleware';
// import { FileStoreState } from './types';

// export const useFilesStore = create<FileStoreState>()(
//   persist(
//     (set) => ({
//       files: [],
//       add: (file: APIFile) =>
//         set((state: FileStoreState) => ({ files: [...state.files, file] })),
//       remove: (_id: string) =>
//         set((state: FileStoreState) => ({
//           files: state.files.filter((file) => file._id !== _id),
//         })),
//       removeAll: () => set({ files: [] }),
//     }),
//     {
//       name: 'files-storage',
//       storage: createJSONStorage(() => localStorage),
//     },
//   ),
// );
