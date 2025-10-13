import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">TMW Blog</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/">Home</Link>
          <Link href="/category/technology">Technology</Link>
          <Link href="/category/news">News</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
