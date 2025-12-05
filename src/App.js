import { BrowserRouter, Routes,Route } from 'react-router-dom';
import './App.css';
import RoomPage from './pages/RoomPage';
import Home from './pages/Home';
import NotFound from './components/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route  path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
