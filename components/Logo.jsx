"use client"

import Link from 'next/link';

const Logo = () => {
  return (
    <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
      <div className="w-8 h-8 bg-[#322543bd] rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-sm">TR</span>
      </div>
      <span className="text-white font-semibold">Tokenizer.</span>
    </Link>
  );
};

export default Logo;
