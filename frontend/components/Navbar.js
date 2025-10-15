import Link from 'next/link';
import { useState } from 'react';
import MenuIcon from './ui/MenuIcon';
import UserIcon from './ui/UserIcon';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'News', href: '/category/news' },
    { name: 'Sport', href: '/category/sport' },
    { name: 'Business', href: '/category/business' },
    { name: 'Innovation', href: '/category/innovation' },
    { name: 'Culture', href: '/category/culture' },
    { name: 'Arts', href: '/category/arts' },
    { name: 'Travel', href: '/category/travel' },
    { name: 'Earth', href: '/category/earth' },
  ];

  const handleMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // For now, just log the search - you can implement navigation to search results page
      console.log('Searching for:', searchQuery);
      // TODO: Navigate to search results page or show results in a modal
    }
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
            <form onSubmit={handleSearchSubmit} className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="px-3 py-1 pr-8 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
          </div>

          <Link href="/" className="text-3xl font-serif font-bold text-black uppercase tracking-wider hover:text-gray-800 transition-colors">
            The Mandate Wire
          </Link>

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
