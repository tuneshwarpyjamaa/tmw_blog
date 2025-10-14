import Link from 'next/link';
import BBCLogo from './ui/BBCLogo';
import MenuIcon from './ui/MenuIcon';
import SearchIcon from './ui/SearchIcon';

export default function Navbar() {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Technology', href: '/category/technology' },
    { name: 'News', href: '/category/news' },
    { name: 'Admin', href: '/admin' },
  ];

  const handleMenuClick = () => {
    console.log('Menu icon clicked');
    // Future implementation for menu functionality
  };

  const handleSearchClick = () => {
    console.log('Search icon clicked');
    // Future implementation for search functionality
  };

  return (
    <header className="border-b border-gray-300">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-4">
            <button className="focus:outline-none" onClick={handleMenuClick}>
              <MenuIcon />
            </button>
            <button className="focus:outline-none" onClick={handleSearchClick}>
              <SearchIcon />
            </button>
          </div>

          <BBCLogo />

          <div className="flex items-center gap-4">
            <Link href="/register" className="bg-black text-white px-4 py-2 text-sm font-bold">Register</Link>
            <Link href="/login" className="px-4 py-2 text-sm font-bold border border-gray-400">Sign In</Link>
          </div>
        </div>
      </div>

      {/* Bottom navigation bar */}
      <div className="border-t border-gray-300">
          <div className="container mx-auto px-4">
              <nav className="flex items-center justify-center gap-6 text-sm font-bold py-3">
                  {navLinks.map(link => (
                      <Link key={link.name} href={link.href} className="hover:underline">{link.name}</Link>
                  ))}
              </nav>
          </div>
      </div>
    </header>
  );
}
