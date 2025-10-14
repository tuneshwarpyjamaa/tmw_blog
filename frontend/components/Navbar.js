import Link from 'next/link';
import { useState } from 'react';
import BBCLogo from './ui/BBCLogo';
import MenuIcon from './ui/MenuIcon';
import SearchIcon from './ui/SearchIcon';
import UserIcon from './ui/UserIcon';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Technology', href: '/category/technology' },
    { name: 'News', href: '/category/news' },
  ];

  const handleMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearchClick = () => {
    console.log('Search icon clicked');
    // Future implementation for search functionality
  };

  const handleUserIconClick = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className="border-b border-gray-300">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <button className="focus:outline-none md:hidden" onClick={handleMenuClick}>
              <MenuIcon />
            </button>
            <button className="focus:outline-none hidden md:block" onClick={handleSearchClick}>
              <SearchIcon />
            </button>
          </div>

          <BBCLogo />

          <div className="flex items-center gap-4 relative">
            <Link href="/register" className="bg-black text-white px-4 py-2 text-sm font-bold hidden md:block">Register</Link>
            <Link href="/login" className="px-4 py-2 text-sm font-bold border border-gray-400 hidden md:block">Sign In</Link>
            <button className="focus:outline-none md:hidden" onClick={handleUserIconClick}>
              <UserIcon />
            </button>
            {isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 md:hidden">
                <Link href="/register" className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100">Register</Link>
                <Link href="/login" className="block px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100">Sign In</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom navigation bar (Desktop) */}
      <div className="border-t border-gray-300 hidden md:block">
          <div className="container mx-auto px-4">
              <nav className="flex items-center justify-center gap-6 text-sm font-bold py-3">
                  {navLinks.map(link => (
                      <Link key={link.name} href={link.href} className="hover:underline">{link.name}</Link>
                  ))}
              </nav>
          </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-gray-300 md:hidden">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col gap-4 text-sm font-bold">
              {navLinks.map(link => (
                <Link key={link.name} href={link.href} className="hover:underline py-2 border-b border-gray-200">{link.name}</Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
