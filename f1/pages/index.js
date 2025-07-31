import React from 'react';
import Header from '../components/Header'; // Importando o Header
import Footer from '../components/Footer'; // Importando o Footer

// --- Componentes Específicos da Página ---
const ProximoEvento = ({ data }) => (
  <section className="bg-white rounded-lg shadow-xl p-6 mb-8 border-l-8 border-[#e10600]">
    <h2 className="text-3xl font-bold text-[#15151e] mb-4">Próximo Evento: {data.nome}</h2>
    <p className="text-lg text-gray-600">Circuito: {data.circuito}</p>
    <p className="text-lg text-gray-600">Data: {new Date(data.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', timeZone: 'UTC' })}</p>
  </section>
);

const UltimasNoticias = ({ noticias }) => (
  <section>
    <h2 className="text-2xl font-bold text-[#15151e] mb-4 border-b-4 border-[#e10600] pb-2">Últimas Notícias</h2>
    <div className="grid md:grid-cols-3 gap-6">
      {noticias.map(noticia => (
        <a key={noticia.id} href={noticia.url} className="block bg-white rounded-lg shadow-md overflow-hidden group">
          <img src={noticia.imagem} alt={noticia.titulo} className="h-48 w-full object-cover" />
          <div className="p-5">
            <h3 className="font-bold text-lg mb-2 group-hover:text-[#e10600]" dangerouslySetInnerHTML={{ __html: noticia.titulo }} />
            <div className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: noticia.resumo }} />
          </div>
        </a>
      ))}
    </div>
  </section>
);


// --- Página Principal ---
export default function HomePage({ proximoEvento, ultimasNoticias }) {
  return (
    <div className="bg-[#f0f2f5] font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-6">
        {proximoEvento && <ProximoEvento data={proximoEvento} />}
        {ultimasNoticias?.length > 0 && <UltimasNoticias noticias={ultimasNoticias} />}
      </main>
      <Footer />
    </div>
  );
}

// --- Lógica da API ---
export async function getStaticProps() {
  const F1_API_URL = "https://api.jolpi.ca/ergast/f1/current/next.json";
  // Substitua "SEU_DOMINIO.com" pela URL real do seu WordPress quando estiver no ar
  const WORDPRESS_API_URL = "https://admin.f1hoje.com/wp-json/wp/v2/posts?per_page=3&_embed";

  try {
    const [f1Res, wordpressRes] = await Promise.all([
      fetch(F1_API_URL),
      fetch(WORDPRESS_API_URL), // Esta chamada irá falhar até o WordPress estar configurado
    ]);

    // Tratamento de dados da F1
    const f1Data = await f1Res.json();
    const raceInfo = f1Data.MRData.RaceTable.Races[0];
    const proximoEvento = {
      nome: raceInfo.raceName,
      circuito: raceInfo.Circuit.circuitName,
      data: raceInfo.date,
      hora: raceInfo.time,
    };

    // Tratamento de dados do WordPress
    let noticiasMapeadas = [];
    if (wordpressRes.ok) {
        const ultimasNoticias = await wordpressRes.json();
        noticiasMapeadas = ultimasNoticias.map(post => ({
            id: post.id,
            titulo: post.title.rendered,
            resumo: post.excerpt.rendered,
            url: `/noticias/${post.slug}`,
            imagem: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://placehold.co/600x400'
        }));
    } else {
        console.warn(`A API do WordPress em ${WORDPRESS_API_URL} não está acessível. Usando dados de exemplo.`);
    }


    return {
      props: { proximoEvento, ultimasNoticias: noticiasMapeadas },
      revalidate: 600, // Revalida a cada 10 minutos
    };
  } catch (error) {
    console.error("Falha ao buscar dados para a Homepage:", error);
    // Em caso de erro (ex: WordPress offline), a página ainda funciona com os dados que conseguiu buscar
    return { props: { proximoEvento: null, ultimasNoticias: [] } };
  }
}
