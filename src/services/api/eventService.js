import eventData from '../mockData/events.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const eventService = {
  async getAll() {
    await delay(300)
    return [...eventData]
  },

  async getById(id) {
    await delay(200)
    const event = eventData.find(item => item.id === id)
    if (!event) {
      throw new Error('Event not found')
    }
    return { ...event }
  },

  async create(eventItem) {
    await delay(400)
    const newEvent = {
      ...eventItem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    eventData.push(newEvent)
    return { ...newEvent }
  },

  async update(id, data) {
    await delay(350)
    const index = eventData.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Event not found')
    }
    eventData[index] = { ...eventData[index], ...data, updatedAt: new Date().toISOString() }
    return { ...eventData[index] }
  },

  async delete(id) {
    await delay(300)
    const index = eventData.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Event not found')
    }
    const deleted = eventData.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default eventService