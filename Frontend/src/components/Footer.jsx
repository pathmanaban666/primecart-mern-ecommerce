const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col pt-8 space-y-6 justify-center mt-auto mb-4">
      <p className="text-center text-gray-700 font-medium">
        Designed by Pathmanaban. &copy; {currentYear} PrimeCart Pvt Ltd. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;