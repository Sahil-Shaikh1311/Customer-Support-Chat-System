import './App.css'
// import React from 'react';
import Login from './pages/Login';
import AgentDashboard from './pages/AgentDashboard';
import RegisterPage from './pages/Register';
import ProtectedRoute from './routes/ProtectedRoutes';
import CustomerChat from './pages/CustomerChat';
// @ts-ignore
import Index from './pages/Index';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Index/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path = "/agent-dashboard" element ={<ProtectedRoute role="agent"><AgentDashboard/></ProtectedRoute>}/>
        <Route path = "/customer-chat" element ={<ProtectedRoute role="customer"><CustomerChat/></ProtectedRoute>}/>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      </BrowserRouter>
      
    </>
  )
}

export default App
