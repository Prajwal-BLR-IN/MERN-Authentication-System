import Header from "./components/Header"
import {Routes, Route} from 'react-router-dom'
import Home from "./pages/Home"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import EmailVerify from "./pages/EmailVerify"
import ResetPassword from "./pages/ResetPassword"
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from "react"
import Loader from "./components/Loader"

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000);
    return () => clearTimeout(timer)
  }, []);

  if (loading) return <Loader /> 

  return (
    <>
    <ToastContainer />
    <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/email-verify" element={<EmailVerify />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}

export default App
