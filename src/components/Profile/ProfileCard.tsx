import React from 'react';
import { useProfileStore } from '@/store/profileStore';

export const ProfileCard: React.FC = () => {
  const { username, level, experience } = useProfileStore();

  return (
    <div className="profile-card">
      <h2>{username || 'Anonymous'}</h2>
      <div>
        <p>Level: {level}</p>
        <p>Experience: {experience}</p>
      </div>
    </div>
  );
};