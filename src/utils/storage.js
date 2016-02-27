if (typeof localStorage === 'undefined' || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  GLOBAL.localStorage = new LocalStorage('./storage');
}

const storage = {};

storage.setItem = (key, value) => {
  try {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.log(error);
  }
};

storage.getItem = (key) => {
  const value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

export default storage;
