import './App.css';
import TradingView from './components/trading-view';
import Container from 'react-bootstrap/Container';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Container fluid style={{ padding: '0 100px' }}>
      <TradingView />
    </Container>
  );
}

export default App;
