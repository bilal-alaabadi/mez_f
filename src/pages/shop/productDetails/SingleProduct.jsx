import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { addToCart } from '../../../redux/features/cart/cartSlice';

const SingleProduct = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { data, error, isLoading } = useFetchProductByIdQuery(id);

    const dress = data?.product || {};
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleAddToCart = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        dispatch(addToCart(dress));
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === dress.image?.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? dress.image?.length - 1 : prev - 1
        );
    };

    // دالة لتحويل التاريخ إلى ميلادي
    const formatGregorianDate = (dateString) => {
        if (!dateString) return 'غير محدد';
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (isLoading) return <div className="text-center py-12">جاري التحميل...</div>;
    if (error) return <div className="text-center py-12 text-red-500">حدث خطأ أثناء تحميل تفاصيل الفستان</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {/* مسار التنقل */}
            <div className="flex items-center text-sm text-gray-600 mb-6">
                <Link to="/" className="hover:text-primary">الرئيسية</Link>
                <span className="mx-2">/</span>
                <Link to="/shop" className="hover:text-primary">الفساتين</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-400">{dress.name}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" dir='rtl'>
                {/* معرض الصور */}
                <div className="bg-white p-4 rounded-lg shadow">
                    {dress.image?.length > 0 ? (
                        <div className="relative">
                            <img
                                src={dress.image[currentImageIndex]}
                                alt={dress.name}
                                className="w-full h-80 object-contain rounded"
                            />
                            {dress.image.length > 1 && (
                                <div className="flex justify-between absolute top-1/2 w-full px-2">
                                    <button
                                        onClick={prevImage}
                                        className="bg-white/80 text-gray-800 p-2 rounded-full shadow"
                                    >
                                        ←
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="bg-white/80 text-gray-800 p-2 rounded-full shadow"
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                            <div className="flex mt-4 space-x-2 overflow-x-auto">
                                {dress.image.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt=""
                                        className={`w-16 h-16 object-cover rounded cursor-pointer border ${currentImageIndex === index ? 'border-primary' : 'border-transparent'}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                            <p className="text-gray-500">لا توجد صور متاحة</p>
                        </div>
                    )}
                </div>

                {/* تفاصيل الفستان */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h1 className="text-2xl font-bold mb-4">{dress.name}</h1>

                    <div className="space-y-4">
                        <div>
                            <p className="text-xl font-bold text-primary mb-2">{dress.price} ر.س</p>
                            {dress.remainingAmount > 0 && (
                                <p className="text-gray-600">المبلغ المتبقي: {dress.remainingAmount} ر.س</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium">تاريخ الإضافة:</p>
                                <p>{formatGregorianDate(dress.date)}</p>
                            </div>
                            <div>
                                <p className="font-medium">تاريخ الاستلام:</p>
                                <p>{formatGregorianDate(dress.deliveryDate)}</p>
                            </div>
                            <div>
                                <p className="font-medium">تاريخ الإرجاع:</p>
                                <p>{formatGregorianDate(dress.returnDate)}</p>
                            </div>
                            
                        </div>

                        <div>
                            <p className="font-medium">مكان الاستلام:</p>
                            <p>{dress.deliveryLocation || 'غير محدد'}</p>
                        </div>

                        <div>
                            <p className="font-medium">الوصف:</p>
                            <p className="text-gray-600">{dress.description || 'لا يوجد وصف'}</p>
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition"
                        >
                            إضافة إلى السلة
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleProduct;
