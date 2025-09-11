import Header from './components/Header'
import Hero from './components/Hero'
import CategoryGrid from './components/CategoryGrid'
import FeaturedProducts from './components/FeaturedProducts'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}