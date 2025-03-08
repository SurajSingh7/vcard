const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col  justify-between items-center">
          {/* Company Info */}
          <p className="text-sm text-center md:text-left">
            Copyright © {new Date().getFullYear()} Gigantic Infotel Pvt Ltd. All rights reserved.
          </p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
