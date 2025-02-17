import { useUserStore } from '@/store/userStore';
import { calculateTotalBalance } from '@/entities/user/model/userModel';
import { Card } from '@/shared/ui/Card/Card';

export const Profile = () => {
  const { user } = useUserStore();

  if (!user) {
    return null;
  }

  const totalBalanceUSD = calculateTotalBalance(user);

  return (
    <div className="space-y-4">
      <Card className="profile">
        <h2 className="text-xl font-bold mb-4">Profile</h2>
        <p>Name: {user.username}</p>
        <h3 className="text-lg font-semibold mt-4 mb-2">Balance:</h3>
        <p>ETH: {user.balance.ETH.toFixed(4)}</p>
        <p>TON: {user.balance.TON.toFixed(4)}</p>
        <p>$: {user.balance.$.toFixed(2)}</p>
        <p className="mt-2 font-bold">
          Total cost: ${totalBalanceUSD.toFixed(2)}
        </p>
      </Card>
    </div>
  );
};
