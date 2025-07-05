import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Talks = () => {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

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

  const filteredTalks = talks.filter(talk => {
    // Track filter
    const trackMatch = selectedTrack === 'All' || talk.track === selectedTrack;
    
    // Level filter
    const levelMatch = selectedLevel === 'All' || talk.level === selectedLevel;
    
    // Duration filter
    let durationMatch = true;
    if (selectedDuration !== 'All') {
      switch (selectedDuration) {
        case 'Short (≤20 min)':
          durationMatch = talk.duration <= 20;
          break;
        case 'Medium (21-45 min)':
          durationMatch = talk.duration > 20 && talk.duration <= 45;
          break;
        case 'Long (>45 min)':
          durationMatch = talk.duration > 45;
          break;
        default:
          durationMatch = true;
      }
    }
    
    // Search filter (title, speaker name, description)
    const searchMatch = searchTerm === '' || 
      talk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talk.speaker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talk.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return trackMatch && levelMatch && durationMatch && searchMatch;
  });

  // Sort the filtered talks
  const sortedTalks = [...filteredTalks].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'title':
        return a.title.localeCompare(b.title);
      case 'speaker':
        return a.speaker_name.localeCompare(b.speaker_name);
      case 'duration':
        return a.duration - b.duration;
      case 'track':
        return a.track.localeCompare(b.track);
      default:
        return 0;
    }
  });

  const tracks = ['All', 'JavaScript', 'PHP', 'Python/AI', 'UX', 'Founders', 'Digital Change'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const durations = ['All', 'Short (≤20 min)', 'Medium (21-45 min)', 'Long (>45 min)'];
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'title', label: 'Title A-Z' },
    { value: 'speaker', label: 'Speaker A-Z' },
    { value: 'duration', label: 'Duration (Short to Long)' },
    { value: 'track', label: 'Track A-Z' }
  ];

  const clearAllFilters = () => {
    setSelectedTrack('All');
    setSelectedLevel('All');
    setSelectedDuration('All');
    setSearchTerm('');
    setSortBy('newest');
  };

  const hasActiveFilters = selectedTrack !== 'All' || selectedLevel !== 'All' || 
                          selectedDuration !== 'All' || searchTerm !== '' || sortBy !== 'newest';

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
        return 'bg-blue-100 text-blue-800';
      case 'Python/AI':
        return 'bg-green-100 text-green-800';
      case 'UX':
        return 'bg-purple-100 text-purple-800';
      case 'Founders':
        return 'bg-orange-100 text-orange-800';
      case 'Digital Change':
        return 'bg-teal-100 text-teal-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading talks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Submitted Talks
      </h1>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search talks, speakers, or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Filter Toggle Button */}
      <div className="mb-6 text-center">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
          </svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Active
            </span>
          )}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-8 bg-gray-50 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Track Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Track</label>
              <select
                value={selectedTrack}
                onChange={(e) => setSelectedTrack(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {tracks.map(track => (
                  <option key={track} value={track}>{track}</option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Duration Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {durations.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Track Filters (Pills) */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Track Selection</label>
            <div className="flex flex-wrap gap-2">
              {tracks.map(track => (
                <button
                  key={track}
                  onClick={() => setSelectedTrack(track)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTrack === track
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {track}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Talks Count and Active Filters */}
      <div className="text-center mb-8">
        <p className="text-gray-600 mb-2">
          {sortedTalks.length} {sortedTalks.length === 1 ? 'talk' : 'talks'} found
          {talks.length > 0 && ` out of ${talks.length} total`}
        </p>
        
        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {searchTerm && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1 text-blue-600 hover:text-blue-500"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTrack !== 'All' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Track: {selectedTrack}
                <button
                  onClick={() => setSelectedTrack('All')}
                  className="ml-1 text-green-600 hover:text-green-500"
                >
                  ×
                </button>
              </span>
            )}
            {selectedLevel !== 'All' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Level: {selectedLevel}
                <button
                  onClick={() => setSelectedLevel('All')}
                  className="ml-1 text-yellow-600 hover:text-yellow-500"
                >
                  ×
                </button>
              </span>
            )}
            {selectedDuration !== 'All' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Duration: {selectedDuration}
                <button
                  onClick={() => setSelectedDuration('All')}
                  className="ml-1 text-purple-600 hover:text-purple-500"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Talks Grid */}
      {sortedTalks.length === 0 ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
            <p className="text-gray-500 text-lg mb-4">
              {talks.length === 0 
                ? 'No talks have been submitted yet.' 
                : hasActiveFilters
                  ? 'No talks match your current filters.'
                  : 'No talks found.'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-600 bg-primary-100 hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedTalks.map(talk => (
            <div key={talk.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              {/* Talk Header */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {talk.title}
                </h3>
                <p className="text-gray-600 font-medium">
                  by {talk.speaker_name}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrackColor(talk.track)}`}>
                  {talk.track}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(talk.level)}`}>
                  {talk.level}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {talk.duration} min
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {talk.description}
              </p>

              {/* Speaker Bio */}
              {talk.speaker_bio && (
                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 mb-1">About the speaker:</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {talk.speaker_bio}
                  </p>
                </div>
              )}

              {/* Submission Date */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Submitted on {new Date(talk.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Talks;