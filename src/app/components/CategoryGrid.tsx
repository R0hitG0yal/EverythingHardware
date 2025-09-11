import { Card, CardContent } from './ui/card'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    id: 1,
    name: 'Plumbing',
    slug: 'plumbing',
    image: 'https://images.pexels.com/photos/8486944/pexels-photo-8486944.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Pipes, fittings, taps & more'
  },
  {
    id: 2,
    name: 'Electrical',
    slug: 'electrical',
    image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Wires, switches, lights & fixtures'
  },
  {
    id: 3,
    name: 'Paints & Colors',
    slug: 'paints',
    image: 'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Interior & exterior paints'
  },
  {
    id: 4,
    name: 'Tools',
    slug: 'tools',
    image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Hand tools & power tools'
  },
  {
    id: 5,
    name: 'Building Materials',
    slug: 'building-materials',
    image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Cement, bricks, steel & more'
  },
  {
    id: 6,
    name: 'Hardware',
    slug: 'hardware',
    image: 'https://images.pexels.com/photos/209235/pexels-photo-209235.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Screws, bolts, hinges & locks'
  }
]

export default function CategoryGrid() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
          <p className="text-gray-600">Find everything you need for your projects</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                <CardContent className="p-4 text-center">
                  <div className="relative w-full h-28 mb-3 rounded-lg overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}