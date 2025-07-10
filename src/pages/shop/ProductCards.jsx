import React from 'react';
import { Link } from 'react-router-dom';
import RatingStars from '../../components/RatingStars';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/features/cart/cartSlice';

const ProductCards = ({ products = [] }) => {
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };

    if (!products || products.length === 0) {
        return <div className="text-center py-8 text-gray-500">لا توجد منتجات لعرضها</div>;
    }

    return (
        <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {products.map((product, index) => (
                <div key={index} className='product__card'>
                    <div className='relative'>
                        <Link to={`/shop/${product._id}`}>
                            <div className="aspect-square overflow-hidden">
                                <img
                                    src={product.image?.[0] || "https://via.placeholder.com/300"}
                                    alt="product image"
                                    className='w-full h-full object-cover hover:scale-105 transition-all duration-300'
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/300";
                                        e.target.alt = "Image not found";
                                    }}
                                />
                            </div>
                        </Link>
                    </div>

                    {/* product description */}
                    <div className='product__card__content text-center mt-4'>
                        <h4 className="text-lg font-semibold">{product.name}</h4>
                        <p className="text-primary font-bold">{product.price} ر.س</p>
                        {/* <RatingStars rating={product.rating} /> */}

                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductCards;