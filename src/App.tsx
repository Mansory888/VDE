import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../src/context/user.context';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar';
import MainPage from './pages/main-page';
import ExamQuestionView from './pages/exam-page';
import LogInRegisterPage from './pages/login-reg';
import TopicQuestionView from './pages/topic-page';
import TopicList from './pages/topic-list';
import SettingsPage from './pages/settings-page';
import FinishPage from './pages/finish-page';

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
            <Route path="/ExamPage" element={<ExamQuestionView />} />
            <Route path="/TopicListPage" element={<TopicList />} />
            <Route path="/SettingsPage" element={<SettingsPage />} />
            <Route path="/FinishPage" element={<FinishPage />} />
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
