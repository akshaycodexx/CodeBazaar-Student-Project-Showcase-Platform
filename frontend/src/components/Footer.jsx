import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 pt-12 pb-8">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold text-primary-dark font-heading mb-4">CodeBazaar</h3>
            <p className="text-neutral-500 text-sm">
              Showcase your projects, connect with peers, and get recognized by recruiters.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-neutral-800 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><a href="#" className="hover:text-primary transition-colors">Browse Projects</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Hackathons</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Mentorship</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-800 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-neutral-500">
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-neutral-800 mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-8 text-center text-sm text-neutral-400">
          <p>© {new Date().getFullYear()} CodeBazaar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
