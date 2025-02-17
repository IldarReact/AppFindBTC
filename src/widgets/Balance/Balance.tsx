import { ConnectWalletButton } from '@/features/wallet/ui/ConnectWalletButton';
import { Card } from '@/shared/ui/Card/Card';
import { useUserStore } from '@/store/userStore';

export const Balance = () => {
  const { user } = useUserStore();

  if (!user) {
    return null;
  }

  return (
    <Card className="balance">
      <h2 className="text-xl font-bold mb-4">Balance</h2>
      {Object.entries(user.balance).map(([token, amount]) => (
        <p key={token}>
          {token}: {amount.toFixed(4)}
        </p>
      ))}
      <div className='mt-8'>
        <ConnectWalletButton />
      </div>
    </Card>
  );
};
