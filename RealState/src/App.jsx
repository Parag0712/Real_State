import React, { useEffect } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux'
import AuthService from './Backedend/auth'
import { signInSuccess } from './redux/User/userSlice'
import { motion,AnimatePresence } from 'framer-motion'
import ProtectedRoute from './components/ProtectedRoute'


function App() {

  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser ? currentUser : "");
  const dispatch = useDispatch();

  
  // UseEffect 
  useEffect(() => {
    AuthService.getAuthUser()
      .then((val) => {
        const userData = val.data.user
        dispatch(signInSuccess(userData));
        // Store You Data In Redux
        console.log(userData);
      }).catch((error) => {
        console.log(error);
      })
  }, [])

  return (
    <>
          <BrowserRouter>
            {/* Same as */}
            <Header />
            <ToastContainer />
            <Routes>
              <Route path='/' element={<Home />}></Route>
              <Route path='/sign-in' element={<SignIn />}></Route>
              <Route path='/sign-up' element={<SignUp />}></Route>
              <Route path='/about' element={<About />}></Route>
              {/* PrivateRoute */}
              <Route element={<ProtectedRoute />}>
                <Route path='/profile' element={<Profile />}></Route>
              </Route>
            </Routes>
          </BrowserRouter>
    </>
  )
}

export default App