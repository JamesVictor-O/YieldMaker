import React from 'react'

const Header = () => {
  return (
    <div>
    <header className="fixed top-0 w-full  backdrop-blur-sm shadow-2xl border-b border-gray-600 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
           
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-text-dark">Yieldmaker</span>
                </div>

                
                <nav className="hidden md:flex space-x-8">
                    <a href="#features" className="text-text-light hover:text-primary-blue transition-colors duration-200">Features</a>
                    <a href="#how-it-works" className="text-text-light hover:text-primary-blue transition-colors duration-200">How it Works</a>
                    <a href="#safety" className="text-text-light hover:text-primary-blue transition-colors duration-200">Safety</a>
                </nav>

                <div className="flex items-center space-x-4">
                    <button className="hidden sm:block bg-[#00DBDD] text-white px-6 py-2 rounded hover:bg-[#02b2b5] transition-all duration-200 transform hover:scale-105">
                        Get Early Access
                    </button>
                    
                  
                    <button className="md:hidden p-2">
                        <svg className="w-6 h-6 text-text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinejoin="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        
        <div id="mobile-menu" className="hidden md:hidden bg-[#00DBDD] border-t border-gray-100">
            <div className="px-4 py-4 space-y-3">
                <a href="#features" className="block text-text-light hover:text-primary-blue transition-colors">Features</a>
                <a href="#how-it-works" className="block text-text-light hover:text-primary-blue transition-colors">How it Works</a>
                <a href="#safety" className="block text-text-light hover:text-primary-blue transition-colors">Safety</a>
                <button className="w-full bg-primary-blue text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors mt-4">
                    Get Early Access
                </button>
            </div>
        </div>
    </header>
    </div>
  )
}

export default Header
