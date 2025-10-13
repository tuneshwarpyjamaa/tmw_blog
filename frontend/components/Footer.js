export default function Footer() {
  return (
    <footer className="border-t py-6 text-center text-sm text-gray-600">
      <div className="container mx-auto px-4">© {new Date().getFullYear()} TMW Blog</div>
    </footer>
  );
}
