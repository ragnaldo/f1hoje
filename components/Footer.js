import React from 'react';

const Footer = () => (
  <footer className="bg-[#15151e] text-gray-400 mt-12 py-8">
    <div className="container mx-auto text-center">
      <p>&copy; {new Date().getFullYear()} f1hoje.com - Todos os direitos reservados.</p>
      <div className="mt-4 space-x-4">
        <a href="/sobre" className="hover:text-white text-sm">Sobre Nós</a>
        <a href="/contato" className="hover:text-white text-sm">Contacto</a>
        <a href="/politica-de-privacidade" className="hover:text-white text-sm">Política de Privacidade</a>
      </div>
    </div>
  </footer>
);

export default Footer;
