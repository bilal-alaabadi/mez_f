import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  useFetchProductByIdQuery, 
  useUpdateProductMutation 
} from '../../../../redux/features/products/productsApi';
import TextInput from '../../../dashbord/admin/addProduct/TextInput';
import UploadImage from '../../../dashbord/admin/addProduct/UploadImage';
import { toast } from 'react-toastify';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [product, setProduct] = useState({
        name: '',
        date: '',
        deliveryDate: '',
        returnDate: '',
        deliveryLocation: '',
        price: '',
        remainingAmount: '',
        description: '',
        image: []
    });

    const [newImages, setNewImages] = useState([]);
    const [removedImages, setRemovedImages] = useState([]);
    
    const { data: productData, isLoading: isProductLoading, error: fetchError } = useFetchProductByIdQuery(id);
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    useEffect(() => {
        if (productData?.product) {
            const { product } = productData;
            setProduct({
                name: product.name || '',
                date: product.date?.split('T')[0] || '',
                deliveryDate: product.deliveryDate?.split('T')[0] || '',
                returnDate: product.returnDate?.split('T')[0] || '',
                deliveryLocation: product.deliveryLocation || '',
                price: product.price || '',
                remainingAmount: product.remainingAmount || '',
                description: product.description || '',
                image: product.image || []
            });
        }
    }, [productData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (images) => {
        setNewImages(images);
    };

    const handleRemoveImage = (imageUrl) => {
        setRemovedImages(prev => [...prev, imageUrl]);
        setProduct(prev => ({
            ...prev,
            image: prev.image.filter(img => img !== imageUrl)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!product.name || !product.price || !product.description || 
            !product.date || !product.deliveryDate || !product.returnDate || 
            !product.deliveryLocation || !product.remainingAmount) {
            toast.error('الرجاء تعبئة جميع الحقول المطلوبة', {
                position: "top-center",
                autoClose: 3000
            });
            return;
        }

        const formData = new FormData();
        
        formData.append('name', product.name);
        formData.append('description', product.description);
        formData.append('date', product.date);
        formData.append('deliveryDate', product.deliveryDate);
        formData.append('returnDate', product.returnDate);
        formData.append('deliveryLocation', product.deliveryLocation);
        formData.append('price', product.price);
        formData.append('remainingAmount', product.remainingAmount);
        formData.append('author', user._id);

        if (newImages.length > 0) {
            newImages.forEach(image => {
                formData.append('images', image);
            });
        }

        product.image.forEach(img => {
            formData.append('existingImages', img);
        });

        removedImages.forEach(img => {
            formData.append('removedImages', img);
        });

        try {
            const result = await updateProduct({ 
                id, 
                formData 
            }).unwrap();
            
            toast.success('تم تحديث المنتج بنجاح', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            setTimeout(() => {
                navigate("/Shop", { 
                    state: { refresh: true },
                    replace: true
                });
                window.location.reload();
            }, 2000);
            
        } catch (error) {
            console.error('فشل تحديث المنتج:', error);
            toast.error(`فشل تحديث المنتج: ${error.data?.message || error.message}`, {
                position: "top-center",
                autoClose: 5000
            });
        }
    };

    if (isProductLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className="text-center py-8 text-red-600">
                حدث خطأ أثناء جلب بيانات المنتج: {fetchError.data?.message || fetchError.message}
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-md max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">تحديث المنتج</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* اسم المنتج */}
                    <TextInput
                        label="اسم المنتج"
                        name="name"
                        placeholder="أدخل اسم المنتج"
                        value={product.name}
                        onChange={handleChange}
                        required
                    />

                    {/* التاريخ */}
                    <TextInput
                        label="التاريخ"
                        name="date"
                        type="date"
                        value={product.date}
                        onChange={handleChange}
                        required
                    />

                    {/* تاريخ الاستلام */}
                    <TextInput
                        label="تاريخ الاستلام"
                        name="deliveryDate"
                        type="date"
                        value={product.deliveryDate}
                        onChange={handleChange}
                        required
                    />

                    {/* تاريخ الإرجاع */}
                    <TextInput
                        label="تاريخ الإرجاع"
                        name="returnDate"
                        type="date"
                        value={product.returnDate}
                        onChange={handleChange}
                        required
                    />

                    {/* مكان التسليم */}
                    <TextInput
                        label="مكان التسليم"
                        name="deliveryLocation"
                        placeholder="أدخل مكان التسليم"
                        value={product.deliveryLocation}
                        onChange={handleChange}
                        required
                    />

                    {/* السعر */}
                    <TextInput
                        label="السعر"
                        name="price"
                        type="number"
                        placeholder="أدخل السعر"
                        value={product.price}
                        onChange={handleChange}
                        required
                    />

                    {/* المبلغ المتبقي */}
                    <TextInput
                        label="المبلغ المتبقي"
                        name="remainingAmount"
                        type="number"
                        placeholder="أدخل المبلغ المتبقي"
                        value={product.remainingAmount}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* وصف المنتج */}
                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        وصف المنتج
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="5"
                        value={product.description}
                        placeholder="أدخل وصفًا تفصيليًا للمنتج"
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* تحميل الصور */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        صور المنتج
                    </label>
                    <UploadImage
                        name="images"
                        id="images"
                        setImage={handleImageChange}
                        existingImages={product.image}
                        onRemoveImage={handleRemoveImage}
                        multiple
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        يمكنك تحميل عدة صور (الحد الأقصى 5 صور)
                    </p>
                </div>

                {/* زر التحديث */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className={`px-6 py-2 rounded-md text-white font-medium ${
                            isUpdating 
                                ? 'bg-blue-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        } transition-colors`}
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                جاري التحديث...
                            </span>
                        ) : 'تحديث المنتج'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProduct;