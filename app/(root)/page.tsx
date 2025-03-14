import ProductList from '@/components/shared/prodact/prodact-list';
import sampleData from '@/db/sample-data';

const HomePage = () => {
    return (
      <>
        <ProductList data={sampleData.products} title='Newest Arrivals' limit={4} />
      </>
    )
};

export default HomePage;