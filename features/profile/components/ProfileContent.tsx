// 📄 FILE: features/profile/components/ProfileContent.tsx
'use client';

import React, { useState } from 'react';
import type { ApiProfile } from '../types';

interface ProfileContentProps {
  profile: ApiProfile | null;
}

export default function ProfileContent({ profile }: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateProfile = () => {
    // TODO: Implement update profile logic
    setIsEditing(true);
    console.log('Update profile');
  };

  if (!profile) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <p className="text-gray-600">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

      {/* Profile Card */}
      <div className="max-w-md">
        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <img 
            src={profile.avatar || 'https://i.pravatar.cc/150?img=12'} 
            alt={profile.name} 
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>

        {/* Profile Info */}
        <div className="space-y-6">
          {/* Name */}
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Name</span>
            <span className="text-gray-900 font-semibold">{profile.name}</span>
          </div>

          {/* Email */}
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Email</span>
            <span className="text-gray-900 font-semibold">{profile.email}</span>
          </div>

          {/* Phone Number */}
          <div className="flex justify-between items-center py-3 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Nomor Handphone</span>
            <span className="text-gray-900 font-semibold">{profile.phone || '-'}</span>
          </div>
        </div>

        {/* Update Button */}
        <button 
          onClick={handleUpdateProfile}
          className="w-full mt-8 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-full transition-colors"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
}