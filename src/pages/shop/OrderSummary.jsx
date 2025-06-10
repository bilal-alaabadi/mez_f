import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/features/cart/cartSlice';

const OrderSummary = ({ onClose }) => {
    const dispatch = useDispatch();
    const { products, selectedItems, totalPrice } = useSelector((store) => store.cart);
    const shippingFee = 2; // سعر الشحن 2 ريال عماني

    const handleClearCart = () => {
        dispatch(clearCart());
    };

const createWhatsAppMessage = () => {
    let message = "الطلب\n\n";
    
    products.forEach((product) => {
        message += `${product.name}\n`;
        message += `الكمية: ${product.quantity}\n`;
        message += `السعر: ر.ع ${product.price.toFixed(2)}\n`;
        message += `الرابط: https://pinkheart369.shop/shop/${product._id}\n`; // تم تحديث الرابط هنا
        message += `----------------\n`;
    });
    
    message += `\n*المجموع الكلي*: ر.ع ${totalPrice.toFixed(2)}`;
    message += `\n*سعر الشحن*: ر.ع ${shippingFee.toFixed(2)}`;
    message += `\n*المجموع النهائي*: ر.ع ${(totalPrice + shippingFee).toFixed(2)}`;
    message += "\n\nشكراً لاختياركم! ";
    
    return message;
};

    const whatsappLink = `https://wa.me/96891159700?text=${encodeURIComponent(createWhatsAppMessage())}`;

    return (
        <div className='bg-[#f8d7d0] mt-5 rounded text-base'>
            <div className='px-6 py-4 space-y-5'>
                <h2 className='text-xl text-text-dark'>ملخص الطلب</h2>
                <p className='text-text-dark mt-2'>عدد العناصر: {selectedItems}</p>
                <p className='font-bold text-lg'>المجموع الكلي: ر.ع {totalPrice.toFixed(2)}</p>
                <p className='text-text-dark'>سعر الشحن: ر.ع {shippingFee.toFixed(2)}</p>
                <p className='font-bold text-lg text-primary'>
                    المجموع النهائي: ر.ع {(totalPrice + shippingFee).toFixed(2)}
                </p>
                <div className='px-4 mb-6'>
                    <button
                        onClick={handleClearCart}
                        className='bg-red-500 px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center mb-4'
                    >
                        <span className='mr-2'>تفريغ السلة</span>
                        <i className="ri-delete-bin-7-line"></i>
                    </button>

                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={onClose}
                    >
                        <button className='bg-green-600 px-3 py-1.5 text-white mt-2 rounded-md flex justify-between items-center'>
                            <span className='mr-2'>إتمام الشراء</span>
                            <i className="ri-bank-card-line"></i>
                        </button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;