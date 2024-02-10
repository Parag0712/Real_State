import React, { useEffect, useState } from 'react'
import Input from '../components/Input'
import { useForm } from 'react-hook-form'
import ListingService from '../Backend/listing';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../Backend/firebase'
import { toast } from 'react-toastify';
import AnimationContainer from '../components/AnimationContainer';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loadingInStart, loadingInStop } from '../redux/User/userSlice';

function CreateListing() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm(
        {
            defaultValues:
                { sell: true }
        });
    const [error, setError] = useState();
    const [files, setFiles] = useState();
    const [loading, setLoading] = useState(false);
    const images = watch("images");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Handle Remove Image
    const handleRemoveImage = (indexToRemove) => {
        // Remove the image from the files state
        const updatedFiles = [...files];
        updatedFiles.splice(indexToRemove, 1);
        setFiles(updatedFiles);
    };


    // Watch for changes in the "images" field and validate
    useEffect(() => {
        if (images?.length > 6) {
            setError("You can only upload up to 6 images");
        } else {
            setError('');
        }
    }, [images]);

    // Store Image
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    // HandleListing Create
    const handleListingCreate = (data) => {
        dispatch(loadingInStart());

        const promise = [];
        for (let index = 0; index < files.length; index++) {
            setLoading(true);
            promise.push(storeImage(files[index]));
        }

        Promise.all(promise).then((urls) => {
            ListingService.createListing(data, urls).then((value) => {
                toast.success(value.data.message)
                const id = value.data.data.listingPost._id
                navigate(`/listing/${id}`)
            }).catch((error) => {
                toast.error(error);
            }).finally(() => {
                setLoading(false)
                dispatch(loadingInStop());
            });
        })
    }

    return (
        <AnimationContainer>
            <main className='p-3 max-w-4xl mx-auto'>
                <h1 className='text-3xl font-semibold text-center my-7'>
                    Create a Listing
                </h1>
                <form onSubmit={handleSubmit(handleListingCreate)} className='flex flex-col sm:flex-row gap-4'>
                    <div className='flex flex-col gap-4 flex-1'>
                        <Input
                            type='text'
                            placeholder='Enter Name'
                            required
                            {...register("names", { required: true })}
                        />
                        <textarea
                            type='text'
                            placeholder='Description'
                            className='border p-3 rounded-lg'
                            id='description'
                            required
                            {...register("description", { required: true })}
                        />
                        <Input
                            type='text'
                            placeholder='Address'
                            required
                            {...register("address", { required: true })}
                        />

                        <div className='flex gap-6 flex-wrap'>
                            <div className='flex gap-1'>
                                <Input
                                    type='checkbox'
                                    className='w-5 m-0'
                                    {...register("sell")}
                                /><span>Sell</span>
                            </div>
                            <div className='flex gap-1'>
                                <Input
                                    type='checkbox'
                                    className='w-5 m-0'
                                    {...register("rent")}
                                /><span>Rent</span>
                            </div>


                            <div className='flex gap-1'>
                                <Input
                                    type='checkbox'
                                    className='w-5 m-0'
                                    {...register("parking")}
                                /><span>Parking Spot</span>
                            </div>

                            <div className='flex gap-1'>
                                <Input
                                    type='checkbox'
                                    className='w-5 m-0'
                                    {...register("furnished")}
                                /><span>Furnished</span>
                            </div>
                            <div className='flex gap-1'>
                                <Input
                                    type='checkbox'
                                    className='w-5 m-0'
                                    {...register("offer")}
                                /><span>Offer</span>
                            </div>
                        </div>
                        <div className='flex flex-wrap gap-6'>
                            <div className='flex items-center gap-2'>
                                <Input
                                    type='number'
                                    min='1'
                                    max='10'
                                    required
                                    defaultValue="0"
                                    className='p-3 border border-gray-300 rounded-lg'
                                    {...register("bedrooms")}
                                />
                                <p>Beds</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Input
                                    type='number'
                                    min='1'
                                    max='10'
                                    required
                                    defaultValue="0"
                                    className='p-3 border border-gray-300 rounded-lg'
                                    {...register("bathrooms")}
                                />
                                <p>Baths</p>
                            </div>

                            <div className='flex items-center gap-2'>
                                <Input
                                    type='number'
                                    id='regularPrice'
                                    min='50'
                                    max='10000000'
                                    required
                                    defaultValue="0"
                                    className='p-3 border border-gray-300 rounded-lg'
                                    {...register("regularPrice")}
                                />
                                <div className='flex flex-col items-center'>
                                    <p>Regular price</p>
                                    {watch('rent') == 'on' && (
                                        <span className='text-xs'>($ / month)</span>
                                    )}
                                </div>
                            </div>

                            {watch('offer') == true && (
                                <div className='flex items-center gap-2'>
                                    <Input
                                        type='number'
                                        id='discountPrice'
                                        min='0'
                                        max='10000000'
                                        required
                                        defaultValue="0"
                                        className='p-3 border border-gray-300 rounded-lg'
                                        {...register("discountPrice")}
                                    />
                                    <div className='flex flex-col items-center'>
                                        <p>Discounted price</p>
                                        {watch('rent') == 'on' && (
                                            <span className='text-xs'>($ / month)</span>
                                        )}
                                    </div>
                                </div>
                            )
                            }
                        </div>
                    </div>
                    <div className='flex flex-col flex-1 gap-4'>
                        <p className='font-semibold'>
                            Images:
                            <span className='font-normal text-gray-600 ml-2'>
                                The first image will be the cover (max 6)
                            </span>
                        </p>
                        <div className='flex gap-4'>
                            <Input
                                className='p-3 border border-gray-300 rounded w-full'
                                type='file'
                                id='images'
                                accept='image/jpeg, image/png, image/jpg, image/jpeg'
                                multiple
                                required
                                onChange={(e) => setFiles(e.target.files)}
                            />
                        </div>
                        <p className='text-red-700 text-sm'>
                        </p>
                        {files && Object.keys(files).map((key, index) => (
                            <div key={index} className='flex justify-between p-3 border items-center'>
                                <img
                                    src={URL.createObjectURL(files[key])}
                                    alt={`Listing Image ${index}`}
                                    className='w-20 h-20 object-contain rounded-lg'
                                />
                                <p>{files[key].name}</p>
                                <div>
                                    <button
                                        type='button'
                                        className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                                        onClick={() => handleRemoveImage(key)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}


                        <button
                            className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
                            disabled={loading}
                        >
                            {loading ? "loading" : "Create"}
                        </button>

                        {error && <p className='text-red-700 text-sm'>{error}</p>}
                    </div>
                </form>
            </main>
        </AnimationContainer>
    )
}

export default CreateListing