import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDeleteProductMutation, useFetchAllProductsQuery } from '../../../../redux/features/products/productsApi';

const ManageProduct = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const { data: { products = [], totalPages, totalProducts } = {}, isLoading, error, refetch } = useFetchAllProductsQuery({
        category: '',
        minPrice: '',
        maxPrice: '',
        page: currentPage,
        limit: productsPerPage,
    });

    const startProduct = (currentPage - 1) * productsPerPage + 1;
    const endProduct = startProduct + products.length - 1;
    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const [deleteProduct] = useDeleteProductMutation();
    const handleDeleteProduct = async (id) => {
        const confirmDelete = window.confirm("هل أنت متأكد أنك تريد حذف هذا المنتج؟");
        if (!confirmDelete) return;
        
        try {
            await deleteProduct(id).unwrap();
            alert("تم حذف المنتج بنجاح");
            await refetch();
        } catch (error) {
            console.error("خطأ في حذف المنتج", error);
        }
    };

    return (
        <section className="py-4 bg-gray-100 text-right w-full">
            <div className="container mx-auto px-2 sm:px-4">
                <div className="bg-white shadow-lg rounded-lg p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold mb-2 sm:mb-0">جميع المنتجات</h3>
                        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">عرض الكل</button>
                    </div>
                    <p className="text-sm text-center sm:text-right">عرض {startProduct} إلى {endProduct} من {totalProducts} منتج</p>
                    {isLoading && <div className="text-center">جاري التحميل...</div>}
                    {error && <div className="text-center text-red-500">حدث خطأ أثناء تحميل المنتجات.</div>}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white shadow-md rounded-lg text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="p-2">رقم</th>
                                    <th className="p-2">اسم الفستان</th>
                                    <th className="p-2">إدارة</th>
                                    <th className="p-2">إجراء</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => (
                                    <tr key={index} className="border-b">
                                        <td className="p-2 text-center">{index + 1}</td>
                                        <td className="p-2 text-center">{product?.name}</td>
                                        <td className="p-2 text-center font-bold text-lg text-blue-500">
                                            <Link to={`/dashboard/update-product/${product._id}`}>تعديل</Link>
                                        </td>
                                        <td className="p-2 text-center">
                                            <button onClick={() => handleDeleteProduct(product._id)} className='bg-red-500 text-white px-2 py-1 rounded text-xs sm:text-sm'>حذف</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className='mt-4 flex justify-center space-x-1 sm:space-x-2'>
                        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className='px-2 py-1 bg-gray-300 rounded text-xs sm:text-sm'>السابق</button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button key={index} onClick={() => handlePageChange(index + 1)} className={`px-2 py-1 rounded text-xs sm:text-sm ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>{index + 1}</button>
                        ))}
                        <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className='px-2 py-1 bg-gray-300 rounded text-xs sm:text-sm'>التالي</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ManageProduct;
