import { motion } from 'framer-motion'
import ApperIcon from './ApperIcon'
import { toast } from 'react-toastify'

const SocialShare = ({ event, className = "" }) => {
  const shareUrl = encodeURIComponent(window.location.origin)
  const title = encodeURIComponent(event?.title || 'Check out this amazing event!')
  const description = encodeURIComponent(
    `${event?.title || 'Amazing Event'} - ${event?.type || 'Entertainment'} event with ${event?.rating || '4.5'} rating. Book your tickets now!`
  )

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}&quote=${title}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${title}&hashtags=ShowTime,Events,${event?.type || 'Entertainment'}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${title}&summary=${description}`,
    whatsapp: `https://wa.me/?text=${title}%20${shareUrl}`
  }

  const handleShare = (platform) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400')
    toast.success(`Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`)
  }

  const socialPlatforms = [
    { name: 'facebook', icon: 'Facebook', color: 'hover:text-blue-500' },
    { name: 'twitter', icon: 'Twitter', color: 'hover:text-sky-400' },
    { name: 'linkedin', icon: 'Linkedin', color: 'hover:text-blue-600' },
    { name: 'whatsapp', icon: 'MessageCircle', color: 'hover:text-green-500' }
  ]

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-xs text-gray-400 hidden sm:inline">Share:</span>
      <div className="flex space-x-1">
        {socialPlatforms.map((platform) => (
          <motion.button
            key={platform.name}
            onClick={() => handleShare(platform.name)}
            className={`p-2 rounded-full bg-white/5 border border-white/10 text-gray-400 transition-all duration-300 ${platform.color} hover:bg-white/10 hover:border-accent/50`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={`Share on ${platform.name.charAt(0).toUpperCase() + platform.name.slice(1)}`}
          >
            <ApperIcon name={platform.icon} className="h-3 w-3" />
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default SocialShare