import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Web Summer Camp 2025
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join us at the beautiful Hotel Ambasador in Opatija, Croatia for three days of 
          workshops, networking opportunities, and inspiring discussions. Connect with 
          industry leaders, learn cutting-edge technologies, and network with fellow 
          developers, designers, and entrepreneurs from around the world.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/submit"
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Submit Your Talk
          </Link>
          <Link
            to="/talks"
            className="bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            View Submitted Talks
          </Link>
        </div>
      </div>

      {/* Conference Details */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">When</h3>
          <p className="text-gray-600">July 3-5, 2025</p>
          <p className="text-gray-600">3 days of amazing content</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Where</h3>
          <p className="text-gray-600">Hotel Ambasador</p>
          <p className="text-gray-600">Opatija, Croatia</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-primary-600 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Who</h3>
          <p className="text-gray-600">Developers & Engineers</p>
          <p className="text-gray-600">Designers & Founders</p>
        </div>
      </div>

      {/* Tracks */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8">Conference Tracks</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-yellow-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="font-semibold mb-2">JavaScript</h3>
            <p className="text-gray-600 text-sm">Modern JS, frameworks, and tools</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🐘</span>
            </div>
            <h3 className="font-semibold mb-2">PHP</h3>
            <p className="text-gray-600 text-sm">Modern PHP development and frameworks</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🐍</span>
            </div>
            <h3 className="font-semibold mb-2">Python/AI</h3>
            <p className="text-gray-600 text-sm">Python development and AI applications</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-semibold mb-2">UX</h3>
            <p className="text-gray-600 text-sm">User experience and design</p>
          </div>
          
          <div className="text-center">
            <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="font-semibold mb-2">Founders</h3>
            <p className="text-gray-600 text-sm">Entrepreneurship and startup insights</p>
          </div>
          
          <div className="text-center">
            <div className="bg-teal-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">🔄</span>
            </div>
            <h3 className="font-semibold mb-2">Digital Change</h3>
            <p className="text-gray-600 text-sm">Digital transformation and innovation</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;