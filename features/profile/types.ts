export interface ApiProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: File;
}
