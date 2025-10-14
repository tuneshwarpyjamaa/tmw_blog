import Link from 'next/link';
import BBCLogo from './ui/BBCLogo';

export default function Footer() {
  return (
    <footer className="border-t-4 border-black mt-12 py-8 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="pb-6 border-b border-gray-300">
          <BBCLogo />
        </div>

        <div className="text-sm text-gray-700 pt-6">
          <p>Copyright {new Date().getFullYear()} TMW Blog. All rights reserved.</p>
          <p>This is a fictional website for demonstration purposes.</p>
        </div>
      </div>
    </footer>
  );
}
