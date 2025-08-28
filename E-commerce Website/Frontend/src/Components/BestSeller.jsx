import React, { useContext, useEffect, useState } from 'react'
import { shopContext } from '../Context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {

    const { products } = useContext(shopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        const bestProduct = products.filter((item) => item.bestSeller);
        setBestSeller(bestProduct);
    }, [products]);

    return (
        <div className='my-10'>
            <div className='text-center py-8 text-3xl'>
                <Title text1={'BEST'} text2={'SELLER'}/>
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Discover the best-selling products that our customers love.
                </p>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {bestSeller.map((item, index) => (
                    <ProductItem key={index} id={item.id} name={item.name} image={item.image} price={item.price} />
                ))}
            </div>
        </div>
    )
}

export default BestSeller