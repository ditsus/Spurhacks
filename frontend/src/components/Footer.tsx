const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Made by Students */}
          <div className="text-sm text-gray-600">
            <span>Made by students</span>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-600">
            © {currentYear} Housely. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;