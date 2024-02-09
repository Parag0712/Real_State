import React, { useEffect } from 'react'
import AnimationContainer from '../components/AnimationContainer'
import ListingService from '../Backedend/listing'

function Home() {

  useEffect(()=>{
    ListingService.getSearchListings(
    {
      
      offer:false,
      furnished:false,
      sell:false,
      rent:false,
      searchTerm:"" 
    }
    )
    .then((data)=>{
      console.log(data);
    }).catch((error)=>{
      // console.log(error);
    })
  },[])
  return (
    <AnimationContainer>
      <div>Home</div>
    </AnimationContainer>
  )
}

export default Home