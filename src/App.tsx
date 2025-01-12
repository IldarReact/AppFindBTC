import { useEffect } from 'react';
import { ToolList } from './components/Shop/ToolList';
import { WebAppService } from './services/telegram/webApp';
import HexGrid from './components/Field/HexGrid';
import Balance from './components/Profile/Balance';

function App() {

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
      <Balance />
      <HexGrid />
      <ToolList />
    </div>
  );
}

export default App;