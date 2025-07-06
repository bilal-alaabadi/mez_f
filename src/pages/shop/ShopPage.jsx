import React, { useState } from 'react';
import ProductCards from './ProductCards';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const ShopPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [ProductsPerPage] = useState(8);

    const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading } = useFetchAllProductsQuery({
        category: '',
        page: currentPage,
        limit: ProductsPerPage,
    });

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    if (isLoading) return <div className="text-center py-8">جاري التحميل...</div>;
    if (error) return <div className="text-center py-8 text-red-500">حدث خطأ أثناء تحميل المنتجات</div>;

    const startProduct = (currentPage - 1) * ProductsPerPage + 1;
    const endProduct = startProduct + products.length - 1;

    return (
        <>
            <section className='section__container bg-[#f8d7d0]'>
                <h2 className='section__header capitalize'>صفحة الفساتين</h2>
                <p className='section__subheader'> </p>
            </section>

            <section className='section__container'>
                <div className='flex-1'>

                    
                    {products.length > 0 ? (
                        <>
                            <ProductCards products={products} />
                            
                            <div className='mt-6 flex justify-center'>
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md mr-2 disabled:opacity-50'
                                >
                                    السابق
                                </button>

                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`px-4 py-2 mx-1 rounded-md ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md ml-2 disabled:opacity-50'
                                >
                                    التالي
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-lg text-gray-500">لا توجد منتجات متاحة</p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default ShopPage;