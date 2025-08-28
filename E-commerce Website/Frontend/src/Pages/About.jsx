import React from 'react'
import Title from '../Components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../Components/NewsletterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>Forever is a lifestyle brand that blends timeless design with sustainable living. Founded with a vision to create eco-conscious fashion and home goods, Forever emphasizes durability, elegance, and environmental responsibility. Its collections inspire modern consumers to embrace simplicity, authenticity, and long-lasting quality in their daily lives.</p>
          <p>At Forever, innovation meets tradition to craft products that stand the test of time. From organic textiles to minimalist furniture, every item is thoughtfully designed and ethically produced. The company partners with local artisans and global suppliers to ensure fair practices, reducing waste while delivering value that truly lasts—forever.</p>
          <b className='text-gray-800'>Our Mission</b>
          <p>Forever’s mission is to promote mindful consumption by creating products that last a lifetime—both in style and structure. The brand is committed to reducing environmental impact, empowering local communities, and fostering a global movement toward sustainability. Through innovation, transparency, and purpose-driven design, Forever aims to build a better tomorrow.</p>
        </div>
      </div>
      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>
      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Quality Craftsmanship:</b>
          <p className='text-gray-600'>Our products are meticulously crafted by skilled artisans, ensuring the highest quality and attention to detail.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience:</b>
          <p className='text-gray-600'>Our products are designed for easy use and maintenance, making them perfect for modern living.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Exceptional Customer Service:</b>
          <p className='text-gray-600'>Our team is dedicated to providing personalized support and assistance, ensuring a seamless shopping experience.</p>
        </div>
      </div>
      <NewsletterBox />
    </div>
  )
}

export default About