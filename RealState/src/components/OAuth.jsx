import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../Backend/firebase';
import AuthService from '../Backend/auth';
import { useDispatch } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/User/userSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle Google SingIn
    const handleGoogleClick = async () => {
        dispatch(signInStart());
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider);
            console.log(result.user);
            AuthService.googleAuth({ username: result.user.displayName, email: result.user.email, avatar: result.user.photoURL }).then((data) => {
                const refreshToken = data.data.refreshToken;
                const accessToken = data.data.accessToken;
                const userData = { ...data.data.user, refreshToken, accessToken };
                toast.success(data.message)
                dispatch(signInSuccess(userData));
                navigate('/')
            }).catch((error) => {
                dispatch(signInFailure(error));
                toast.error(error);
            })
        } catch (error) {
            toast.error(error);
        }
    }
    return (
        <button
            onClick={handleGoogleClick}
            type='button'
            className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
        >
            Continue with google
        </button>
    )
}

export default OAuth