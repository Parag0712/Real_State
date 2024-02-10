import { Link, useParams } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';
import { useEffect, useState } from 'react';
import ListingService from '../Backend/listing';

export default function ListingItem({id,img, name, address, description, offer, discountPrice, regularPrice, rent, bedrooms,bathrooms}) {
    return (
        <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]'>
            <Link to={`/listing/${id}`}>
                <img
                    src={img || 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D'}
                    alt='listing cover'
                    className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300'
                />
                <div className='p-3 flex flex-col gap-2 w-full'>
                    <p className='truncate text-lg font-semibold text-slate-700'>
                        {name}
                    </p>
                    <div className='flex items-center gap-1'>
                        <MdLocationOn className='h-4 w-4 text-green-700' />
                        <p className='text-sm text-gray-600 truncate w-full'>
                            {address}
                        </p>
                    </div>
                    <p className='text-sm text-gray-600 line-clamp-2'>
                        {description}
                    </p>
                    <p className='text-slate-500 mt-2 font-semibold '>
                        ${offer
                            ? discountPrice.toLocaleString('en-US')
                            : regularPrice.toLocaleString('en-US')}
                        {rent == true && ' / month'}
                    </p>
                    <div className='text-slate-700 flex gap-4'>
                        <div className='font-bold text-xs'>
                            {bedrooms > 1
                                ? `${bedrooms} beds `
                                : `${bedrooms} bed `}
                        </div>
                        <div className='font-bold text-xs'>
                            {bathrooms > 1
                                ? `${bathrooms} baths `
                                : `${bathrooms} bath `}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}