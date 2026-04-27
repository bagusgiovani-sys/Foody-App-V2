'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Camera } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import SidebarNav from '@/components/layout/SidebarNav';
import { useProfile, useUpdateProfile } from '@/features/profile/hooks/useProfile';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
});
type ProfileForm = z.infer<typeof schema>;

function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 max-w-lg animate-pulse space-y-6">
      <div className="w-20 h-20 rounded-full bg-gray-200" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between py-3 border-b border-gray-100">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
      <div className="h-12 bg-gray-200 rounded-full" />
    </div>
  );
}

function UpdateProfileModal({ onClose }: { onClose: () => void }) {
  const { data: profile } = useProfile();
  const { mutate: update, isPending } = useUpdateProfile();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile?.name ?? '',
      email: profile?.email ?? '',
      phone: profile?.phone ?? '',
    },
  });

  const onSubmit = (data: ProfileForm) => {
    update(
      { name: data.name, email: data.email, phone: data.phone, avatar: avatarFile ?? undefined },
      { onSuccess: onClose }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 id="edit-profile-title" className="text-xl font-bold text-gray-900">Update Profile</h2>
          <button onClick={onClose} aria-label="Close" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Avatar upload */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative group"
            aria-label="Change avatar"
          >
            {avatarPreview || profile?.avatar ? (
              <img
                src={avatarPreview ?? profile!.avatar!}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl font-bold">
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setAvatarFile(file);
                setAvatarPreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input id="edit-name" type="text" {...register('name')} aria-invalid={!!errors.name}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input id="edit-email" type="email" {...register('email')} aria-invalid={!!errors.email}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
            <input id="edit-phone" type="tel" {...register('phone')}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <button
            type="submit"
            disabled={isPending}
            aria-busy={isPending}
            className="w-full mt-2 py-4 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold rounded-2xl transition"
          >
            {isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value || '—'}</span>
    </div>
  );
}

export default function ProfilePage() {
  const [editOpen, setEditOpen] = useState(false);
  const { data: profile, isLoading, isError } = useProfile();

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <SidebarNav />
            </aside>

            {/* Content */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

              {isLoading && <ProfileSkeleton />}

              {isError && (
                <div className="text-center py-16">
                  <p className="text-gray-500">Failed to load profile.</p>
                </div>
              )}

              {!isLoading && !isError && profile && (
                <div className="bg-white rounded-2xl shadow-sm p-8 max-w-lg">
                  {/* Avatar */}
                  <div className="mb-6">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.name} className="w-20 h-20 rounded-full object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white text-2xl font-bold">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Info rows */}
                  <div className="mb-8">
                    <InfoRow label="Name" value={profile.name} />
                    <InfoRow label="Email" value={profile.email} />
                    <InfoRow label="Nomor Handphone" value={profile.phone ?? ''} />
                  </div>

                  <button
                    onClick={() => setEditOpen(true)}
                    className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition"
                  >
                    Update Profile
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {editOpen && <UpdateProfileModal onClose={() => setEditOpen(false)} />}
    </MainLayout>
  );
}
