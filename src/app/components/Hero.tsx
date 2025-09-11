'use client';

import { Button } from './ui/button'
import { Truck, Clock, Shield, Phone } from 'lucide-react'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-orange-300 to-orange-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Your Trusted
              <span className="block text-yellow-300">Hardware Partner</span>
            </h1>
            <p className="text-xl text-orange-100 leading-relaxed">
              Quality hardware products for all your construction and home improvement needs. 
              Serving Gairkata and Jalpaiguri with pride since 2010.
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="flex items-center gap-3">
                <Truck className="h-8 w-8 text-yellow-300" />
                <div>
                  <p className="font-semibold">Free Delivery</p>
                  <p className="text-sm text-orange-200">Within 10km radius</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-300" />
                <div>
                  <p className="font-semibold">Same Day</p>
                  <p className="text-sm text-orange-200">Delivery available</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-yellow-300" />
                <div>
                  <p className="font-semibold">Quality Assured</p>
                  <p className="text-sm text-orange-200">Genuine products only</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-8 w-8 text-yellow-300" />
                <div>
                  <p className="font-semibold">Expert Support</p>
                  <p className="text-sm text-orange-200">Call us anytime</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                Shop Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-orange-600"
                onClick={() => window.open('https://wa.me/917872926780?text=Hi! I need help with hardware products.', '_blank')}
              >
                WhatsApp Us
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Hardware store interior"
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-6 rounded-xl shadow-xl">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-lg">15+ Years</p>
                  <p className="text-sm text-gray-600">Trusted Service</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
