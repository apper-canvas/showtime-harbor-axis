import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { venueService } from '../services'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const TheaterSelection = () => {
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedVenue, setSelectedVenue] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const loadVenues = async () => {
      setLoading(true)
      try {
        const venuesData = await venueService.getAll()
        setVenues(venuesData || [])
      } catch (err) {
        setError(err?.message || 'Failed to load venues')
        toast.error('Failed to load theaters. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    loadVenues()
  }, [])

  const handleVenueSelect = (venue) => {
    setSelectedVenue(venue)
    toast.success(`Selected ${venue.name}`)
    // Navigate to main booking flow with selected venue
    setTimeout(() => {
      navigate('/booking', { state: { selectedVenue: venue } })
    }, 1000)
  }

  const getVenueIcon = (type) => {
    switch (type) {
      case 'cinema': return 'Film'
      case 'theater': return 'Music'
      case 'arena': 
      case 'stadium': 
      case 'baseball_stadium': return 'Trophy'
      case 'opera_house': 
      case 'music_hall': return 'Music'
      default: return 'MapPin'
    }
  }

  const getVenueTypeLabel = (type) => {
    switch (type) {
      case 'cinema': return 'Cinema'
      case 'theater': return 'Theater'
      case 'arena': return 'Arena'
      case 'stadium': return 'Stadium'
      case 'baseball_stadium': return 'Baseball Stadium'
      case 'opera_house': return 'Opera House'
      case 'music_hall': return 'Music Hall'
      default: return 'Venue'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading theaters...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-white text-lg mb-4">Failed to load theaters</p>
          <button
            onClick={() => window.location.reload()}
            className="gradient-primary px-6 py-3 rounded-xl text-white font-semibold hover:shadow-glow transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="glassmorphism border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-white hover:text-accent transition-colors"
            >
              <ApperIcon name="ArrowLeft" className="h-6 w-6" />
              <span className="font-semibold">Back to Home</span>
            </button>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Film" className="h-8 w-8 text-accent" />
              <span className="text-2xl font-heading font-bold text-white">ShowTime</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
              Select Your Theater
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose from our premium theater locations to start your booking experience.
            </p>
          </motion.div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent border-2 border-accent text-black font-semibold">
                  1
                </div>
                <span className="ml-3 text-accent font-medium">Select Theater</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-600"></div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-600 text-gray-400">
                  2
                </div>
                <span className="ml-3 text-gray-400">Choose Event</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-600"></div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-600 text-gray-400">
                  3
                </div>
                <span className="ml-3 text-gray-400">Book Seats</span>
              </div>
            </div>
          </div>

          {/* Venues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue) => (
              <motion.div
                key={venue.id}
                onClick={() => handleVenueSelect(venue)}
                className="group cursor-pointer glassmorphism rounded-2xl overflow-hidden border border-white/10 hover:border-accent/50 transition-all duration-300 hover:shadow-glow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: parseInt(venue.id) * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="p-8">
                  {/* Venue Icon & Type */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-accent/20 rounded-xl">
                        <ApperIcon name={getVenueIcon(venue.type)} className="h-6 w-6 text-accent" />
                      </div>
                      <span className="text-accent font-medium text-sm uppercase tracking-wide">
                        {getVenueTypeLabel(venue.type)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Users" className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">{venue.capacity.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Venue Name */}
                  <h3 className="text-xl font-heading font-semibold text-white mb-3 group-hover:text-accent transition-colors">
                    {venue.name}
                  </h3>

                  {/* Location */}
                  <div className="flex items-start space-x-2 mb-4">
                    <ApperIcon name="MapPin" className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="text-gray-300 text-sm">
                      <p>{venue.location.address}</p>
                      <p>{venue.location.city}, {venue.location.state} {venue.location.zipCode}</p>
                    </div>
                  </div>

                  {/* Facilities */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Facilities</h4>
                    <div className="flex flex-wrap gap-1">
                      {venue.facilities?.slice(0, 3).map((facility, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/10 rounded-md text-xs text-gray-300"
                        >
                          {facility}
                        </span>
                      ))}
                      {venue.facilities?.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 rounded-md text-xs text-gray-300">
                          +{venue.facilities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Select Button */}
                  <button className="w-full gradient-primary py-3 rounded-xl text-white font-semibold hover:shadow-glow transition-all duration-300 opacity-80 group-hover:opacity-100">
                    Select This Theater
                  </button>
                </div>

                {/* Selection Indicator */}
                {selectedVenue?.id === venue.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 bg-accent text-black rounded-full p-2"
                  >
                    <ApperIcon name="Check" className="h-4 w-4" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {venues.length === 0 && !loading && (
            <div className="text-center py-16">
              <ApperIcon name="MapPin" className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Theaters Available</h3>
              <p className="text-gray-400">Please check back later for available theaters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default TheaterSelection