import { Wallet, Home, ShoppingBag, User, LucideIcon } from 'lucide-react';
import { Button } from '@/shared/ui/Button/Button';
import React from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    id: 'game',
    label: 'Game',
    icon: Home,
  },
  {
    id: 'shop',
    label: 'Shop',
    icon: ShoppingBag,
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
  },
  {
    id: 'balance',
    label: 'Balance',
    icon: Wallet,
  },
];

interface BottomNavProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  onViewChange,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <Button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              variant="ghost"
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-blue-600' : 'text-gray-600'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};