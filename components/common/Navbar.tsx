'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, Mail } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Granites', href: '/granites' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-1 rounded-lg">
              <Image
  src="/images/logo/logomkd.jpeg"
  alt="MaaKelaDevi Logo"
  width={40}
  height={40}
  className="rounded"
/>
            </div>
            <span className="text-xl font-bold text-gray-900">
              MaaKelaDevi <span className="text-amber-600">Marble house</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Contact Info */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>+91 9315099107</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4" />
                <span>shivambansal1284@gmail.com</span>
              </div>
            </div>

            {/* Admin Link */}
            <Link
              href="/admin"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-gray-500 px-4 py-2 rounded-lg 
                       font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-amber-600 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-amber-600 hover:bg-gray-50 
                           rounded-md font-medium transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/admin"
                className="block px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 
                         rounded-md font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Admin Panel
              </Link>
              
              {/* Mobile Contact Info */}
              <div className="px-3 py-2 space-y-2 border-t border-gray-200 mt-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>+91 9350942565</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>brijeshbansal263@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}