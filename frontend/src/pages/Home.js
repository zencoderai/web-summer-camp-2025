import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Web Summer Camp 2025
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join us for the premier web development conference in Croatia! Web Summer Camp 2025 
          brings together developers, designers, and tech enthusiasts for three days of learning, 
          networking, and innovation in the beautiful coastal town of Opatija.
        </p>
        <div className="space-x-4">
          <Link
            to="/submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Submit Your Talk
          </Link>
          <Link
            to="/talks"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
          >
            View Submitted Talks
          </Link>
        </div>
      </div>

      {/* Conference Details */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 text-3xl mb-4">📅</div>
          <h3 className="text-xl font-semibold mb-2">When</h3>
          <p className="text-gray-600">
            July 3-5, 2025<br />
            Three days of amazing content
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 text-3xl mb-4">📍</div>
          <h3 className="text-xl font-semibold mb-2">Where</h3>
          <p className="text-gray-600">
            Hotel Ambasador<br />
            Opatija, Croatia 🇭🇷
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-blue-600 text-3xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">Focus</h3>
          <p className="text-gray-600">
            6 Specialized Tracks<br />
            JavaScript • PHP • Python/AI<br />
            UX • Founders • Digital Change
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-blue-50 p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Share Your Knowledge?
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          We're looking for passionate speakers to share their expertise across our six specialized tracks. 
          The call for papers is open until March 15th, 2025. Don't miss this opportunity to speak at Croatia's premier web conference!
        </p>
        <Link
          to="/submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors inline-block"
        >
          Submit Your Talk Proposal
        </Link>
      </div>

      {/* Topics */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Topics We're Looking For
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            'JavaScript Track',
            'PHP Track', 
            'Python/AI Track',
            'UX Track',
            'Founders Track',
            'Digital Change Track'
          ].map((topic, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-center font-medium text-gray-800">{topic}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;