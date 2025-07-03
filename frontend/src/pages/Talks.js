import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Talks = () => {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTalks();
  }, []);

  const fetchTalks = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await axios.get(`${apiUrl}/api/talks`);
      setTalks(response.data);
    } catch (error) {
      console.error('Error fetching talks:', error);
      setError('Failed to load talks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrackColor = (track) => {
    switch (track) {
      case 'JavaScript':
        return 'bg-yellow-100 text-yellow-800';
      case 'PHP':
        return 'bg-purple-100 text-purple-800';
      case 'Python/AI':
        return 'bg-blue-100 text-blue-800';
      case 'UX':
        return 'bg-pink-100 text-pink-800';
      case 'Founders':
        return 'bg-green-100 text-green-800';
      case 'Digital Change':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading talks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="text-red-400">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Submitted Talks</h1>
        <p className="text-gray-600">
          Browse all the amazing talk proposals submitted for Web Summer Camp 2025 in Opatija, Croatia (July 3-5, 2025). 
          Submissions are organized by our six specialized tracks.
        </p>
      </div>

      {talks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📢</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No talks submitted yet</h3>
          <p className="text-gray-600 mb-6">Be the first to submit your talk proposal!</p>
          <a
            href="/submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Submit Your Talk
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {talks.map((talk) => (
            <div key={talk.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex-1 mr-4">
                  {talk.title}
                </h2>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {talk.track && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrackColor(talk.track)}`}>
                      {talk.track}
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(talk.level)}`}>
                    {talk.level}
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {talk.duration} min
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">{talk.speaker_name}</span>
                  <span className="mx-2">•</span>
                  <span>{talk.speaker_email}</span>
                </div>
                <div className="text-sm text-gray-500">
                  <svg className="h-4 w-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submitted on {formatDate(talk.created_at)}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{talk.description}</p>
              </div>

              {talk.speaker_bio && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">About the Speaker</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{talk.speaker_bio}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {talks.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Total: {talks.length} talk{talks.length !== 1 ? 's' : ''} submitted
          </p>
        </div>
      )}
    </div>
  );
};

export default Talks;