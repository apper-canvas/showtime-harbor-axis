import bookingData from '../mockData/bookings.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const bookingService = {
  async getAll() {
    await delay(300)
    return [...bookingData]
  },

  async getById(id) {
    await delay(200)
    const booking = bookingData.find(item => item.id === id)
    if (!booking) {
      throw new Error('Booking not found')
    }
    return { ...booking }
  },

  async create(bookingItem) {
    await delay(500)
    const newBooking = {
      ...bookingItem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      bookingNumber: `BK${Date.now().toString().slice(-6)}`
    }
    bookingData.push(newBooking)
    return { ...newBooking }
  },

  async update(id, data) {
    await delay(350)
    const index = bookingData.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Booking not found')
    }
    bookingData[index] = { ...bookingData[index], ...data, updatedAt: new Date().toISOString() }
    return { ...bookingData[index] }
  },

  async delete(id) {
    await delay(300)
    const index = bookingData.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Booking not found')
    }
    const deleted = bookingData.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default bookingService