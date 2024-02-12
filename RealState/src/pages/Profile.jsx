import React, { useEffect, useRef, useState } from 'react'
import AuthService from '../Backend/auth'
import { useDispatch, useSelector } from 'react-redux'
import { signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/User/userSlice'
import AnimationContainer from '../components/AnimationContainer'
import { GoogleAuthProvider, getAuth, signOut } from 'firebase/auth'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { Link, useNavigate } from 'react-router-dom'
import Input from '../components/Input'
import { useForm } from 'react-hook-form'
import { app } from '../Backend/firebase'
import { toast } from 'react-toastify'
import { store } from '../redux/store'
import persistStore from 'redux-persist/es/persistStore'
import ListingService from '../Backend/listing'

function Profile() {
  const dispatch = useDispatch()
  const { loading, currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();
  const [userNameError, setUserNameError] = useState();
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [showListingsError, setShowListingsError] = useState();
  const [userListings, setUserListings] = useState([]);
  const navigate = useNavigate();
  const fileRef = useRef(null);

  //Handle File Upload Firestore
  const handleFileUpload = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      }, (error) => {
        setFileUploadError(true);
        reject(error); // Reject the promise if an error occurs
      }, () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL); // Resolve the promise with the download URL
        }).catch((error) => {
          setFileUploadError(true);
          reject(error); // Reject the promise if an error occurs while getting the download URL
        });
      });
    });
  };

  //Handle Submit
  const handleUpdate = (data) => {
    if (file) {
      handleFileUpload(file).then((imgData) => {
        dispatch(updateUserStart());
        data.avatar = imgData;
        AuthService.updateAccount(data).then((val) => {
          const userData = val.data.user
          dispatch(updateUserSuccess(userData));
          toast.success(val.message)
          navigate('/')
        }).catch((error) => {
          dispatch(updateUserFailure(error));
          toast.error(error)
        })
      })
    } else {
      data.avatar = currentUser.avatar;
      AuthService.updateAccount(data).then((val) => {
        const userData = val.data.user
        dispatch(updateUserSuccess(userData));
        toast.success(val.message)
        navigate('/')
      }).catch((error) => {
        dispatch(updateUserFailure(error));
        toast.error(error)
      })
    }
  }

  // React-form-hook
  const { handleSubmit, register } = useForm({
    defaultValues: {
      username: currentUser.username || "",
      email: currentUser.email,
      password: "",
    }
  });

  // handleShowListings
  const handleShowListings = () => {
    AuthService.getUserListing()
      .then((data) => {
        const message = data.message;
        const listing = data.data.Listing;
        const user = data.data.User;
        setUserListings(listing);
      }).catch((error) => {
        console.log(error);
      })
  }

  //Handle Listing Delete
  const handleListingDelete = (id) => {
    ListingService.deleteListing(id).then((data) => {
      toast.success(data.message,{
        autoClose: 200
      });
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== id)
      );
    }).catch((error)=>{
      toast.error(error)
    })

  }

  // Handle Logout
  const handleSignOut = () => {
    dispatch(signOutUserStart());
    AuthService.logout()
      .then((data) => {
        toast.success(data.message);
        dispatch(signOutUserSuccess());
      }).catch((error) => {
        toast.error(error);
        dispatch(signOutUserFailure(error));
      }).finally(()=>{
        dispatch(signOutUserSuccess())
      })
  }


  // Handle Delete User
  const handleDeleteUser = () => {
    dispatch(signOutUserStart());
    AuthService.delete()
      .then((data) => {
        persistStore(store).purge();
        toast.success(data.message);
        dispatch(signOutUserSuccess());
      }).catch((error) => {
        toast.error(error);
        dispatch(signOutUserFailure(error));
      })
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Display image preview
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  return (
    <AnimationContainer>
      <div className=' p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl font-semibold text-center mt-7'>Profile</h1>
        <form onSubmit={handleSubmit(handleUpdate)} className='flex flex-col gap-4'>
          <Input
            type='file'
            accept='image/*'
            hidden
            onChange={(e) => setFile(e.target.files[0])}
            ref={fileRef}
          >
          </Input>

          <img
            onClick={() => fileRef.current.click()}
            src={file ? URL.createObjectURL(file) : currentUser.avatar}
            alt='profile'
            className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
          />
          <p className='text-sm self-center'>
            {fileUploadError ? (
              <span className='text-red-700'>
                Error Image upload (image must be less than 2 mb)
              </span>
            ) : filePercentage > 0 && filePercentage < 100 ? (
              <span className='text-slate-700'>{`Uploading ${filePercentage}%`}</span>
            ) : filePercentage === 100 ? (
              <span className='text-green-700'>Image successfully uploaded!</span>
            ) : (
              ''
            )}
          </p>

          <Input
            type='text'
            placeholder='username'
            error={userNameError}
            {
            ...register("username", {
              validate: {
                matchPattern: (value) => {
                  const isValid = /^[a-zA-Z0-9\s]+$/.test(value);
                  if (isValid) {
                    setUserNameError("");
                  } else {
                    setUserNameError("*Enter Valid Name without special characters");
                  }
                  return isValid;
                }
              }
            })
            }
          />
          <Input
            type='email'
            placeholder='email'
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
            type='password'
            placeholder='password'
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
          <button
            disabled={loading}
            className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Loading...' : 'Update'}
          </button>
          <Link
            className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
            to={'/create-listing'}
          >
            Create Listing
          </Link>
        </form>
        <div className='flex justify-between mt-5'>
          <span
            onClick={handleDeleteUser}
            className='text-red-700 cursor-pointer'
          >
            Delete account
          </span>
          <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
            Sign out
          </span>
        </div>
        <button onClick={handleShowListings} className='text-green-700 w-full'>
          Show Listings
        </button>
        <p className='text-red-700 mt-5'>
          {showListingsError ? 'Error showing listings' : ''}
        </p>

        {userListings && userListings.length > 0 && (
          <div className='flex flex-col gap-4'>
            <h1 className='text-center mt-7 text-2xl font-semibold'>
              Your Listings
            </h1>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className='border rounded-lg p-3 flex justify-between items-center gap-4'
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt='listing cover'
                    className='h-16 w-16 object-contain'
                  />
                </Link>
                <Link
                  className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className='flex flex-col item-center'>
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className='text-red-700 uppercase'
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                    <button className='text-green-700 uppercase'>Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimationContainer>
  )
}

export default Profile