const {expect, assert} = require('chai')
const axios = require('axios')
// const fetchUtil = require('./api-utils').fetchUtil
require('dotenv').config()

const port = process.env.PORT || 5000

const path = `http://localhost:${port}/`

describe('Tasks API', function() {
  


  it('should be able to create and see a task', async () => {
    const task = {
      title: 'Test task',
      duration: 15,
      priority: 4
    }
    const newTask = await axios.post(path + 'tasks', task)
    console.log('new task:', newTask)
    // const taskResponse = await axios.get(`tasks/${newTask._id}`)
    // expect(taskResponse.body).to.eql(task)
  })
})
