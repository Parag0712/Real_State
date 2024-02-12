import React, { useEffect, useState } from 'react'
import ListingService from '../Backend/listing';
import { useParams } from 'react-router-dom';
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking, FaShare } from 'react-icons/fa';
import AnimationContainer from '../components/AnimationContainer';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper'
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

function ListingPage() {
    SwiperCore.use([Navigation])
    const { listingId } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const [userId, setUserId] = useState(false);
    const [user, setUser] = useState(null);
    const { currentUser } = useSelector((state) => state.user);
    useEffect(() => {
        setLoading(true)
        ListingService.getListing(listingId)
            .then((data) => {
                const message = data.message;
                const listing = data.data.Listing;
                const ListingUser = data.data.Listing.userRef;
                setUser(ListingUser);
                setUserId(ListingUser._id)
                setListing(listing);
            }).catch((error) => {
                console.log(error);
                console.log(error);
                setError(error)
            }).finally(() => {
                setLoading(false)
            })
    }, [])

    return (
        <AnimationContainer>
            <main>
                {error && (
                    <p className='text-center my-7 text-2xl'>Something went wrong!</p>
                )}
                {listing && !loading && !error && (
                    <div>
                        <Swiper pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }} navigation modules={[Pagination]} >
                            {listing.imageUrls.map((url, index) => (
                                <SwiperSlide key={url}>
                                    <img
                                        src={url}
                                        alt={`Slide ${index}`}
                                        className='h-[550px] w-full object-cover object-center'
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                            <FaShare
                                className='text-slate-500'
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    setCopied(true);
                                    setTimeout(() => {
                                        setCopied(false);
                                    }, 2000);
                                }}
                            />
                        </div>
                        {copied && (
                            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                                Link copied!
                            </p>
                        )}
                        <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                            <p className='text-2xl font-semibold'>
                                {listing.name} - ${' '}
                                {listing.offer
                                    ? listing.discountPrice.toLocaleString('en-US')
                                    : listing.regularPrice.toLocaleString('en-US')}
                                {listing.rent == true && ' / month'}
                            </p>
                            <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                                <FaMapMarkerAlt className='text-green-700' />
                                {listing.address}
                            </p>
                            <div className='flex gap-4'>
                                <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                    {listing.rent == true ? 'For Rent' : 'For Sale'}
                                </p>
                                {listing.offer && (
                                    <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                        ${+listing.regularPrice - +listing.discountPrice} OFF
                                    </p>
                                )}
                            </div>
                            <p className='text-slate-800'>
                                <span className='font-semibold text-black'>Description - </span>
                                {listing.description}
                            </p>
                            <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                                <li className='flex items-center gap-1 whitespace-nowrap '>
                                    <FaBed className='text-lg' />
                                    {listing.bedrooms > 1
                                        ? `${listing.bedrooms} beds `
                                        : `${listing.bedrooms} bed `}
                                </li>
                                <li className='flex items-center gap-1 whitespace-nowrap '>
                                    <FaBath className='text-lg' />
                                    {listing.bathrooms > 1
                                        ? `${listing.bathrooms} baths `
                                        : `${listing.bathrooms} bath `}
                                </li>
                                <li className='flex items-center gap-1 whitespace-nowrap '>
                                    <FaParking className='text-lg' />
                                    {listing.parking ? 'Parking spot' : 'No Parking'}
                                </li>
                                <li className='flex items-center gap-1 whitespace-nowrap '>
                                    <FaChair className='text-lg' />
                                    {listing.furnished ? 'Furnished' : 'Unfurnished'}
                                </li>
                            </ul>
                            {currentUser && userId !== currentUser._id && !contact && (
                                <button
                                    onClick={() => setContact(true)}
                                    className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
                                >
                                    Contact landlord
                                </button>
                            )}
                            {contact && <Contact user={user} listing={listing} />}
                        </div>
                    </div>
                )}
            </main>
        </AnimationContainer>
    )
}

export default ListingPage