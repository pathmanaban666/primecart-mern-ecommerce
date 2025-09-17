import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ isAuthenticated, handleLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-3xl mx-8 font-bold">
        <Link to="/">PrimeCart</Link>
      </h1>

      <nav className="hidden md:flex items-center mr-6">
        <Link to="/" className="mx-4 text-md font-bold">Home</Link>
        <Link to="/products" className="mx-4 text-md font-bold">Products</Link>
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="mx-4 text-md font-bold">Login</Link>
            <Link to="/register" className="mx-4 text-md font-bold">Register</Link>
          </>
        ) : (
          <>
            <Link to="/cart" className="mx-4 text-md font-bold">Cart</Link>
            <Link to="/account" className="mx-4 text-md font-bold">Account</Link>
            <button onClick={handleLogout} className="mx-2 text-md text-white font-bold">Logout</button>
          </>
        )}
      </nav>

      <button
        className="md:hidden mr-4 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open main menu"
      >
        <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"}
          />
        </svg>
      </button>

      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-blue-600 shadow-md md:hidden z-20">
          <ul className="flex flex-col ml-8 space-y-4 p-5 text-white">
            <Link to="/"><li onClick={() => setMenuOpen(false)} className="cursor-pointer hover:text-white font-bold list-none">Home</li></Link>
            <Link to="/products"><li onClick={() => setMenuOpen(false)} className="cursor-pointer hover:text-white font-bold list-none">Products</li></Link>
            {!isAuthenticated ? (
              <>
                <Link to="/login"><li onClick={() => setMenuOpen(false)} className="cursor-pointer hover:text-white font-bold list-none">Login</li></Link>
                <Link to="/register"><li onClick={() => setMenuOpen(false)} className="cursor-pointer hover:text-white font-bold  list-none">Register</li></Link>
              </>
             ) : (
              <>
                <Link to="/cart"><li onClick={() => setMenuOpen(false)} className="cursor-pointer hover:text-white font-bold list-none">Cart</li></Link>
                <Link to="/account"><li onClick={() => {setMenuOpen(false);}} className="cursor-pointer hover:text-white font-bold list-none">Account</li></Link>
                <Link><li onClick={() => {setMenuOpen(false);handleLogout();}} className="cursor-pointer hover:text-white font-bold list-none">Logout</li></Link>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}