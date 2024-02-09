import React, { useState } from 'react'
import ListingService from '../Backedend/listing';
import ListingItem from './ListingItem';

function Search() {
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    rent: true,
    sell:true,
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);


  // handle change
  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'sell' ||
      e.target.id === 'rent' ||
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  }

  //handle submit 
  const handleSubmit = (e)=>{
    e.preventDefault();

    ListingService.getSearchListings(sidebardata).then((data)=>{
      const listing = data.data.Listing;
      console.log(listing);
      setListings(listing)
    }).catch((error)=>{
      console.log(error);
    })
  }

  return (
    <div>
      <div className='flex flex-col md:flex-row'>
        <div className='p-7  border-b-2 md:border-r-2 md:min-h-screen'>
          <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
            <div className='flex items-center gap-2'>
              <label className='whitespace-nowrap font-semibold'>
                Search Term:
              </label>
              <input
                type='text'
                id='searchTerm'
                placeholder='Search...'
                className='border rounded-lg p-3 w-full'
                value={sidebardata.searchTerm}
                onChange={handleChange}
              />
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
              <label className='font-semibold'>Type:</label>
              
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='rent'
                  className='w-5'
                  onChange={handleChange}
                  checked={sidebardata.rent}
                />
                <span>Rent</span>
              </div>
              
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='sell'
                  className='w-5'
                  onChange={handleChange}
                  checked={sidebardata.sell}
                />
                <span>Sale</span>
              </div>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='offer'
                  className='w-5'
                  onChange={handleChange}
                  checked={sidebardata.offer}
                />
                <span>Offer</span>
              </div>
            </div>
            <div className='flex gap-2 flex-wrap items-center'>
              <label className='font-semibold'>Amenities:</label>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='parking'
                  className='w-5'
                  onChange={handleChange}
                  checked={sidebardata.parking}
                />
                <span>Parking</span>
              </div>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='furnished'
                  className='w-5'
                  onChange={handleChange}
                  checked={sidebardata.furnished}
                />
                <span>Furnished</span>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <label className='font-semibold'>Sort:</label>
              <select
                onChange={handleChange}
                defaultValue={'created_at_desc'}
                id='sort_order'
                className='border rounded-lg p-3'
              >
                <option value='regularPrice_desc'>Price high to low</option>
                <option value='regularPrice_asc'>Price low to hight</option>
                <option value='createdAt_desc'>Latest</option>
                <option value='createdAt_asc'>Oldest</option>
              </select>
            </div>
            <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
              Search
            </button>
          </form>
        </div>        
        <div className='flex-1'>
          <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>
            Listing results:
          </h1>
          <div className='p-7 flex flex-wrap gap-4'>
            {!loading && listings.length === 0 && (
              <p className='text-xl text-slate-700'>No listing found!</p>
            )}
            {loading && (
              <p className='text-xl text-slate-700 text-center w-full'>
                Loading...
              </p>
            )}

            {!loading &&
              listings &&
              listings.map((listing) => (
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
                />

              ))}

            {showMore && (
              <button
                onClick={onShowMoreClick}
                className='text-green-700 hover:underline p-7 text-center w-full'
              >
                Show more
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search