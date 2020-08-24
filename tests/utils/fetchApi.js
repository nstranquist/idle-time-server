const fetch = require('node-fetch');
const bunyan = require('bunyan');
require('dotenv').config();

const log = bunyan.createLogger({ name: 'test' });

const port = process.env.PORT || 8080;

const path = `http://localhost:${port}/api`;

const fetchUtil = async (token, extension, method, body = undefined, bodyName = undefined) => {
  let result;

  const options = {
    method,
    headers: { 'x-access-token': token },
  };
  if (method === 'POST' || method === 'PUT') {
    options.headers['Content-Type'] = 'application/json';
    options.headers.Accept = 'application/json';
  }
  if (body) options.body = JSON.stringify({ [bodyName]: body });

  try {
    result = await fetch(path + extension, options);
    log('status:', result.status);
    const jsonresult = await result.json();
    log('result:', jsonresult);
    if (jsonresult.status === 'success' || result.status < 400) {
      return { ok: true, jsonresult };
    }

    return { ok: false, jsonresult };
  } catch (error) {
    log('error:', error);
    throw Error('new error while getting projects'); // requires error boundary
  }
};

module.exports = {
  fetchUtil,
  path,
};
