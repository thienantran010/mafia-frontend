import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import VerifyEmail from './pages/VerifyEmail';
import Game from './pages/Game';
import { AuthProvider } from './providers/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify/:id" element={<VerifyEmail />} />
          <Route path="/game/:gameId" element={<Game />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App