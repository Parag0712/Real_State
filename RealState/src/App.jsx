import React, { useEffect, useState } from 'react'
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
import AuthService from './Backend/auth'
import { signInFailure, signOutUserSuccess,signInStart, signInSuccess } from './redux/User/userSlice'
import ProtectedRoute from './components/ProtectedRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Search from './components/Search'
import Loading from './components/Loading'
import ListingPage from './pages/ListingPage'


function App() {

  const [error,setError] =useState(false);
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // UseEffect 
  useEffect(() => {
    if (currentUser) {
      AuthService.refreshToken(currentUser?.refreshToken).then((data) => {
      }).catch((error) => {
        setError(true);
        console.log(error);
      })
    }    
    dispatch(signInStart());
    AuthService.getAuthUser()
      .then((val) => {
        const refreshToken = val.data.refreshToken;
        const userData = { ...val.data.user, refreshToken, accessToken };
        dispatch(signInSuccess(userData));
      }).catch((error) => {
        setError(true);
        dispatch(signInFailure(error));
      })
  }, [])
  if(error) dispatch(signOutUserSuccess);
  return (
    <>
      {loading && <Loading></Loading>}
      <div className={`${loading == true ? 'hidden' : ''}`}>
        <BrowserRouter >
          {/* Same as */}
          <Header />
          <ToastContainer />
          <Routes>
            <Route path='/' element={<Home />}></Route>
            <Route path='/sign-in' element={<SignIn />}></Route>
            <Route path='/sign-up' element={<SignUp />}></Route>
            <Route path='/about' element={<About />}></Route>
            <Route path='/listing/:listingId' element={<ListingPage />} />
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