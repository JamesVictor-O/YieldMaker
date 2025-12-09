"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? "border-gray-200 dark:border-[#28392f] bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md shadow-sm"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-primary group-hover:scale-110 transition-transform duration-300">
              <Image src="/Logo3.png" alt="Logo" width={24} height={24} />
            </div>
            <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">
              Yieldmaker
            </h2>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-slate-600 hover:text-primary dark:text-gray-300 dark:hover:text-white text-sm font-medium transition-colors"
            >
              How it Works
            </a>
            <a
              href="#features"
              className="text-slate-600 hover:text-primary dark:text-gray-300 dark:hover:text-white text-sm font-medium transition-colors"
            >
              Features
            </a>
            <a
              href="#faq"
              className="text-slate-600 hover:text-primary dark:text-gray-300 dark:hover:text-white text-sm font-medium transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hidden sm:flex">
              <Button size="sm">Launch App</Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="md:hidden text-slate-600 dark:text-gray-300 hover:text-primary transition-colors focus:outline-none p-1.5 rounded-md"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background-light dark:bg-background-dark border-b border-gray-200 dark:border-[#28392f] p-4 shadow-xl animate-in slide-in-from-top-5">
          <nav className="flex flex-col space-y-4">
            <a
              href="#how-it-works"
              className="text-slate-600 dark:text-gray-300 hover:text-primary font-medium p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How it Works
            </a>
            <a
              href="#features"
              className="text-slate-600 dark:text-gray-300 hover:text-primary font-medium p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#faq"
              className="text-slate-600 dark:text-gray-300 hover:text-primary font-medium p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full">Launch App</Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
