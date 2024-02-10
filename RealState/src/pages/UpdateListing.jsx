import React, { useEffect, useState } from 'react'
import Input from '../components/Input'
import { useForm } from 'react-hook-form'
import ListingService from '../Backend/listing';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../Backend/firebase'
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import AnimationContainer from '../components/AnimationContainer';
function UpdateListing() {

    const [files, setFiles] = useState();
    const navigate = useNavigate();
    const [imgdata, setImgData] = useState([]);
    let { listingId } = useParams();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm(
        {
            defaultValues:
                { sell: true }
        }
    );

    useEffect(() => {
        ListingService.getListing(listingId).then((data) => {
            const listing = data.data.Listing;
            if (listing) {
                setValue('name', listing.name);
                setValue('description', listing.description);
                setValue('address', listing.address);
                setValue('rent', listing.rent);
                setValue('sell', listing.sell);
                setValue('parking', listing.parking);
                setValue('furnished', listing.furnished);
                setValue('offer', listing.offer);
                setValue('bedrooms', listing.bedrooms);
                setValue('bathrooms', listing.bathrooms);
                setValue('regularPrice', listing.regularPrice);
                setValue('discountPrice', listing.discountPrice);
            }

            if (listing.imageUrls && Array.isArray(listing.imageUrls)) {
                setImgData(listing.imageUrls);
            }
        });
    }, []);


    // Handle Remove Image
    const handleRemoveImage = (indexToRemove) => {
        if (imgdata.length > 0) {
            setImgData(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
        } else {
            // Remove the image from the files state
            const updatedFiles = [...files];
            updatedFiles.splice(indexToRemove, 1);
            setFiles(updatedFiles);
        }
    };


    // Watch for changes in the "images" field and validate
    useEffect(() => {
        if (files?.length > 6) {
            setError("You can only upload up to 6 images");
        } else {
            setError('');
        }
    }, [files]);

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
        if (files) {
            const promise = [];
            for (let index = 0; index < files.length; index++) {
                setLoading(true);
                promise.push(storeImage(files[index]));
            }
            
            Promise.all(promise).then((urls) => {
                ListingService.updateListing(data, urls, listingId).then((value) => {
                    toast.success(value.data.message)
                    navigate('/profile')
                }).catch((error) => {
                    toast.error(error);
                }).finally(() => {
                    setLoading(false)
                });
            })
        } else {
            ListingService.updateListing(data, imgdata, listingId).then((value) => {
                toast.success(value.data.message)
                navigate('/profile')
            }).catch((error) => {
                toast.error(error);
            }).finally(() => {
                setLoading(false)
            });
        }
    }

    return (
        <AnimationContainer>
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                Edit a Listing
            </h1>
            <form onSubmit={handleSubmit(handleListingCreate)} className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <Input
                        type='text'
                        placeholder='Enter Name'
                        required
                        {...register("name", { required: true })}
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
                            accept='image/*'
                            multiple
                            onChange={(e) => { setFiles(e.target.files); setImgData([]) }}
                        />
                    </div>
                    <p className='text-red-700 text-sm'>
                    </p>


                    {imgdata.map((imageUrl, index) => (
                        <div key={index} className='flex justify-between p-3 border items-center'>
                            <img
                                src={imageUrl}
                                alt={`Listing Image ${index}`}
                                className='w-20 h-20 object-contain rounded-lg'
                            />
                            {index}
                            <div>
                                <button
                                    type='button'
                                    className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                                    onClick={() => handleRemoveImage(index)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

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
                        {loading ? "loading" : "Edit"}
                    </button>

                    {error && <p className='text-red-700 text-sm'>{error}</p>}
                </div>
            </form>
        </main>
        </AnimationContainer>
    )
}

export default UpdateListing