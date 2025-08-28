import React from 'react'
import Hero from '../Components/Hero'
import LatestCollections from '../Components/LatestCollections'
import BestSeller from '../Components/BestSeller'
import OurPolicy from '../Components/OurPolicy'
import NewsletterBox from '../Components/NewsletterBox'

const Home = () => {
  return (
    <div>
      <Hero />
      <LatestCollections />
      <BestSeller />
      <OurPolicy />
      <NewsletterBox />
    </div>
  )
}

export default Home