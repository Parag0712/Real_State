import React from 'react'
import {Route,Routes,BrowserRouter} from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'

function App() {
  return (
    <>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/sign-in' element={<SignIn />}></Route>
        <Route path='/sign-up' element={<SignUp />}></Route>
        <Route path='/about' element={<About />}></Route>
        <Route path='/profile' element={<Profile />}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App