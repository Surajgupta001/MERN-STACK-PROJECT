import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { shopContext } from '../Context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProduct from '../Components/RelatedProduct';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(shopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    })
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity duration-500 opacity-100'>
      {/* Product Data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {productData.image.map((item, index) => (
              <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
            ))}
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>
        {/* Product Information */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className='flex items-center gap-2 mt-2'>
            <img src={assets.star_icon} className='w-3 5' alt="" />
            <img src={assets.star_icon} className='w-3 5' alt="" />
            <img src={assets.star_icon} className='w-3 5' alt="" />
            <img src={assets.star_icon} className='w-3 5' alt="" />
            <img src={assets.star_dull_icon} className='w-3 5' alt="" />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-2 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-2 text-gray-500 md:w-4/5'>{productData.description}</p>
          <div className='flex flex-col gap-2 my-3'>
            <p>Select Size</p>
            <div className='flex gap-2'>
              {productData.sizes.map((item, index) => (
                <button onClick={() => setSize(item)} key={index} className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`}>{item}</button>
              ))}
            </div>
          </div>
          <button onClick={() => addToCart(productData._id, size)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
          <hr className='mt-4 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-3 flex flex-col gap-1'>
            <p>100% original product</p>
            <p>Cash on delivery available on this product</p>
            <p>Easy return and exchange within 7 days</p>
          </div>
        </div>
      </div>
      {/* Product Descriptions and Sections */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Descriptions</b>
          <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <p>E-commerce websites are online platforms that facilitate the buying and selling of goods and services over the internet. They act as digital storefronts, allowing customers to browse products, add them to a cart, and complete purchases through secure online transactions. These websites often include features like product catalogs, customer reviews, and order tracking, making the entire shopping experience convenient and accessible.</p>
          <p>E-commerce offers numerous benefits to both businesses and consumers. For businesses, it expands market reach, reduces operational costs compared to traditional brick-and-mortar stores, and enables personalized marketing strategies. Consumers, on the other hand, enjoy the convenience of shopping from anywhere, anytime, with a vast selection of products at their fingertips, often with competitive pricing and convenient delivery options.</p>
        </div>
      </div>
      {/* Display related product */}
      <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
    </div>
  ) : (
    <div className='opacity-0'></div>
  )
}

export default Product;