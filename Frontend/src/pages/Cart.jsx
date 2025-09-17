import { useState, useEffect } from 'react';
import api from '../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await api.get('/cart');
        setCartItems(res.data || []);
      } catch(err) {
        const status = err?.response?.status;
        if (status === 401) {
        toast.error('Please log in to view your cart items.', {
          position: 'top-center',
          autoClose: 5000,
          pauseOnHover: true,
          draggable: true,
        });
        navigate('/login')
        return; 
        }
        setError('Failed to load cart items.');
        toast.error('Failed to load cart items. Please try again.', {
          position: 'top-center',
          autoClose: 5000,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      await api.delete('/cart', { data: { productId } });
      setCartItems((prev) =>
        prev.filter((item) => item.product?._id !== productId)
      );
      toast.success('Item removed from cart.', {
        position: 'top-center',
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
    }   catch(err) {
        const status = err?.response?.status;
        if (status === 401) {
        toast.error('Please log in to remove your cart items.', {
          position: 'top-center',
          autoClose: 5000,
          pauseOnHover: true,
          draggable: true,
        });
        navigate('/login')
        return; 
        }
        toast.error('Failed to remove item from cart. Please try again.', {
        position: 'top-center',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };
  
  const checkout=()=>{
      navigate('/checkout')
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  if (isLoading) {
    return <div className="text-center py-12 text-lg">Loading cart...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (cartItems.length === 0) {
    return <div className="text-center py-12 text-gray-700">Your cart is empty.</div>;
  }

  return (
    <>
      <div className="p-8 mt-4 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Your Cart</h1>
        <ul className="space-y-8">
          {cartItems.map(({ product, quantity }) => {
            if (!product) return null;

            const totalPrice = (product.price * quantity).toFixed(2);

            return (
              <li
                key={product._id}
                className="flex flex-col sm:flex-row items-center sm:justify-between border-b border-gray-300 pb-6 lg:space-x-28"
              >
                <div className="flex items-center w-full sm:w-auto">
                  <img
                    src={product.image || 'https://via.placeholder.com/150'}
                    alt={product.name || 'Product'}
                    className="ml-2 w-24 h-24 object-cover rounded-md"
                  />
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-gray-800">{product.name || 'Product'}</h3>
                    <p className="text-gray-600 mt-1">Quantity: {quantity}</p>
                    <p className="text-gray-600 mt-1">Price each: ₹{(product.price || 0).toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-4 sm:ml-0 sm:mt-0 flex space-x-16 lg:space-x-20">
                  <span className="text-2xl font-bold text-gray-800">₹{totalPrice}</span>
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="px-5 py-2 bg-red-600 font-semibold text-white rounded-lg hover:bg-red-700 transition"
                    aria-label={`Remove ${product.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="lg:flex lg:justify-between lg:items-center mt-8 pt-6">
          <div className="text-xl font-bold">
            Total: <span>₹{getCartTotal().toFixed(2)}</span>
          </div>
          <button onClick={checkout}
            className="bg-green-600 mt-6 lg:mt-0 text-white font-bold px-4 py-2 rounded hover:bg-green-700 transition"
            aria-label="Proceed to Checkout"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default Cart;
