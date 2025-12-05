import SEO from '@/components/ui/SEO'
import React from 'react'
import DeliveriesList from '@/components/DeliveriesList';

const Home: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            {/* Seo components */}
            <SEO
                title='Suivi des Livraisons en Temps Réel'
                description='Plateforme de suivi des livraisons pour les clients et les livreurs'
            />

            {/* En-tête */}
            <header className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Tableau de Bord des Livraisons</h1>
                <p className="text-gray-600">Suivez l'état de vos livraisons en temps réel</p>
            </header>

            {/* Section principale */}
            <main>
                <DeliveriesList />
            </main>

            {/* Pied de page */}
            <footer className="mt-12 text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} Plateforme de Suivi des Livraisons</p>
            </footer>
        </div>
    )
}

export default Home
