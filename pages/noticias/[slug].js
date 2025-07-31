import React from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function ArticlePage({ post }) {
    const router = useRouter();
    if (router.isFallback) return <div>A carregar...</div>;

    return (
        <div className="bg-white font-sans">
            <Header />
            <main className="container mx-auto mt-8">
                <article className="max-w-4xl mx-auto px-4">
                    <h1 className="text-4xl lg:text-5xl font-black text-[#15151e] my-4" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                    <div className="text-lg text-gray-500 mb-8">
                        <span>Publicado em {new Date(post.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    </div>
                    {post.imagem && <img src={post.imagem} alt={post.title.rendered} className="w-full h-auto rounded-lg shadow-lg mb-8" />}
                    <div className="prose lg:prose-xl max-w-none" dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
                </article>
            </main>
            <Footer />
        </div>
    );
}

export async function getStaticPaths() {
    const res = await fetch("https://admin.f1hoje.com/wp-json/wp/v2/posts?per_page=20");
    const posts = res.ok ? await res.json() : [];
    const paths = posts.map(post => ({ params: { slug: post.slug } }));
    return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
    const res = await fetch(`https://admin.f1hoje.com/wp-json/wp/v2/posts?slug=${params.slug}&_embed`);
    const postArray = res.ok ? await res.json() : [];
    
    if (!postArray || postArray.length === 0) {
        return { notFound: true };
    }

    const post = postArray[0];
    post.imagem = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || null;

    return { 
        props: { post }, 
        revalidate: 3600 
    };
}
