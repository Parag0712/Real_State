import React from 'react'
import AuthService from '../Backedend/auth'
import { useDispatch } from 'react-redux'
import { signOutUserFailure, signOutUserStart, signOutUserSuccess } from '../redux/User/userSlice'
import AnimationContainer from '../components/AnimationContainer'

function Profile() {
  const dispatch = useDispatch()
  

  const handleLogout = ()=>{
    dispatch(signOutUserStart())
    AuthService.logout()
    .then(()=>{
      dispatch(signOutUserSuccess());
      console.log("logout");
    }).catch((error)=>{
    dispatch(signOutUserFailure(error));
      console.log(error);
    })
  }

  return (
    <AnimationContainer>
    <button onClick={handleLogout}>
      logout
    </button>
    </AnimationContainer>
  )
}

export default Profile