import Link from 'next/link';

export default function BBCLogo() {
  return (
    <Link href="/">
        <div className="flex items-center gap-1">
            <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold text-xl">B</div>
            <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold text-xl">B</div>
            <div className="bg-black text-white w-8 h-8 flex items-center justify-center font-bold text-xl">C</div>
        </div>
    </Link>
  );
}
