import React from "react";
import { Link } from "react-router-dom";

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4">
          <div className="text-center md:text-left order-1 md:order-1">
            <p className="text-sm text-gray-400">
              &copy; {currentYear} FearLog. All rights reserved.
            </p>
          </div>
          <div className="order-0 md:order-2">
            {/* Contact moved to header menu */}
          </div>
          <div className="flex gap-4 order-2 md:order-3">
            <Link
              to="/privacy"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
