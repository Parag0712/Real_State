import React, { useState } from 'react'
import AnimationContainer from './AnimationContainer'
import { Link } from 'react-router-dom';

function Contact({ listing,user }) {
    
    const [message, setMessage] = useState('');
  const onChange = (e) => {
    setMessage(e.target.value);
  };

    return (
        <AnimationContainer>
            <div className='flex flex-col gap-2'>
                <p>
                    Contact <span className='font-semibold'>{user?.username}</span>{' '}
                    for{' '}
                    <span className='font-semibold'>{listing?.name.toLowerCase()}</span>
                </p>
                <textarea
                    name='message'
                    id='message'
                    rows='2'
                    value={message}
                    onChange={onChange}
                    placeholder='Enter your message here...'
                    className='w-full border p-3 rounded-lg'
                ></textarea>

                <Link
                    to={`mailto:${user?.email}?subject=Regarding ${listing?.name}&body=${message}`}
                    className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
                >
                    Send Message
                </Link>
            </div>
        </AnimationContainer>
    )
}

export default Contact