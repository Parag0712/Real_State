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
import { signInFailure, signInStart, signInSuccess } from './redux/User/userSlice'
import { motion,AnimatePresence } from 'framer-motion'
import ProtectedRoute from './components/ProtectedRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './components/Search'
import Loading from './components/Loading'


function App() {

  const { currentUser,loading } = useSelector((state) => state.user);
  // console.log(currentUser ? currentUser : "");
  const dispatch = useDispatch();
  
  // UseEffect 
  useEffect(() => {
    if(currentUser){
      console.log(currentUser);
    }




    dispatch(signInStart());
    AuthService.getAuthUser()
      .then((val) => {
        const userData = val.data.user
        dispatch(signInSuccess(userData));
        // Store You Data In Redux
        // console.log(userData);
      }).catch((error) => {
    dispatch(signInFailure());
        // console.log(error);
      })
  }, [])


  return (
    <>
      {loading && <Loading></Loading>}
      <div className={`${loading == true?'hidden':''}`}>
      <BrowserRouter >
            {/* Same as */}
            <Header />
            <ToastContainer />
            <Routes>
              <Route path='/' element={<Home />}></Route>
              <Route path='/sign-in' element={<SignIn />}></Route>
              <Route path='/sign-up' element={<SignUp />}></Route>
              <Route path='/about' element={<About />}></Route>
              <Route path='/listing/:listingId' element={<Listing />} />
              <Route path='/search' element={<Search />} />
              {/* PrivateRoute */}
              <Route element={<ProtectedRoute />}>
                <Route path='/profile' element={<Profile />}></Route>
                <Route path='/create-listing' element={<CreateListing />}></Route>
                <Route path='/update-listing/:listingId' element={<UpdateListing />}></Route>
              </Route>
            </Routes>
          </BrowserRouter>
      </div>
    </>
  )
}

export default App