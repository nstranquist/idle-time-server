// const { expect, assert } = require('chai');
// const fetch = require('node-fetch');
// const { path } = require('../utils/fetchApi'); // fetchUtil

// const headers = { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' };

// // const makeUser = (name, email, password) => ({
// //   name, email, password,
// // });

// describe('Users API', () => {
//   // before(() => {
//   //   // start server in test mode

//   // });
//   beforeEach(() => {
//     // connect to db

//   });
//   afterEach(() => {
//     // wipe db / disconnect

//   });
//   // after(() => {
//   //   // disconnect server and db

//   // });

//   it.only('should allow the user to signup', async () => {
//     const name = 'Nico';
//     const email = 'testuser5@gmail.com';
//     const password = 'Password!';

//     try {
//       const response = await fetch(`${path}/auth/signup`, {
//         method: 'POST',
//         headers,
//         body: `name=${name}&email=${email}&password=${password}`,
//       });
//       expect(response);
//     } catch (error) {
//       assert.fail(error.toString());
//     }
//   });

//   it.only('should allow the user to login', async () => {
//     const email = 'testuser3@gmail.com';
//     const password = 'Password!';

//     try {
//       const response = await fetch(`${path}/auth/login`, {
//         method: 'POST',
//         headers,
//         body: `email=${email}&password=${password}`,
//       });
//       const json = await response.json();
//       expect(json.message).to.eql('user found!');
//     } catch (error) {
//       assert.fail(error.toString());
//     }
//   });

//   it.only('should not allow the user to signup with invalid credentials', async () => {
//     const name = 'Brian';
//     const email = 'newuser10@gmail.com';
//     const password = 'Password!';

//     const badEmail = 'badEmail';
//     const takenEmail = 'nicostran@gmail.com';
//     const tooShortPassword = 'test';
//     // const empty = '';

//     // Duplicate Email
//     try {
//       const response = await fetch(`${path}/auth/signup`, {
//         method: 'POST',
//         headers,
//         body: `name=${name}&email=${takenEmail}&password=${password}`,
//       });
//       const json = await response.json();
//       assert.fail(json.message);
//     } catch (error) {
//       expect(error.message).to.eql('This email is already taken');
//     }

//     // Bad Email Format
//     try {
//       const response = await fetch(`${path}/auth/signup`, {
//         method: 'POST',
//         headers,
//         body: `name=${name}&email=${badEmail}&password=${password}`,
//       });
//       const json = await response.json();
//       assert.fail(json.message);
//     } catch (error) {
//       expect(error.message).to.eql('Please enter a valid email address');
//     }

//     // Too Short Password
//     try {
//       const response = await fetch(`${path}/auth/signup`, {
//         method: 'POST',
//         headers,
//         body: `name=${name}&email=${email}&password=${tooShortPassword}`,
//       });
//       const json = await response.json();
//       assert.fail(json.message);
//     } catch (error) {
//       expect(error.message).to.eql('The password is too short');
//     }

//     // // Empty Name
//     // try {
//     //   const response = await fetch(path + 'auth/signup', {
//     //     method: 'POST',
//     //     headers: headers,
//     //     body: `name=${empty}&email=${email}&password=${password}`
//     //   })
//     //   const json = await response.json()
//     //   assert.fail(json.message)
//     // } catch (error) {
//     //   expect(error.message).to.eql("The name is not defined")
//     // }

//     // // Empty Email
//     // try {
//     //   const response = await fetch(path + 'auth/signup', {
//     //     method: 'POST',
//     //     headers: headers,
//     //     body: `name=${name}&email=${empty}&password=${password}`
//     //   })
//     //   const json = await response.json()
//     //   console.log(json.message)

//     //   assert.fail(json.message)
//     // } catch (error) {
//     //   expect(error.message).to.eql("The email is not defined")
//     // }

//     // // Empty Password
//     // try {
//     //   const response = await fetch(path + 'auth/signup', {
//     //     method: 'POST',
//     //     headers: headers,
//     //     body: `name=${name}&email=${email}&password=${empty}`
//     //   })
//     //   const json = await response.json()
//     //   assert.fail(json.message)
//     // } catch (error) {
//     //   expect(error.message).to.eql("The password is not defined")
//     // }
//   });

//   it.only('should not allow the user to login with invalid credentials', async () => {
//     const invalidEmail = 'randomuser8912343@gmail.com';
//     const invalidPassword = 'akljdfkdsjfskldfjsdfkjdsf';

//     try {
//       const response = await fetch(`${path}auth/login`, {
//         method: 'POST',
//         headers,
//         body: `email=${invalidEmail}&password=${invalidPassword}`,
//       });
//       const json = await response.json();
//       assert.fail(json.message);
//     } catch (error) {
//       expect(error.message).to.eql('User not found!');
//     }
//   });
// });
