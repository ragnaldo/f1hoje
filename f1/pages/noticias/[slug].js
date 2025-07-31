import React from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// A página que será renderizada para um artigo específico
export default function NewsArticlePage({ post }) {
    const router = useRouter();

    // Mostra uma mensagem de carregamento enquanto a página é gerada
    if (router.isFallback) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="bg-white font-sans">
            <Header />
            <main className="container mx-auto mt-8">
                <article className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl lg:text-5xl font-black text-[#15151e] my-4" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    {/* Renderiza o conteúdo do post que vem do WordPress */}
                    <div className="prose lg:prose-xl max-w-none" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
                </article>
            </main>
            <Footer />
        </div>
    );
}

// Função para dizer ao Next.js quais URLs de notícias pré-construir
export async function getStaticPaths() {
    const res = await fetch("https://admin.f1hoje.com/wp-json/wp/v2/posts?per_page=20"); // Pega os 20 posts mais recentes para gerar no build
    const posts = res.ok ? await res.json() : [];
    const paths = posts.map(post => ({ 
        params: { slug: post.slug },
    }));
    
    return { 
        paths, 
        fallback: 'blocking' // Se a notícia não foi pré-construída, o Next.js a gera na hora
    };
}

// Função para buscar os dados de UM post específico, baseado no slug do URL
export async function getStaticProps({ params }) {
    const res = await fetch(`https://admin.f1hoje.com/wp-json/wp/v2/posts?slug=${params.slug}&_embed`);
    const post = await res.json();

    return { 
        props: { post: post[0] }, 
        revalidate: 3600 // Revalida a cada hora
    };
}
