import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

const ProximoEvento = ({ data }) => (
  <section className="bg-white rounded-lg shadow-xl p-6 mb-12 border-l-8 border-[#e10600]">
    <h2 className="text-3xl font-bold text-[#15151e] mb-4">Próximo Evento: {data.nome}</h2>
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <p className="text-lg text-gray-600 mb-4">{data.circuito}</p>
        <div className="bg-gray-100 p-4 rounded-md">
          <h4 className="font-bold text-lg mb-2">Data da Corrida</h4>
          <p className="text-xl">{new Date(data.data).toLocaleDateString('pt-PT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-[#15151e] text-white rounded-md p-6">
        <p className="text-lg font-semibold">Horário da Corrida (Brasília)</p>
        <div className="text-5xl font-black tracking-widest">{data.hora.substring(0, 5)}</div>
      </div>
    </div>
  </section>
);

const UltimasNoticias = ({ noticias }) => (
  <section>
    <h2 className="text-3xl font-bold text-[#15151e] mb-4 border-b-4 border-[#e10600] pb-2">Últimas Notícias</h2>
    <div className="grid md:grid-cols-3 gap-8">
      {noticias.map(noticia => (
        <Link key={noticia.id} href={noticia.url} className="block bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
          <img src={noticia.imagem} alt={noticia.titulo} className="h-48 w-full object-cover" />
          <div className="p-5">
            <h3 className="font-bold text-xl mb-2 group-hover:text-[#e10600] transition-colors" dangerouslySetInnerHTML={{ __html: noticia.titulo }} />
            <div className="text-gray-600 text-sm" dangerouslySetInnerHTML={{ __html: noticia.resumo }} />
          </div>
        </Link>
      ))}
    </div>
  </section>
);

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

export async function getStaticProps() {
  const F1_API_URL = "https://api.jolpi.ca/ergast/f1/current/next.json";
  const WORDPRESS_API_URL = "https://admin.f1hoje.com/wp-json/wp/v2/posts?per_page=3&_embed";

  try {
    const [f1Res, wordpressRes] = await Promise.all([
      fetch(F1_API_URL),
      fetch(WORDPRESS_API_URL),
    ]);

    const f1Data = await f1Res.json();
    const raceInfo = f1Data.MRData.RaceTable.Races[0];
    const proximoEvento = {
      nome: raceInfo.raceName,
      circuito: raceInfo.Circuit.circuitName,
      data: raceInfo.date,
      hora: raceInfo.time,
    };

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
    }

    return {
      props: { proximoEvento, ultimasNoticias: noticiasMapeadas },
      revalidate: 600,
    };
  } catch (error) {
    console.error("Falha ao buscar dados para a Homepage:", error);
    return { props: { proximoEvento: null, ultimasNoticias: [] } };
  }
}
