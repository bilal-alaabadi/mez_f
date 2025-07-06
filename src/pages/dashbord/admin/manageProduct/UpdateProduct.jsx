import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  useFetchProductByIdQuery, 
  useUpdateProductMutation 
} from '../../../../redux/features/products/productsApi';
import TextInput from '../../../dashbord/admin/addProduct/TextInput';
import UploadImage from '../../../dashbord/admin/addProduct/UploadImage';

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
    
    const { data: productData, isLoading: isProductLoading, error: fetchError } = useFetchProductByIdQuery(id);
    const [updateProduct, { isLoading: isUpdating, error: updateError }] = useUpdateProductMutation();

    // تعبئة النموذج ببيانات المنتج عند التحميل
    useEffect(() => {
        if (productData?.product) {
            setProduct({
                name: productData.product.name || '',
                date: productData.product.date || '',
                deliveryDate: productData.product.deliveryDate || '',
                returnDate: productData.product.returnDate || '',
                deliveryLocation: productData.product.deliveryLocation || '',
                price: productData.product.price || '',
                remainingAmount: productData.product.remainingAmount || '',
                description: productData.product.description || '',
                image: productData.product.image || []
            });
        }
    }, [productData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };

    const handleImageChange = (images) => {
        setNewImages(images);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!product.name || !product.price || !product.description || 
            !product.date || !product.deliveryDate || !product.returnDate || 
            !product.deliveryLocation || !product.remainingAmount) {
            alert('أملأ كل الحقول المطلوبة');
            return;
        }

        const formData = new FormData();
        Object.keys(product).forEach(key => {
            if (key !== 'image') {
                formData.append(key, product[key]);
            }
        });
        
        // إضافة الصور الجديدة إذا وجدت
        if (newImages.length > 0) {
            newImages.forEach(image => {
                formData.append('image', image);
            });
        }
        
        formData.append('author', user._id);

        try {
            await updateProduct({ 
                id: id, 
                body: formData
            }).unwrap();
            
            alert('تم تحديث الفستان بنجاح');
            navigate("/shop");
        } catch (error) {
            console.error('Failed to update product:', error);
            if(error.status === 401) {
                alert('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى');
                navigate('/login');
            } else {
                alert('فشل تحديث الفستان: ' + (error.data?.message || error.message));
            }
        }
    };

    if (isProductLoading) return <div>تحميل...</div>;
    if (fetchError) return <div>حدث خطأ أثناء جلب بيانات الفستان!</div>;

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">تحديث الفستان</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    label="أسم الفستان"
                    name="name"
                    placeholder="أكتب أسم الفستان"
                    value={product.name}
                    onChange={handleChange}
                />
                <TextInput
                    label="التاريخ"
                    name="date"
                    type="date"
                    value={product.date}
                    onChange={handleChange}
                />
                <TextInput
                    label="تاريخ الاستلام"
                    name="deliveryDate"
                    type="date"
                    value={product.deliveryDate}
                    onChange={handleChange}
                />
                <TextInput
                    label="تاريخ الترجيع"
                    name="returnDate"
                    type="date"
                    value={product.returnDate}
                    onChange={handleChange}
                />
                <TextInput
                    label="مكان الاستلام"
                    name="deliveryLocation"
                    placeholder="مكان استلام الفستان"
                    value={product.deliveryLocation}
                    onChange={handleChange}
                />
                <TextInput
                    label="السعر"
                    name="price"
                    type="number"
                    placeholder="السعر الكامل"
                    value={product.price}
                    onChange={handleChange}
                />
                <TextInput
                    label="الباقي"
                    name="remainingAmount"
                    type="number"
                    placeholder="المبلغ المتبقي"
                    value={product.remainingAmount}
                    onChange={handleChange}
                />
                <UploadImage
                    name="image"
                    id="image"
                    setImage={handleImageChange}
                    existingImages={product.image}
                />
                <div>
                    <label htmlFor="description" className='block text-sm font-medium text-gray-700'>وصف الفستان</label>
                    <textarea
                        name="description"
                        id="description"
                        className='add-product-InputCSS'
                        value={product.description}
                        placeholder='أكتب وصفًا للفستان'
                        onChange={handleChange}
                    ></textarea>
                </div>
                <div>
                    <button type='submit' className='add-product-btn' disabled={isUpdating}>
                        {isUpdating ? "جاري التحديث..." : "تحديث الفستان"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProduct;