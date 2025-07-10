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
        <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">إضافة فستان جديد</h2>
            <form onSubmit={handleSubmit}>
                <table className="w-full border-collapse">
                    <tbody>
                        {/* الصف الأول */}
                        <tr className="border-b">
                            <td className="py-4 px-2 w-1/2">
                                <TextInput
                                    label="اسم الفستان"
                                    name="name"
                                    placeholder="أكتب اسم الفستان"
                                    value={product.name}
                                    onChange={handleChange}
                                />
                            </td>
                            <td className="py-4 px-2 w-1/2">
                                <TextInput
                                    label="التاريخ"
                                    name="date"
                                    type="date"
                                    value={product.date}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        
                        {/* الصف الثاني */}
                        <tr className="border-b">
                            <td className="py-4 px-2">
                                <TextInput
                                    label="تاريخ الاستلام"
                                    name="deliveryDate"
                                    type="date"
                                    value={product.deliveryDate}
                                    onChange={handleChange}
                                />
                            </td>
                            <td className="py-4 px-2">
                                <TextInput
                                    label="تاريخ الترجيع"
                                    name="returnDate"
                                    type="date"
                                    value={product.returnDate}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        
                        {/* الصف الثالث */}
                        <tr className="border-b">
                            <td className="py-4 px-2">
                                <TextInput
                                    label="مكان الاستلام"
                                    name="deliveryLocation"
                                    placeholder="مكان استلام الفستان"
                                    value={product.deliveryLocation}
                                    onChange={handleChange}
                                />
                            </td>
                            <td className="py-4 px-2">
                                <TextInput
                                    label="السعر"
                                    name="price"
                                    type="number"
                                    placeholder="السعر الكامل"
                                    value={product.price}
                                    onChange={handleChange}
                                />
                            </td>
                        </tr>
                        
                        {/* الصف الرابع */}
                        <tr className="border-b">
                            <td className="py-4 px-2">
                                <TextInput
                                    label="الباقي"
                                    name="remainingAmount"
                                    type="number"
                                    placeholder="المبلغ المتبقي"
                                    value={product.remainingAmount}
                                    onChange={handleChange}
                                />
                            </td>
                            <td className="py-4 px-2">
                                <UploadImage
                                    name="image"
                                    id="image"
                                    setImage={setImage}
                                />
                            </td>
                        </tr>
                        
                        {/* الصف الخامس - الوصف (يشغل عمودين) */}
                        <tr>
                            <td colSpan="2" className="py-4 px-2">
                                <div>
                                    <label htmlFor="description" className='block text-sm font-medium text-gray-700'>وصف الفستان</label>
                                    <textarea
                                        name="description"
                                        id="description"
                                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                        rows="4"
                                        value={product.description}
                                        placeholder='أكتب وصفًا للفستان'
                                        onChange={handleChange}
                                    ></textarea>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <div className="mt-6 text-center">
                    <button 
                        type='submit' 
                        className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                        disabled={isLoading}
                    >
                        {isLoading ? "جاري الإضافة..." : "إضافة فستان"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;