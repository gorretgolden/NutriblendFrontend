import { FaWhatsapp, } from "react-icons/fa";
const NewsletterSection = () => {
  return (
    <div className=" bg-gray-100">
      <div className=" w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <header className="bg-green-500 text-white text-center py-8 px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">SUBSCRIBE TO OUR NEWSLETTER</h1>
          <p className="text-lg mb-6">Want something extra?</p>
          
          <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg">
            <div className="mb-4">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded transition-colors duration-300"
            >
              SUBSCRIBE
            </button>
          </div>
        </header>
        
        {/* Divider */}
        <hr className="border-gray-300 my-10" />
        
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 p-8">
          {/* Trustnet Section */}
          <div>
            <h2 className="text-green-500 text-xl font-semibold mb-4">Trustnet</h2>
            <p className="text-gray-700">
              Trustnet operates as a cooperative financial society, empowering members to unite and merge their savings, thereby granting access to credit for undertaking productive endeavors aimed at enhancing their
            </p>
          </div>
          
          {/* Quick Links Section */}
          <div>
            <h2 className="text-green-500 text-xl font-semibold mb-4">Quick Links</h2>
            <ul className="space-y-2">
              {['Home', 'About Us', 'Apply now', 'Loan Applications', 'Gallery'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="text-gray-700 hover:text-green-500 transition-colors duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Us Section */}
          <div>
            <h2 className="text-green-500 text-xl font-semibold mb-4">Contact Us</h2>
            <address className="not-italic text-gray-700">
              <p>Plot 18, old kampala</p>
              <p className="my-2">Telephone: +256702763217</p>
              <p>Email: markahinbislowe1993@gmail.com</p>
            </address>
          </div>
          
          {/* Social Accounts Section */}
          <div>
            <h2 className="text-green-500 text-xl font-semibold mb-4">Social Accounts</h2>
            <div className="flex flex-wrap gap-4">
              {['Twitter', 'Facebook', 'Instagram', 'YouTube'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="text-green-500 hover:text-green-700 font-medium transition-colors duration-300"
                >
                  {social}
                  <a
                    href="https://wa.me/256755000000"
                    className="fixed w-14 h-14 bottom-10 right-10 bg-[#25d366] text-white rounded-full text-2xl shadow-lg z-50 flex items-center justify-center transition-all hover:bg-[#128C7E] hover:scale-110"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp />
                  </a>
                </a>
                
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection;