import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from './ApperIcon'
import { eventService, venueService, bookingService } from '../services'
import { toast } from 'react-toastify'

const MainFeature = () => {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [selectedShowtime, setSelectedShowtime] = useState(null)
  const [numberOfPeople, setNumberOfPeople] = useState(1)
  const [selectedSeats, setSelectedSeats] = useState([])
  const [currentStep, setCurrentStep] = useState(1)
  const [events, setEvents] = useState([])
  const [venues, setVenues] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Sample seat map for demonstration
  const seatMap = {
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    seatsPerRow: 12,
    bookedSeats: ['A3', 'A4', 'B7', 'C2', 'C8', 'D5', 'E1', 'E12', 'F6', 'G3', 'G9', 'H4', 'H8']
  }

  const showtimes = [
    { id: 1, time: '10:00 AM', date: '2024-01-15', available: true },
    { id: 2, time: '1:30 PM', date: '2024-01-15', available: true },
    { id: 3, time: '4:00 PM', date: '2024-01-15', available: false },
    { id: 4, time: '7:30 PM', date: '2024-01-15', available: true },
    { id: 5, time: '10:30 PM', date: '2024-01-15', available: true }
  ]

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [eventsResult, venuesResult] = await Promise.all([
          eventService.getAll(),
          venueService.getAll()
        ])
        setEvents(eventsResult || [])
        setVenues(venuesResult || [])
      } catch (err) {
        setError(err?.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

const handleEventSelect = (event) => {
    setSelectedEvent(event)
    setCurrentStep(2)
    setSelectedSeats([])
  }

  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime)
    setCurrentStep(3)
    setSelectedSeats([])
  }

  const handlePeopleSelect = (count) => {
    setNumberOfPeople(count)
    setCurrentStep(4)
    setSelectedSeats([])
  }

  const handleSeatSelect = (seatId) => {
    if (seatMap.bookedSeats.includes(seatId)) return
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId)
      } else if (prev.length < numberOfPeople) {
        return [...prev, seatId]
      } else {
        toast.warning(`Maximum ${numberOfPeople} seats can be selected`)
        return prev
      }
    })
  }

  const handleBooking = async () => {
    if (!selectedEvent || !selectedShowtime || selectedSeats.length === 0) {
      toast.error('Please complete all booking steps')
      return
    }

    setLoading(true)
    try {
      const bookingData = {
        eventId: selectedEvent.id,
        showtime: selectedShowtime,
        seats: selectedSeats,
        totalAmount: selectedSeats.length * 12.99,
        status: 'confirmed'
      }
      
      await bookingService.create(bookingData)
toast.success(`Successfully booked ${selectedSeats.length} seats for ${selectedEvent.title}!`)
      
      // Reset booking flow
      setCurrentStep(1)
      setSelectedEvent(null)
      setSelectedShowtime(null)
      setNumberOfPeople(1)
      setSelectedSeats([])
    } catch (err) {
      toast.error('Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getSeatStatus = (seatId) => {
    if (seatMap.bookedSeats.includes(seatId)) return 'booked'
    if (selectedSeats.includes(seatId)) return 'selected'
    return 'available'
  }

  const getSeatColor = (status) => {
    switch (status) {
      case 'booked': return 'bg-gray-600 cursor-not-allowed'
case 'selected': return 'bg-accent text-black cursor-pointer'
      case 'available': return 'bg-green-600 hover:bg-green-500 cursor-pointer'
      default: return 'bg-green-600'
    }
  }
  const steps = [
    { number: 1, title: 'Select Event', icon: 'Calendar' },
    { number: 2, title: 'Select Showtime', icon: 'Clock' },
    { number: 3, title: 'Select People', icon: 'Users' },
    { number: 4, title: 'Pick Seats', icon: 'Armchair' },
    { number: 5, title: 'Confirm', icon: 'CreditCard' }
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-black/20 to-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Book Your Perfect Show
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience our seamless booking process with real-time seat selection and instant confirmation.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4 md:space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <motion.div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    currentStep >= step.number
                      ? 'bg-accent border-accent text-black'
                      : 'border-gray-600 text-gray-400'
                  }`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: currentStep >= step.number ? 1.1 : 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ApperIcon name={step.icon} className="h-6 w-6" />
                </motion.div>
                <div className="ml-3 hidden md:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step.number ? 'text-accent' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 md:w-16 h-0.5 ml-4 md:ml-8 transition-colors duration-300 ${
                    currentStep > step.number ? 'bg-accent' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="glassmorphism rounded-2xl p-6 md:p-8 border border-white/10">
          <AnimatePresence mode="wait">
            {/* Step 1: Select Event */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-heading font-semibold text-white mb-6">
                  Choose Your Event
                </h3>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events?.slice(0, 6).map((event) => (
                      <motion.div
                        key={event?.id}
                        onClick={() => handleEventSelect(event)}
                        className="group cursor-pointer bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-accent/50 transition-all duration-300 hover:shadow-glow"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="aspect-[16/9] relative overflow-hidden">
                          <img
                            src={event?.poster || 'https://images.unsplash.com/photo-1489599856302-c2cc4975ef50?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
                            alt={event?.title || 'Event'}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </div>
                        <div className="p-4">
                          <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-accent transition-colors">
                            {event?.title || 'Event Title'}
                          </h4>
                          <div className="flex items-center justify-between">
                            <span className="text-accent font-medium capitalize">{event?.type || 'movie'}</span>
                            <div className="flex items-center space-x-1">
                              <ApperIcon name="Star" className="h-4 w-4 text-accent fill-current" />
                              <span className="text-white text-sm">{event?.rating || 4.5}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Select Showtime */}
            {currentStep === 2 && selectedEvent && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-heading font-semibold text-white">
                    Select Showtime for "{selectedEvent?.title}"
                  </h3>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ApperIcon name="ArrowLeft" className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {showtimes.map((showtime) => (
                    <motion.button
                      key={showtime.id}
                      onClick={() => showtime.available && handleShowtimeSelect(showtime)}
                      disabled={!showtime.available}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        showtime.available
                          ? 'border-white/20 hover:border-accent/50 hover:bg-white/10 text-white'
                          : 'border-gray-600 bg-gray-800/50 text-gray-500 cursor-not-allowed'
                      } ${selectedShowtime?.id === showtime.id ? 'border-accent bg-accent/20' : ''}`}
                      whileHover={showtime.available ? { scale: 1.05 } : {}}
                      whileTap={showtime.available ? { scale: 0.95 } : {}}
                    >
                      <div className="text-lg font-semibold">{showtime.time}</div>
                      <div className="text-sm opacity-75">Today</div>
{!showtime.available && (
                        <div className="text-xs text-red-400 mt-1">Sold Out</div>
                      )}
                    </motion.button>
                  ))}
                </div>
                
                {selectedShowtime && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-center"
                  >
                    <motion.button
                      onClick={() => setCurrentStep(3)}
                      className="gradient-primary px-8 py-3 rounded-xl text-white font-semibold hover:shadow-glow transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue to People Selection
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
            {/* Step 3: Select Number of People */}
            {currentStep === 3 && selectedShowtime && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-heading font-semibold text-white">
                    How many people?
                  </h3>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ApperIcon name="ArrowLeft" className="h-6 w-6" />
                  </button>
                </div>

                <div className="max-w-md mx-auto">
                  <div className="bg-white/5 rounded-xl p-8 border border-white/10 text-center">
                    <div className="mb-6">
                      <ApperIcon name="Users" className="h-16 w-16 text-accent mx-auto mb-4" />
                      <p className="text-gray-300">Select the number of people for your booking</p>
                    </div>

                    <div className="flex items-center justify-center space-x-6 mb-8">
                      <motion.button
                        onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                        disabled={numberOfPeople <= 1}
                        className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: numberOfPeople > 1 ? 1.1 : 1 }}
                        whileTap={{ scale: numberOfPeople > 1 ? 0.9 : 1 }}
                      >
                        <ApperIcon name="Minus" className="h-6 w-6" />
                      </motion.button>

                      <div className="text-center">
                        <div className="text-4xl font-bold text-accent mb-2">{numberOfPeople}</div>
                        <div className="text-sm text-gray-400">
                          {numberOfPeople === 1 ? 'Person' : 'People'}
                        </div>
                      </div>

                      <motion.button
                        onClick={() => setNumberOfPeople(Math.min(8, numberOfPeople + 1))}
                        disabled={numberOfPeople >= 8}
                        className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: numberOfPeople < 8 ? 1.1 : 1 }}
                        whileTap={{ scale: numberOfPeople < 8 ? 0.9 : 1 }}
                      >
                        <ApperIcon name="Plus" className="h-6 w-6" />
                      </motion.button>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-gray-400 mb-2">Maximum 8 people per booking</p>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-accent h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(numberOfPeople / 8) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <motion.button
                      onClick={() => handlePeopleSelect(numberOfPeople)}
                      className="w-full gradient-primary py-3 rounded-xl text-white font-semibold hover:shadow-glow transition-all duration-300"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue to Seat Selection
                    </motion.button>
