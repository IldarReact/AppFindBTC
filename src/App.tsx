import { useEffect } from 'react';
import { Grid } from './components/HexGrid/Grid';
import { ToolList } from './components/Shop/ToolList';
import { WebAppService } from './services/telegram/webApp';
import { useGameStore } from './store/gameStore';

function App() {
  const { balance } = useGameStore();

  useEffect(() => {
    const init = async () => {
      try {
        WebAppService.getInstance().initialize();
      } catch (error) {
        console.error('Failed to initialize WebApp:', error);
      }
    };
    init();
  }, []);

  return (
    <div className="app">
      <div className="token-balance">
        {Object.entries(balance).map(([token, amount]) => (
          <div key={token} className="token-balance-item">
            <img
              src={`/tokens/${token.toLowerCase()}.svg`}
              alt={token}
              className="token-icon"
            />
            <span>{amount}</span>
          </div>
        ))}
      </div>
      <Grid />
      <ToolList />
    </div>
  );
}

export default App;