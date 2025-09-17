import { useState, useEffect } from "react";
import api from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [cardDetails, setCardDetails] = useState({
    name: "",
    number: "",
    exp: "",
    cvv: "",
  });
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart");
        setCartItems(res.data || []);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401) {
          toast.error("Access denied. Please log in first.", {
            position: "top-center",
            autoClose: 5000,
            pauseOnHover: true,
            draggable: true,
          });
          navigate("/login");
          return;
        }
        toast.error("Failed to load cart items.", {
          position: "top-center",
          autoClose: 5000,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };
    fetchCart();
  }, [navigate]);

  const handleCardChange = (e) =>
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });

  const handleShippingChange = (e) =>
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });

  const getCartTotal = () =>
    cartItems.reduce(
      (total, item) => total + (item.product?.price || 0) * item.quantity,
      0
    );

  const isValidCardNumber = (num) => /^\d{16}$/.test(num.replace(/\s/g, ""));
  const isValidExp = (exp) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(exp);
  const isValidCVV = (cvv) => /^\d{3,4}$/.test(cvv);
  const isValidPhoneNumber = (phone) => /^\+?[0-9]{7,15}$/.test(phone.trim());
  const isValidPostalCode = (postalCode) => /^[0-9A-Za-z\s-]{3,10}$/.test(postalCode.trim());

  const handlePayment = async () => {
    for (const key in shippingDetails) {
      if (!shippingDetails[key]) {
        return toast.error(
          `Please fill in your ${key.replace(/([A-Z])/g, " $1").toLowerCase()}.`,
          {
            position: "top-center",
            autoClose: 5000,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    }

    if (!isValidPhoneNumber(shippingDetails.phone)) {
      return toast.error("Invalid phone number.", {
        position: "top-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
      });
    }

    if (!isValidPostalCode(shippingDetails.postalCode)) {
      return toast.error("Invalid postal code.", {
        position: "top-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
      });
    }

    if (!cardDetails.name || !cardDetails.number || !cardDetails.exp || !cardDetails.cvv) {
      return toast.error("Please fill in all card details.", {
        position: "top-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
      });
    }

    if (!isValidCardNumber(cardDetails.number)) {
      return toast.error("Invalid card number.", {
        position: "top-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
      });
    }
    if (!isValidExp(cardDetails.exp)) {
      return toast.error("Invalid expiry date. Use MM/YY.", {
        position: "top-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
      });
    }
    if (!isValidCVV(cardDetails.cvv)) {
      return toast.error("Invalid CVV.", {
        position: "top-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
      });
    }

    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPaymentSuccess(true);
      await api.delete("/cart/clear");
      setCartItems([]);
      setCardDetails({ name: "", number: "", exp: "", cvv: "" });
      setShippingDetails({
        fullName: "",
        address: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
      });
    } catch (err) {
      console.error("Payment or cart clear failed:", err);
      toast.error("Payment succeeded but cart cleanup failed.", {
        position: "top-center",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center mt-12 justify-center py-20">
        <svg
          className="w-16 h-16 text-green-500 mb-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <h2 className="text-2xl font-semibold  text-slate-900 mb-2">
          Payment Successful 🎉
        </h2>
        <p className="text-gray-600 text-justify mx-6 mb-6">
          Thank you for your order. Your payment has been processed.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <div className="text-center py-12 text-gray-600">Your cart is empty.</div>;
  }

  return (
    <div className="bg-white p-4 mt-4 lg:ms-20">
      <div className="md:max-w-5xl max-w-xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 order-1">
            <h2 className="text-3xl font-semibold text-slate-900">
              Shipping Address And Payment Info
            </h2>
            <div className="mt-8 max-w-lg">
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "fullName", placeholder: "Full Name", maxLength: 50 },
                  { name: "phone", placeholder: "Phone Number", maxLength: 15 },
                  { name: "address", placeholder: "Address", maxLength: 100, span: "col-span-full" },
                  { name: "city", placeholder: "City", maxLength: 50 },
                  { name: "state", placeholder: "State/Province", maxLength: 50 },
                  { name: "postalCode", placeholder: "Postal Code", maxLength: 10 },
                  { name: "country", placeholder: "Country", maxLength: 50 },
                ].map((field) => (
                  <input
                    key={field.name}
                    type="text"
                    name={field.name}
                    placeholder={field.placeholder}
                    value={shippingDetails[field.name]}
                    onChange={handleShippingChange}
                    maxLength={field.maxLength}
                    className={`px-4 py-3.5 bg-gray-100 text-slate-900 text-sm border border-gray-200 rounded-md focus:border-blue-500 focus:bg-transparent outline-0 ${field.span || ""}`}
                  />
                ))}
              </div>

              <div className="mt-8 grid gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Cardholder's Name"
                  value={cardDetails.name}
                  onChange={handleCardChange}
                  maxLength={50}
                  className="px-4 py-3.5 bg-gray-100 text-slate-900 w-full text-sm border border-gray-200 rounded-md focus:border-blue-500 focus:bg-transparent outline-0"
                />
                <input
                  type="text"
                  name="number"
                  placeholder="Card Number"
                  value={cardDetails.number}
                  onChange={handleCardChange}
                  maxLength={19}
                  className="px-4 py-3.5 bg-gray-100 text-slate-900 w-full text-sm border border-gray-200 rounded-md focus:border-blue-500 focus:bg-transparent outline-0"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="exp"
                    placeholder="EXP (MM/YY)"
                    value={cardDetails.exp}
                    onChange={handleCardChange}
                    maxLength={5}
                    className="px-4 py-3.5 bg-gray-100 text-slate-900 text-sm border border-gray-200 rounded-md focus:border-blue-500 focus:bg-transparent outline-0"
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={cardDetails.cvv}
                    onChange={handleCardChange}
                    maxLength={4}
                    className="px-4 py-3.5 bg-gray-100 text-slate-900 text-sm border border-gray-200 rounded-md focus:border-blue-500 focus:bg-transparent outline-0"
                  />
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isSubmitting || cartItems.length === 0}
                className="mt-8 w-40 py-3 text-[15px] font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 tracking-wide"
              >
                {isSubmitting ? "Processing..." : "Pay ₹" + getCartTotal().toFixed(2)}
              </button>
            </div>
          </div>

          <div className="bg-gray-100 p-6 rounded-md">
            <h2 className="text-2xl font-semibold text-slate-900">
              ₹{getCartTotal().toFixed(2)}
            </h2>
            <ul className="text-slate-500 font-medium mt-8 space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between text-sm">
                  {item.product?.name || "Item"} × {item.quantity}
                  <span className="font-semibold text-slate-900">
                    ₹{(item.product?.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
              <li className="flex justify-between text-[15px] font-semibold text-slate-900 border-t border-gray-300 pt-4">
                Total <span>₹{getCartTotal().toFixed(2)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
