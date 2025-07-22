import React from 'react'
import logo from '../../assets/logo.jpg' 
import landingBg from "../../assets/landing.png";
import { motion } from 'framer-motion';  


const Landing = () => {
  return (
    <>
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm px-12 py-4">
      <div className="w-full flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="h-10 w-auto" />
       </div>
            
          {/* Navigation */}
          <div className="flex items-center space-x-4">
            <button className="text-green-500 font-medium hover:text-green-600 transition-colors">
              Login
            </button>
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </header>


    <section className="relative min-h-[600px] flex items-center justify-center">
    {/* Background Image */}
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${landingBg})`
      }}
    >
      <div className="absolute inset-0 bg-[#0000008c]"></div>
    </div>
    {/* Hero Content */}
    <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
       <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ask. Learn. Share
          </h1>
          <p className="text-xl text-white mb-8 leading-relaxed max-w-2xl mx-auto">
            Join thousands of students and educators in building 
            the largest academic Q&A community. Get answers to 
            your questions, share knowledge, and grow together.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-green-500 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center">
              Get Started 
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="bg-green-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors">
              Explore Questions
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Ask Questions Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-green-500">
              <h3 className="text-xl font-bold text-green-500 mb-3">Ask Questions</h3>
              <p className="text-gray-600 leading-relaxed">
                Get detailed answers from experts and peers in your field of study.
              </p>
            </div>

            {/* Community Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-green-500">
              <h3 className="text-xl font-bold text-green-500 mb-3">Community</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with like-minded students and educators from around the world.
              </p>
            </div>

            {/* Learn Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-green-500">
              <h3 className="text-xl font-bold text-green-500 mb-3">Learn</h3>
              <p className="text-gray-600 leading-relaxed">
                Access a vast repository of knowledge across all academic disciplines.
              </p>
            </div>

            {/* Reputation Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-t-4 border-green-500">
              <h3 className="text-xl font-bold text-green-500 mb-3">Reputation</h3>
              <p className="text-gray-600 leading-relaxed">
                Build your academic reputation by helping others and sharing knowledge.
              </p>
            </div>

          </div>
        </div>
      </section>
      {/* Ready to Start Learning Section */}
      <motion.section initial={{
        x:-900,
      }}
      animate={{
        x:10,
      }}
      whileInView={true}
       className="py-16 px-6 border">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-green-500">
                Ready to Start Learning?
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Join our community today and get access to thousands of questions and answers.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-green-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors">
                  Start Digital Platform
                </button>
                <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  Join Digital Platform
                </button>
              </div>
            </div>

            {/* Right Images Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
                  <span className="text-gray-500 text-sm"></span>
                </div>
                <div className="bg-gray-200 rounded-lg h-40 flex items-center justify-center">
                  <span className="text-gray-500 text-sm"></span>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-gray-200 rounded-lg h-40 flex items-center justify-center">
                  <span className="text-gray-500 text-sm"></span>
                </div>
                <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center">
                  <span className="text-gray-500 text-sm"></span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </motion.section>

    </div>
    </>
  )
}

export default Landing