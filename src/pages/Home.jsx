import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import SocialShare from '../components/SocialShare'
import { eventService } from '../services'
import { toast } from 'react-toastify'
const Home = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [featuredEvents, setFeaturedEvents] = useState([])

  const categories = [
    { id: 'all', name: 'All Events', icon: 'Grid3X3' },
    { id: 'movie', name: 'Movies', icon: 'Film' },
    { id: 'concert', name: 'Concerts', icon: 'Music' },
    { id: 'play', name: 'Plays', icon: 'Theater' },
    { id: 'sports', name: 'Sports', icon: 'Trophy' }
  ]

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      try {
        const result = await eventService.getAll()
        setEvents(result || [])
        setFeaturedEvents((result || []).slice(0, 3))
      } catch (err) {
        setError(err?.message || 'Failed to load events')
        toast.error('Failed to load events')
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [])

  const filteredEvents = events.filter(event => {
    const matchesSearch = event?.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) || false
    const matchesCategory = selectedCategory === 'all' || event?.type === selectedCategory
return matchesSearch && matchesCategory
})

const handleBookEvent = (eventId) => {
  toast.success('Starting booking process...')
  navigate('/theater-selection')
  }

  const handleExploreEvents = () => {
    const featuredSection = document.getElementById('featured-events')
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleBookShow = () => {
    setSelectedCategory('movie')
    toast.success('Showing movies')
    const eventsSection = document.getElementById('events-grid')
    if (eventsSection) {
eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

return (
  <div className="min-h-screen bg-secondary">
    {/* Header */}
    <header className="glassmorphism sticky top-0 z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="gradient-primary p-2 rounded-lg">
<ApperIcon name="Play" className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-white">ShowTime</h1>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent w-64"
                />
              </div>
              <button className="gradient-primary px-4 py-2 rounded-lg text-white font-medium hover:shadow-glow transition-all duration-300 transform hover:scale-105">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1489599856302-c2cc4975ef50?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
        />
        
        <div className="relative z-20 h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-2xl"
            initial={{ opacity: 0, y: 50 }}
animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 text-shadow text-center">
            Your Gateway to <span className="text-accent">Amazing</span> Entertainment
          </h1>
          <p className="text-xl text-gray-200 mb-8 text-shadow">
              Discover and book tickets for the hottest movies, concerts, plays, and sporting events in your city.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={handleExploreEvents}
                className="gradient-primary px-8 py-4 rounded-xl text-white font-semibold text-lg hover:shadow-neon transition-all duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Events
              </motion.button>
              <motion.button
                onClick={handleBookShow}
                className="bg-white/10 border border-white/20 px-8 py-4 rounded-xl text-white font-semibold text-lg hover:bg-white/20 hover:border-accent transition-all duration-300 transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Show
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'gradient-primary text-white shadow-glow'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ApperIcon name={category.icon} className="h-5 w-5" />
                <span className="font-medium">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Feature - Interactive Booking */}
      <MainFeature />

      {/* Featured Events */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 id="featured-events" className="text-3xl md:text-4xl font-heading font-bold text-white mb-12 text-center">
            Featured Events
            </h2>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <ApperIcon name="AlertCircle" className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-gray-400">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents?.map((event, index) => (
                <motion.div
                  key={event?.id || index}
                  className="group relative bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-accent/50 transition-all duration-300 hover:shadow-glow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img
                      src={event?.poster || 'https://images.unsplash.com/photo-1489599856302-c2cc4975ef50?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={event?.title || 'Event'}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                        <ApperIcon name="Star" className="h-4 w-4 text-accent fill-current" />
                        <span className="text-white text-sm font-medium">{event?.rating || 4.5}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-heading font-semibold text-white mb-2 group-hover:text-accent transition-colors">
                      {event?.title || 'Event Title'}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(event?.genre || ['Action', 'Drama']).slice(0, 2).map((genre, i) => (
                        <span key={i} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                          {genre}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        <p>{event?.duration || '2h 30m'}</p>
                        <p>{(event?.language || ['English']).join(', ')}</p>
                      </div>
                      <motion.button
                        onClick={() => handleBookEvent(event?.id)}
                        className="gradient-primary px-4 py-2 rounded-lg text-white font-medium hover:shadow-glow transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Book Now
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
</div>
    </section>

    {/* Events Grid */}
    <section id="events-grid" className="py-16 bg-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-8 text-center">
            {selectedCategory === 'all' ? 'All Events' : categories.find(c => c.id === selectedCategory)?.name}
            {selectedCategory !== 'all' && (
                <span className="block text-lg text-accent font-normal mt-2">
                  Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
                </span>
              )}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents?.map((event, index) => (
              <motion.div
                key={event?.id || index}
                className="group relative bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-accent/50 transition-all duration-300 hover:shadow-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={event?.poster || 'https://images.unsplash.com/photo-1489599856302-c2cc4975ef50?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
                    alt={event?.title || 'Event'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <motion.button
                    onClick={() => handleBookEvent(event?.id)}
className="absolute bottom-4 left-1/2 transform -translate-x-1/2 gradient-primary px-4 py-2 rounded-lg text-white font-medium opacity-0 group-hover:opacity-100 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book Now
                </motion.button>
              </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1 truncate">
                    {event?.title || 'Event Title'}
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400 capitalize">{event?.type || 'movie'}</span>
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="Star" className="h-4 w-4 text-accent fill-current" />
                      <span className="text-white text-sm">{event?.rating || 4.5}</span>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <SocialShare event={event} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredEvents?.length === 0 && !loading && (
            <div className="text-center py-12">
              <ApperIcon name="Search" className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No events found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="gradient-primary p-2 rounded-lg">
                  <ApperIcon name="Play" className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-heading font-bold text-white">ShowTime</h3>
              </div>
              <p className="text-gray-400">Your gateway to amazing entertainment experiences.</p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-accent transition-colors">Movies</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Sports</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Activities</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-accent transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  <ApperIcon name="Facebook" className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  <ApperIcon name="Twitter" className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-accent transition-colors">
                  <ApperIcon name="Instagram" className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ShowTime. All rights reserved.</p>
          </div>
</div>
    </footer>
  </div>
)
}

export default Home