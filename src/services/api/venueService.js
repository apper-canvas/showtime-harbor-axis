import venueData from '../mockData/venues.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const venueService = {
  async getAll() {
    await delay(250)
    return [...venueData]
  },

  async getById(id) {
    await delay(200)
    const venue = venueData.find(item => item.id === id)
    if (!venue) {
      throw new Error('Venue not found')
    }
    return { ...venue }
  },

  async create(venueItem) {
    await delay(400)
    const newVenue = {
      ...venueItem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    venueData.push(newVenue)
    return { ...newVenue }
  },

  async update(id, data) {
    await delay(350)
    const index = venueData.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Venue not found')
    }
    venueData[index] = { ...venueData[index], ...data, updatedAt: new Date().toISOString() }
    return { ...venueData[index] }
  },

  async delete(id) {
    await delay(300)
    const index = venueData.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Venue not found')
    }
    const deleted = venueData.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default venueService