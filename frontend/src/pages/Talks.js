import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const Talks = () => {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    track: '',
    level: '',
    duration: ''
  });
  const [showFilters, setShowFilters] = useState(false);

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

  // Filter options
  const trackOptions = ['JavaScript', 'PHP', 'Python/AI', 'UX', 'Founders', 'Digital Change'];
  const levelOptions = ['Beginner', 'Intermediate', 'Advanced'];
  const durationOptions = [
    { label: '15 minutes', value: '15' },
    { label: '30 minutes', value: '30' },
    { label: '45 minutes', value: '45' },
    { label: '60 minutes', value: '60' }
  ];

  // Filtered talks using useMemo for performance
  const filteredTalks = useMemo(() => {
    return talks.filter(talk => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          talk.title.toLowerCase().includes(searchTerm) ||
          talk.speaker_name.toLowerCase().includes(searchTerm) ||
          talk.description.toLowerCase().includes(searchTerm);
        if (!matchesSearch) return false;
      }

      // Track filter
      if (filters.track && talk.track !== filters.track) {
        return false;
      }

      // Level filter
      if (filters.level && talk.level !== filters.level) {
        return false;
      }

      // Duration filter
      if (filters.duration && talk.duration.toString() !== filters.duration) {
        return false;
      }

      return true;
    });
  }, [talks, filters]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      track: '',
      level: '',
      duration: ''
    });
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

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

      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-blue-800 text-xs px-2 py-1 rounded-full">
                {Object.values(filters).filter(v => v !== '').length}
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 text-sm underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search talks, speakers..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Track Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Track
                </label>
                <select
                  value={filters.track}
                  onChange={(e) => handleFilterChange('track', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All tracks</option>
                  {trackOptions.map(track => (
                    <option key={track} value={track}>{track}</option>
                  ))}
                </select>
              </div>

              {/* Level Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  value={filters.level}
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All levels</option>
                  {levelOptions.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              {/* Duration Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  value={filters.duration}
                  onChange={(e) => handleFilterChange('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All durations</option>
                  {durationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {talks.length > 0 && (
        <div className="mb-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredTalks.length} of {talks.length} talk{talks.length !== 1 ? 's' : ''}
            {hasActiveFilters && (
              <span className="ml-2 text-blue-600 font-medium">
                (filtered)
              </span>
            )}
          </div>
        </div>
      )}

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
      ) : filteredTalks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No talks match your filters</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or clearing the filters.</p>
          <button
            onClick={clearFilters}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredTalks.map((talk) => (
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

      {filteredTalks.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            {hasActiveFilters ? (
              <>
                Showing {filteredTalks.length} of {talks.length} talk{talks.length !== 1 ? 's' : ''} submitted
              </>
            ) : (
              <>
                Total: {talks.length} talk{talks.length !== 1 ? 's' : ''} submitted
              </>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default Talks;