import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../src/context/user.context';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import MainPage from './pages/main-page';
import LogInRegisterPage from './pages/login-reg';

function App() {

  const { setUser, user } = useContext(UserContext);

  useEffect(() => {
    const storedUser = localStorage.getItem('userResp');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  return (
    <BrowserRouter>
      {user ? (
        // Authenticated user routes
        <>
          <Navbar username={user.username} />
          <Routes>
            <Route path="/" element={<MainPage />} />
            {/* Add more protected routes here */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </>
      ) : (
        // Unauthenticated user routes (without Navbar)
        <Routes>
          <Route path="/loginRegister" element={<LogInRegisterPage />} />
          {/* Redirect any attempt to access protected routes to the loginRegister page */}
          <Route path="*" element={<Navigate to="/loginRegister" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App
