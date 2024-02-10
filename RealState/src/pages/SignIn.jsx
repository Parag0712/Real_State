import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import { useForm } from 'react-hook-form'
import Input from '../components/Input';
import AuthService from '../Backend/auth.js'
import { toast } from 'react-toastify';
import { signInFailure, signInStart, signInSuccess } from '../redux/User/userSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import AnimationContainer from '../components/AnimationContainer.jsx';
function SignIn() {
  const { register, handleSubmit } = useForm();
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  // Here I handle ALl request
  const handleLogin = (data) => {
    dispatch(signInStart());
    AuthService.login(data)
      .then((val) => {
        const refreshToken =val.data.refreshToken;
        const accessToken = val.data.accessToken;
        const userData = { ...val.data.user, refreshToken, accessToken };
        dispatch(signInSuccess(userData));
        toast.success(val.message)
        navigate('/')
      }).catch((error) => {
        toast.error(error);
        dispatch(signInFailure(error));
      })
  }


  return (
    <AnimationContainer>
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
        <form onSubmit={handleSubmit(handleLogin)} className='flex flex-col gap-4'>

          <Input
            type="text"
            placeholder="email"
            error={emailError}
            {
            ...register("email", {
              validate: {
                matchPattern: (value) => {
                  const isValid = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value);
                  if (isValid) {
                    setEmailError("");  // Assuming `clearHelperError` is a function to clear the error message
                  } else {
                    setEmailError("*Enter Valid Email");
                  }
                  return isValid;
                }
              }
            })
            }
          />
          <Input
            type="text"
            placeholder="password"
            error={passwordError}
            {
            ...register("password", {
              validate: {
                matchPattern: (value) => {
                  const isValid = /^.{8,}$/.test(value);
                  if (isValid) {
                    setPasswordError(""); // Clear the error message
                  } else {
                    setPasswordError("Password must be at least 8 characters");
                  }
                  return isValid;
                }
              }
            })
            }
          />
          <button disabled={loading}
            className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? "Loading" : "Sign In"}
          </button>
          <OAuth />

        </form>
        <div className='flex gap-2 mt-5'>
          <p>Dont have an account?</p>
          <Link to={'/sign-up'}>
            <span className='text-blue-700'>Sign up</span>
          </Link>
        </div>
        {/* {error && <p className='text-red-500 mt-5'></p>} */}
      </div>
    </AnimationContainer>
  )
}

export default SignIn