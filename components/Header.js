import React from 'react';

const Header = () => (
  <header className="bg-[#15151e] shadow-lg">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="text-3xl font-black text-white tracking-wider">
        <a href="/" className="hover:text-[#e10600] transition-colors">F1<span className="text-[#e10600]">HOJE</span>.COM</a>
      </h1>
      <nav className="hidden md:flex space-x-8">
        <a href="/calendario" className="text-white font-bold hover:text-[#e10600] transition-colors">Calendário</a>
        <a href="/noticias" className="text-white font-bold hover:text-[#e10600] transition-colors">Notícias</a>
        <a href="/classificacao" className="text-white font-bold hover:text-[#e10600] transition-colors">Classificação</a>
        <a href="/equipes-pilotos" className="text-white font-bold hover:text-[#e10600] transition-colors">Equipes e Pilotos</a>
      </nav>
    </div>
  </header>
);

export default Header;
