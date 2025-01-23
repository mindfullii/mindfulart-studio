import React from 'react';
import { Instagram, Twitter, Facebook, Heart } from 'lucide-react';
import { Container } from '@/components/ui/Container';

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-100">
      {/* Main Footer Content */}
      <Container size="wide" className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-[#1A1A1A] font-garamond text-xl">mindfulART.studio</h3>
            <p className="text-[#717171] text-sm">Where art meets mindfulness</p>
            <div className="flex space-x-4 text-[#88B3BA]">
              <Instagram size={20} className="hover:text-[#6DB889] cursor-pointer" />
              <Twitter size={20} className="hover:text-[#6DB889] cursor-pointer" />
              <Facebook size={20} className="hover:text-[#6DB889] cursor-pointer" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[#4A4A4A] font-medium">Explore</h4>
            <ul className="space-y-2 text-sm text-[#717171]">
              <li className="hover:text-[#6DB889] cursor-pointer">Mindful Coloring</li>
              <li className="hover:text-[#6DB889] cursor-pointer">Meditation Visuals</li>
              <li className="hover:text-[#6DB889] cursor-pointer">Visual Journal</li>
              <li className="hover:text-[#6DB889] cursor-pointer">Blog</li>
            </ul>
          </div>

          {/* Members */}
          <div className="space-y-4">
            <h4 className="text-[#4A4A4A] font-medium">Members</h4>
            <ul className="space-y-2 text-sm text-[#717171]">
              <li className="hover:text-[#6DB889] cursor-pointer">Free Soul</li>
              <li className="hover:text-[#6DB889] cursor-pointer">Peaceful Mind</li>
              <li className="hover:text-[#6DB889] cursor-pointer">Zen Master</li>
              <li className="hover:text-[#6DB889] cursor-pointer">FAQ</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-[#4A4A4A] font-medium">Contact</h4>
            <ul className="space-y-2 text-sm text-[#717171]">
              <li className="hover:text-[#6DB889] cursor-pointer">Support</li>
              <li className="hover:text-[#6DB889] cursor-pointer">Feedback</li>
              <li className="hover:text-[#6DB889] cursor-pointer">Partnership</li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4 md:col-span-1">
            <h4 className="text-[#4A4A4A] font-medium">Sign up for our newsletter</h4>
            <p className="text-sm text-[#717171]">We'll keep you posted on special stuff.</p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Your email..."
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6DB889] focus:border-transparent"
              />
              <button className="w-full px-4 py-2 text-sm text-white bg-[#6DB889] rounded-lg hover:bg-[#5CA978] transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 bg-white">
        <Container size="wide" className="py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-[#717171]">
            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart size={16} className="text-[#6DB889] fill-current" />
              <span>for mindful souls</span>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="hover:text-[#6DB889] cursor-pointer">Privacy Policy</span>
              <span className="hover:text-[#6DB889] cursor-pointer">Terms of Service</span>
              <span>© 2025 mindful.ART</span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};

export default Footer; 