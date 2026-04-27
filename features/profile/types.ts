// 📄 FILE: features/profile/types.ts

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  avatar?: string;
  UserCode?: string;
  DateCreate?: string;
  DateCode?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  image?: string;
}

// Alias for consistency
export type { Profile as User };