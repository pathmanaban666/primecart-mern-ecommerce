import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

function ProductList({ isAuthenticated }) {
  const [products, setProducts] = useState([]);
  const [filterProduct, setFilterProduct] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
        setFilteredProducts(res.data);

        const initialQuantities = {};
        res.data.forEach(product => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (error) {
        toast.error('Failed to load products. Please try again.', {
          position: 'top-center',
          autoClose: 5000,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };

    fetchProducts();
  }, []);

  const increment = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const decrement = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));
  };

  const addToCart = async (productId) => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { toastMessage: 'Please login to purchase item' },
      });
      return;
    }

    const quantity = quantities[productId] || 1;

    try {
      const res = await api.post('cart', { productId, quantity });
      toast.success(res.data?.message || 'Added to cart successfully!', {
        position: 'top-center',
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      toast.error('Failed to add product to cart. Please try again.', {
        position: 'top-center',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(filterProduct.toLowerCase())
    );
    setFilteredProducts(filtered);
    setIsSearchSubmitted(true);

    if (filtered.length === 0) {
      toast.info('No products matched your search.', {
        position: 'top-center',
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleClear = () => {
    setFilterProduct('');
    setFilteredProducts(products);
    setIsSearchSubmitted(false);
  };

  return (
    <>
      <div className="flex justify-between items-center px-8 mt-4 flex-wrap gap-4">
        <h1 className="text-4xl lg:mx-12 font-bold">Products</h1>
        <form onSubmit={handleSubmit} className="flex mr-12 gap-2 items-center">
          <input
            type="text"
            value={filterProduct}
            onChange={(e) => setFilterProduct(e.target.value)}
            placeholder="Search products..."
            className="p-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
          {isSearchSubmitted && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 bg-gray-400 rounded-lg hover:bg-gray-500 transition flex items-center justify-center"
              aria-label="Clear search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </form>
      </div>

      <div className="pt-8 mx-6 lg:mx-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(p => (
            <ProductCard
              key={p._id}
              product={p}
              addToCart={addToCart}
              increment={() => increment(p._id)}
              decrement={() => decrement(p._id)}
              quantity={quantities[p._id] || 1}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">No products found.</p>
        )}
      </div>

      <ToastContainer />
    </>
  );
}

export default ProductList;
