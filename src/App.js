import { BrowserRouter, Routes,Route } from 'react-router-dom';
import './App.css';
import RoomPage from './pages/RoomPage';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route  path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
