const {expect, assert} = require('chai')
const axios = require('axios')

const path = 'http://localhost:5000/'

describe('Tasks API', function() {
  setupTest(this)

  it.only('should not allow the user to signup with invalid form', async () => {
    const tooShortPassword = 'test'
    const badEmail = 'test@example'
    const emptyPassword = ''

    try {
      await axios.post(path + 'auth/signup', {
        name: 'Brian',
        email: 'test@example.com',
        password: tooShortPassword,
      }, {
        headers: { 'Content-Type':'application/x-www-form-urlencoded' }
      })
      assert.fail()
    } catch (e) {
      expect(e.response.data.message).to.eql('Internal Error: Something looks wrong')
    }

    try {
      await axios.post(path + 'auth/signup', {
        name: 'Brian',
        email: 'test@example.com',
        password: 'Password1!',
      }, {
        headers: { 'Content-Type':'application/x-www-form-urlencoded' }
      })
      assert.fail()
    } catch (e) {
      expect(e.response.data.message).to.eql('Internal Error: Something looks wrong')
    }

    // try {
    //   await axios.post(path + 'auth/signup', {
    //     name: 'Brian',
    //     email: 'test@example.com',
    //     password: emptyPassword,
    //   }, {
    //     headers: { 'Content-Type':'application/x-www-form-urlencoded' }
    //   })
    //   assert.fail()
    // } catch (e) {
    //   expect(e.response.data.message).to.eql('Internal Error: Something looks wrong')
    // }

  })


  it('should be able to create and see a task', async () => {
    const task = {
      title: 'Test task',
      duration: 15,
      priority: 1,
      dayOfSchedule: 1,
    }
    const newTask = await axios.post(path + 'tasks', task)
    // const taskResponse = await axios.get(`/tasks/${newTask._id}`)
    // expect(taskResponse.body).to.eql(task)
  })
})
