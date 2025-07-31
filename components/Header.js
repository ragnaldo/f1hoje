import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-[#15151e] shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-black text-white tracking-wider">
          <Link href="/" className="hover:text-[#e10600] transition-colors">F1<span className="text-[#e10600]">HOJE</span>.COM</Link>
        </h1>
        <nav className="hidden md:flex space-x-8">
          <Link href="/calendario" className="text-white font-bold hover:text-[#e10600] transition-colors">Calendário</Link>
          <Link href="/noticias" className="text-white font-bold hover:text-[#e10600] transition-colors">Notícias</Link>
          <Link href="/classificacao" className="text-white font-bold hover:text-[#e10600] transition-colors">Classificação</Link>
          <Link href="/equipes-pilotos" className="text-white font-bold hover:text-[#e10600] transition-colors">Equipas e Pilotos</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
