import React from "react";
import dp1 from "../../assets/dp1.jpg";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* Brand Info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src={dp1}
              alt="Digital Pathshala"
              className="w-12 h-12 rounded-full"
            />
            <h3 className="text-white font-bold text-lg">Digital Pathshala</h3>
          </div>
          <p className="text-sm leading-6 mb-4">
            Empowering digital futures through quality education.
          </p>

          <div className="text-sm space-y-2">
            <p>
              <span className="font-semibold">Location:</span> Itahari, Sunsari, Koshi Province
            </p>
            <p>
              <span className="font-semibold">Phone:</span>
              <a href="tel:+9779816366094" className="hover:text-white ml-1">9816366094</a>,
              <a href="tel:+9779824345939" className="hover:text-white ml-1">9824345939</a>
            </p>
            <p>
              <span className="font-semibold">Email:</span>
              <a href="mailto:digitalpathshalanp@gmail.com" className="hover:text-white ml-1">
                digitalpathshalanp@gmail.com
              </a>
            </p>
            <p>
              <span className="font-semibold">Website:</span>
              <a
                href="https://digitalpathshalanepal.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white ml-1"
              >
                digitalpathshalanepal.com
              </a>
            </p>
          </div>
        </div>

        {/* Useful Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm border-t border-gray-700 pt-6">
          <div>
            <h4 className="text-white font-bold mb-3">Products</h4>
            <ul className="space-y-2">
              <li><a href="/courses" className="hover:text-white">Courses</a></li>
              <li><a href="/teams" className="hover:text-white">Teams</a></li>
              <li><a href="/advertising" className="hover:text-white">Advertising</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">Help</h4>
            <ul className="space-y-2">
              <li><a href="/help" className="hover:text-white">Help Center</a></li>
              <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">Company</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/careers" className="hover:text-white">Work Here</a></li>
              <li><a href="/press" className="hover:text-white">Press</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 py-4 text-center text-sm">
          <p className="mb-2">
            Copyright © {new Date().getFullYear()} Digital Pathshala. All rights reserved.
          </p>
          <div className="space-x-3">
            <a href="/terms" className="hover:text-white">Terms & Conditions</a>
            <span>|</span>
            <a href="/privacy" className="hover:text-white">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
