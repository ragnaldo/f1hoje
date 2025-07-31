import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';

// Componente para o card de notícia na listagem
const NewsCard = ({ post }) => (
    <Link href={`/noticias/${post.slug}`} className="block bg-white rounded-lg shadow-md overflow-hidden group">
        <img src={post.imagem} alt={post.titulo} className="h-48 w-full object-cover" />
        <div className="p-5">
            <h3 className="font-bold text-lg mb-2 group-hover:text-[#e10600]" dangerouslySetInnerHTML={{ __html: post.titulo }} />
        </div>
    </Link>
);

// A página que será renderizada
export default function NewsListPage({ posts }) {
    return (
        <div className="bg-[#f0f2f5] font-sans">
            <Header />
            <main className="container mx-auto p-4 md:p-6">
                <h2 className="text-3xl font-bold text-[#15151e] mb-4">Últimas Notícias</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map(post => <NewsCard key={post.id} post={post} />)}
                </div>
            </main>
            <Footer />
        </div>
    );
}

// Lógica para buscar os dados de todos os posts no WordPress
export async function getStaticProps() {
    const res = await fetch("https://admin.f1hoje.com/wp-json/wp/v2/posts?per_page=12&_embed");
    const posts = res.ok ? await res.json() : [];
    
    const postsMapeados = posts.map(p => ({
        id: p.id,
        slug: p.slug,
        titulo: p.title.rendered,
        imagem: p._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://placehold.co/600x400'
    }));

    return { 
        props: { posts: postsMapeados }, 
        revalidate: 300 // Revalida a cada 5 minutos
    };
}
