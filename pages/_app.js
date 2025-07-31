import '../styles/globals.css';

// Este componente App é o componente raiz que envolve todas as suas páginas.
// Ao importar o globals.css aqui, garantimos que os estilos do Tailwind
// são aplicados a todo o site.

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
