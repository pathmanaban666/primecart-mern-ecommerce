import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="mt-40 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-bold text-black mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
