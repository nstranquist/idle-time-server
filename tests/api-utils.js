const fetch = require('node-fetch')
require('dotenv').config()

const port = process.env.PORT || 5000;

const path = `http://localhost:${port}/`

const fetchUtil = async (token, extension, method, body=undefined, bodyName=undefined) => {
  let result;
  
  const options = {
    method: method,
    headers: { 'x-access-token': token }
  }
  if(method==="POST" || method==="PUT") {
    options.headers['Content-Type'] = "application/json";
    options.headers['Accept'] = "application/json";
  }
  if(body)
    options.body = JSON.stringify({ [bodyName]: body })

  try {
    result = await fetch(path + extension, options)
    console.log('result:', result, 'status:', result.status)
    const jsonresult = await result.json();
    if(jsonresult.status ==="success" || result.status < 400) {
      return { ok: true, jsonresult }
    }
    else {
      return { ok: false, jsonresult }
    }
  } catch (error) {
    console.log('error:', error)
    throw Error("new error while getting projects") // requires error boundary
  }
}

module.exports = {
  fetchUtil,
  path
}