"use client";

import { MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";

export default function WhatsAppFloat() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the button after a short delay
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const message =
      "Hi! I'm browsing your hardware store website. Can you help me?";
    const whatsappUrl = `https://wa.me/917872926780?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Tooltip */}
      <div className="absolute bottom-16 right-0 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        Chat with us on WhatsApp
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
}
