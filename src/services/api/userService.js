import userData from '../mockData/users.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const userService = {
  async getAll() {
    await delay(300)
    return [...userData]
  },

  async getById(id) {
    await delay(200)
    const user = userData.find(item => item.id === id)
    if (!user) {
      throw new Error('User not found')
    }
    return { ...user }
  },

  async create(userItem) {
    await delay(400)
    const newUser = {
      ...userItem,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    userData.push(newUser)
    return { ...newUser }
  },

  async update(id, data) {
    await delay(350)
    const index = userData.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    userData[index] = { ...userData[index], ...data, updatedAt: new Date().toISOString() }
    return { ...userData[index] }
  },

  async delete(id) {
    await delay(300)
    const index = userData.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('User not found')
    }
    const deleted = userData.splice(index, 1)[0]
    return { ...deleted }
  }
}

export default userService