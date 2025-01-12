import React from 'react';
import { useProfileStore } from '@/store/profileStore';

export const ProfileCard: React.FC = () => {
  const { username, level, experience } = useProfileStore();

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">{username || 'Anonymous'}</h2>
      <div className="flex justify-between">
        <div>
          <p className="text-gray-400">Level</p>
          <p className="text-xl">{level}</p>
        </div>
        <div>
          <p className="text-gray-400">Experience</p>
          <p className="text-xl">{experience}</p>
        </div>
      </div>
    </div>
  );
};
