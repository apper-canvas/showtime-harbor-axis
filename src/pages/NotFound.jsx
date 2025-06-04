import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <ApperIcon name="Theater" className="h-24 w-24 text-accent mx-auto mb-6" />
          <h1 className="text-6xl font-heading font-bold text-white mb-4">404</h1>
          <h2 className="text-2xl font-heading font-semibold text-white mb-4">
            Show Not Found
          </h2>
          <p className="text-gray-400 mb-8">
            The entertainment you're looking for seems to have ended. Let's get you back to the main show!
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 gradient-primary px-6 py-3 rounded-xl text-white font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105"
          >
            <ApperIcon name="Home" className="h-5 w-5" />
            <span>Back to ShowTime</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound