import React, { useState } from 'react';
import axios from 'axios';

const SubmitTalk = () => {
  const [formData, setFormData] = useState({
    title: '',
    speaker_name: '',
    speaker_email: '',
    speaker_bio: '',
    description: '',
    duration: 30,
    level: 'Intermediate',
    track: 'JavaScript'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
      await axios.post(`${apiUrl}/api/talks`, formData);
      
      setSubmitStatus('success');
      setFormData({
        title: '',
        speaker_name: '',
        speaker_email: '',
        speaker_bio: '',
        description: '',
        duration: 30,
        level: 'Intermediate',
        track: 'JavaScript'
      });
    } catch (error) {
      console.error('Error submitting talk:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Submit Your Talk
        </h1>
        
        {submitStatus === 'success' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <strong>Success!</strong> Your talk has been submitted successfully.
          </div>
        )}
        
        {submitStatus === 'error' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error!</strong> There was a problem submitting your talk. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Talk Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Talk Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your talk title"
            />
          </div>

          {/* Speaker Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="speaker_name" className="block text-sm font-medium text-gray-700 mb-2">
                Speaker Name *
              </label>
              <input
                type="text"
                id="speaker_name"
                name="speaker_name"
                value={formData.speaker_name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="speaker_email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="speaker_email"
                name="speaker_email"
                value={formData.speaker_email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {/* Speaker Bio */}
          <div>
            <label htmlFor="speaker_bio" className="block text-sm font-medium text-gray-700 mb-2">
              Speaker Bio
            </label>
            <textarea
              id="speaker_bio"
              name="speaker_bio"
              value={formData.speaker_bio}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Tell us about yourself (optional)"
            />
          </div>

          {/* Talk Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Talk Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Describe your talk, what attendees will learn, and why it's valuable"
            />
          </div>

          {/* Talk Details */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <select
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label htmlFor="track" className="block text-sm font-medium text-gray-700 mb-2">
                Track
              </label>
              <select
                id="track"
                name="track"
                value={formData.track}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="JavaScript">JavaScript</option>
                <option value="PHP">PHP</option>
                <option value="Python/AI">Python/AI</option>
                <option value="UX">UX</option>
                <option value="Founders">Founders</option>
                <option value="Digital Change">Digital Change</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Talk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitTalk;