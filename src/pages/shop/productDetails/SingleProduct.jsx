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

    // جدول تفاصيل المنتج
    const productDetails = [
        { label: 'السعر', value: `${dress.price} ر.س`, highlight: true },
        { label: 'المبلغ المتبقي', value: dress.remainingAmount > 0 ? `${dress.remainingAmount} ر.س` : 'غير محدد' },
        { label: 'تاريخ الإضافة', value: formatGregorianDate(dress.date) },
        { label: 'تاريخ الاستلام', value: formatGregorianDate(dress.deliveryDate) },
        { label: 'تاريخ الإرجاع', value: formatGregorianDate(dress.returnDate) },
        { label: 'مكان الاستلام', value: dress.deliveryLocation || 'غير محدد' }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* مسار التنقل */}
            <div className="flex items-center text-sm text-gray-600 mb-6">
                <Link to="/" className="hover:text-primary">الرئيسية</Link>
                <span className="mx-2">/</span>
                <Link to="/shop" className="hover:text-primary">الفساتين</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-400">{dress.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" dir='rtl'>
                {/* معرض الصور */}
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    {dress.image?.length > 0 ? (
                        <div className="relative">
                            <img
                                src={dress.image[currentImageIndex]}
                                alt={dress.name}
                                className="w-full h-96 object-contain rounded-lg"
                            />
                            {dress.image.length > 1 && (
                                <div className="flex justify-between absolute top-1/2 w-full px-2">
                                    <button
                                        onClick={prevImage}
                                        className="bg-white/80 text-gray-800 p-2 rounded-full shadow hover:bg-gray-100"
                                    >
                                        ←
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="bg-white/80 text-gray-800 p-2 rounded-full shadow hover:bg-gray-100"
                                    >
                                        →
                                    </button>
                                </div>
                            )}
                            <div className="flex mt-4 space-x-2 overflow-x-auto py-2">
                                {dress.image.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt=""
                                        className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${currentImageIndex === index ? 'border-primary' : 'border-transparent'}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                            <p className="text-gray-500">لا توجد صور متاحة</p>
                        </div>
                    )}
                </div>

                {/* تفاصيل المنتج */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4">{dress.name}</h1>

                    {/* جدول التفاصيل */}
                    <div className="mb-8">
                        <table className="w-full border-collapse">
                            <tbody>
                                {productDetails.map((detail, index) => (
                                    <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                        <td className="py-3 px-4 font-semibold text-gray-700 border-b border-gray-200 w-1/3">
                                            {detail.label}
                                        </td>
                                        <td className={`py-3 px-4 border-b border-gray-200 ${detail.highlight ? 'text-primary font-bold' : 'text-gray-600'}`}>
                                            {detail.value}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* الوصف */}
                    <div className="mb-8">
                        <h3 className="font-semibold text-lg mb-3 text-gray-800">الوصف:</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-gray-700 leading-relaxed">
                                {dress.description || 'لا يوجد وصف متاح لهذا المنتج'}
                            </p>
                        </div>
                    </div>

                    {/* زر الإضافة إلى السلة */}

                </div>
            </div>
        </div>
    );
};

export default SingleProduct;