import React, { useEffect, useId, useState } from 'react'
import AnimationContainer from '../components/AnimationContainer'
import ListingService from '../Backend/listing'
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper'
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import Loading from '../components/Loading';


function Home() {
  SwiperCore.use([Navigation])
  const [listing, setListing] = useState([]);
  useEffect(() => {
    ListingService.getListings()
      .then((data) => {
        const listing = data.data.Listing;
        setListing(listing);
      }).catch((error) => {
        console.log(error);
      })
  }, [])
  const maxListings = 6;
  const sortedListings = listing.sort((a, b) => {
    // Assuming createdAt is a date field, compare them in descending order
    return new Date(b.createdAt) - new Date(a.createdAt);
  }).slice(0, maxListings);

  const rentListings = listing.filter(listing => listing.rent === true).slice(0, maxListings);
  const sellListings = listing.filter(listing => listing.sell === true).slice(0, maxListings);


  return (
    <AnimationContainer>
      <div>
        {/* top */}
        <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto'>
          <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
            Find your next <span className='text-slate-500'>perfect</span>
            <br />
            place with ease
          </h1>
          <div className='text-gray-400 text-xs sm:text-sm'>
            Sahand Estate is the best place to find your next perfect place to
            live.
            <br />
            We have a wide range of properties for you to choose from.
          </div>
          <Link
            to={'/search'}
            className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'
          >
            Let's get started...
          </Link>
        </div>

        {/* swiper */}
        <Swiper pagination={{
          clickable: true,
          dynamicBullets: true,
        }} navigation modules={[Pagination]}>
          {listing &&
            listing.length > 0 &&
            listing.map((listing, index) => (
              <SwiperSlide key={index}>
                <img
                  src={listing.imageUrls[0]}
                  alt={`Slide ${index}`}
                  className='h-[500px] w-full object-cover object-center'
                />
              </SwiperSlide>
            ))}
        </Swiper>

        {/* listing results for offer, sale and rent */}

        <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
          {listing && listing.length > 0 && (
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {sortedListings.map((listing, index) => (
                  <ListingItem
                    key={index}
                    id={listing._id}
                    img={listing.imageUrls[0]}
                    name={listing.name}
                    address={listing.address}
                    description={listing.description}
                    offer={listing.offer}
                    discountPrice={listing.discountPrice}
                    regularPrice={listing.regularPrice}
                    bedrooms={listing.bedrooms}
                    bathrooms={listing.bathrooms}
                    rent={listing.rent}
                    sell={listing.sell}
                  />
                ))}
              </div>
            </div>
          )}
          {listing && listing.length > 0 && (
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=rent'}>Show more places for rent</Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {rentListings.map((listing, index) => (
                  <ListingItem
                    key={listing._id}
                    id={listing._id}
                    img={listing.imageUrls[0]}
                    name={listing.name}
                    address={listing.address}
                    description={listing.description}
                    offer={listing.offer}
                    discountPrice={listing.discountPrice}
                    regularPrice={listing.regularPrice}
                    bedrooms={listing.bedrooms}
                    bathrooms={listing.bathrooms}
                    rent={listing.rent}
                    sell={listing.sell}
                  />
                ))}
              </div>
            </div>
          )}
          {listing && listing.length > 0 && (
            <div className=''>
              <div className='my-3'>
                <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
                <Link className='text-sm text-blue-800 hover:underline' to={'/search?type=sale'}>Show more places for sale</Link>
              </div>
              <div className='flex flex-wrap gap-4'>
                {sellListings.map((listing, index) => (
                  <ListingItem
                    key={listing._id}
                    id={listing._id}
                    img={listing.imageUrls[0]}
                    name={listing.name}
                    address={listing.address}
                    description={listing.description}
                    offer={listing.offer}
                    discountPrice={listing.discountPrice}
                    regularPrice={listing.regularPrice}
                    bedrooms={listing.bedrooms}
                    bathrooms={listing.bathrooms}
                    rent={listing.rent}
                    sell={listing.sell}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AnimationContainer>
  )
}

export default Home