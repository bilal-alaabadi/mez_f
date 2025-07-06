import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import TextInput from './TextInput';
import UploadImage from './UploadImage';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const { user } = useSelector((state) => state.auth);

    const [product, setProduct] = useState({
        name: '',
        date: '',
        deliveryDate: '',
        returnDate: '',
        deliveryLocation: '',
        price: '',
        remainingAmount: '',
        description: ''
    });
    const [image, setImage] = useState([]);

    const [AddProduct, { isLoading, error }] = useAddProductMutation();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!product.name || !product.price || !product.description || 
            !product.date || !product.deliveryDate || !product.returnDate || 
            !product.deliveryLocation || !product.remainingAmount || 
            image.length === 0) {
            alert('أملأ كل الحقول');
            return;
        }

        try {
            await AddProduct({ ...product, image, author: user?._id }).unwrap();
            alert('تمت أضافة الفستان بنجاح');
            setProduct({
                name: '',
                date: '',
                deliveryDate: '',
                returnDate: '',
                deliveryLocation: '',
                price: '',
                remainingAmount: '',
                description: ''
            });
            setImage([]);
            navigate("/shop");
        } catch (error) {
            console.log("Failed to submit product", error);
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">أضافة فستان جديد</h2>
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
                    setImage={setImage}
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
                    <button type='submit' className='add-product-btn' disabled={isLoading}>
                        {isLoading ? "جاري الإضافة..." : "أضف فستان"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;