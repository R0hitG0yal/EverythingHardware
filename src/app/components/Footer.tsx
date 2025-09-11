"use client";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-orange-600 text-white p-2 rounded-lg">
                <div className="w-6 h-6 flex items-center justify-center font-bold">
                  HG
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">Hardware Galaxy</h3>
                <p className="text-sm text-gray-400">
                  Your Local Hardware Store
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Serving the Gairkata and Jalpaiguri community with quality
              hardware products and exceptional service since 2010.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <MessageCircle className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/category/plumbing"
                  className="text-gray-400 hover:text-white"
                >
                  Plumbing
                </Link>
              </li>
              <li>
                <Link
                  href="/category/electrical"
                  className="text-gray-400 hover:text-white"
                >
                  Electrical
                </Link>
              </li>
              <li>
                <Link
                  href="/category/paints"
                  className="text-gray-400 hover:text-white"
                >
                  Paints & Colors
                </Link>
              </li>
              <li>
                <Link
                  href="/category/tools"
                  className="text-gray-400 hover:text-white"
                >
                  Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/category/building-materials"
                  className="text-gray-400 hover:text-white"
                >
                  Building Materials
                </Link>
              </li>
              <li>
                <Link
                  href="/category/hardware"
                  className="text-gray-400 hover:text-white"
                >
                  Hardware
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-orange-400" />
                <span className="text-gray-400">+91 78729 26780</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-orange-400" />
                <span className="text-gray-400">goyalrohit833@gmail.com</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-orange-400 mt-0.5" />
                <span className="text-gray-400">
                  Hindupara Road, Near Bus Stand
                  <br />
                  Gairkata, Jalpaiguri - 735212
                  <br />
                  West Bengal, India
                </span>
              </div>
            </div>
          </div>

          {/* Store Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Store Hours</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-orange-400" />
                <div className="text-gray-400">
                  <p>Mon - Sat: 8:00 AM - 8:00 PM</p>
                  <p>Sunday: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
            <div className="bg-orange-600 text-white p-4 rounded-lg">
              <p className="font-semibold text-sm">Need urgent help?</p>
              <p className="text-xs mb-2">WhatsApp us anytime!</p>
              <button
                className="bg-white text-orange-600 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100"
                onClick={() =>
                  window.open(
                    "https://wa.me/917872926780?text=Hi! I need urgent help with hardware products.",
                    "_blank"
                  )
                }
              >
                Chat Now
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; 2024 Hardware Galaxy. All rights reserved. | Designed for
            local businesses with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