</div>
                </div>
              </motion.div>
            )}
            {/* Step 4: Select Seats */}
            {currentStep === 4 && numberOfPeople && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-heading font-semibold text-white">
                    Choose Your Seats
                  </h3>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ApperIcon name="ArrowLeft" className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-8">
                  {/* Screen */}
                  <div className="flex justify-center mb-8">
                    <div className="w-3/4 h-2 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full mb-2"></div>
                  </div>
                  <p className="text-center text-gray-400 mb-8">SCREEN</p>

                  {/* Seat Map */}
                  <div className="space-y-3 max-w-4xl mx-auto">
                    {seatMap.rows.map((row) => (
                      <div key={row} className="flex items-center justify-center space-x-2">
                        <span className="text-gray-400 font-medium w-8 text-center">{row}</span>
                        <div className="flex space-x-1">
                          {Array.from({ length: seatMap.seatsPerRow }, (_, i) => {
                            const seatId = `${row}${i + 1}`
                            const status = getSeatStatus(seatId)
                            return (
                              <motion.button
                                key={seatId}
                                onClick={() => handleSeatSelect(seatId)}
                                className={`w-8 h-8 rounded-md text-xs font-medium transition-all duration-200 ${getSeatColor(status)}`}
                                disabled={status === 'booked'}
                                whileHover={status !== 'booked' ? { scale: 1.1 } : {}}
                                whileTap={status !== 'booked' ? { scale: 0.9 } : {}}
                              >
                                {i + 1}
                              </motion.button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex justify-center space-x-6 mt-8">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-600 rounded"></div>
                      <span className="text-sm text-gray-400">Available</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-accent rounded"></div>
                      <span className="text-sm text-gray-400">Selected</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-600 rounded"></div>
                      <span className="text-sm text-gray-400">Booked</span>
                    </div>
                  </div>
                </div>

                {selectedSeats.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
className="bg-white/5 rounded-xl p-6 border border-white/10"
                  >
                    <h4 className="text-lg font-semibold text-white mb-4">Booking Summary</h4>
                    <div className="space-y-2 text-gray-300">
                      <p>Event: <span className="text-white">{selectedEvent?.title}</span></p>
                      <p>Time: <span className="text-white">{selectedShowtime?.time}</span></p>
                      <p>People: <span className="text-white">{numberOfPeople}</span></p>
                      <p>Seats: <span className="text-accent">{selectedSeats.join(', ')}</span></p>
                      <p>Quantity: <span className="text-white">{selectedSeats.length} of {numberOfPeople} tickets</span></p>
<div className="border-t border-white/10 pt-2 mt-4">
                        <p className="text-lg font-semibold">
                          Total: <span className="text-accent">${(selectedSeats.length * 12.99).toFixed(2)}</span>
                        </p>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => setCurrentStep(5)}
                      disabled={selectedSeats.length !== numberOfPeople}
                      className="w-full mt-6 gradient-primary py-3 rounded-xl text-white font-semibold hover:shadow-glow transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {selectedSeats.length === numberOfPeople 
                        ? 'Proceed to Payment' 
                        : `Select ${numberOfPeople - selectedSeats.length} more seat${numberOfPeople - selectedSeats.length !== 1 ? 's' : ''}`
                      }
</motion.button>
                  </motion.div>
                )}
              </motion.div>
            )}
            {/* Step 5: Confirm Booking */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-heading font-semibold text-white">
                    Confirm Your Booking
                  </h3>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ApperIcon name="ArrowLeft" className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">Booking Details</h4>
                      <div className="space-y-3 text-gray-300">
                        <div className="flex justify-between">
                          <span>Event:</span>
                          <span className="text-white">{selectedEvent?.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date & Time:</span>
<span className="text-white">{selectedShowtime?.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Seats:</span>
                          <span className="text-accent">{selectedSeats?.join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>People:</span>
                          <span className="text-white">{numberOfPeople}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tickets:</span>
                          <span className="text-white">{selectedSeats?.length || 0}</span>
                        </div>
                        <div className="border-t border-white/10 pt-3 mt-4">
                          <div className="flex justify-between text-lg font-semibold">
                            <span>Total Amount:</span>
                            <span className="text-accent">${((selectedSeats?.length || 0) * 12.99).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                      <h4 className="text-lg font-semibold text-white mb-4">Payment Method</h4>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-accent/50">
                          <ApperIcon name="CreditCard" className="h-5 w-5 text-accent" />
                          <span className="text-white">Credit/Debit Card</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/20 hover:border-white/40 cursor-pointer transition-colors">
                          <ApperIcon name="Smartphone" className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-300">Digital Wallet</span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      onClick={handleBooking}
                      disabled={loading}
                      className="w-full gradient-primary py-4 rounded-xl text-white font-semibold text-lg hover:shadow-neon transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={!loading ? { scale: 1.02 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <ApperIcon name="Check" className="h-5 w-5" />
                          <span>Confirm Booking</span>
                        </div>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default MainFeature