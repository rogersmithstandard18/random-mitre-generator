let store = {};
export default {
  setItem: jest.fn((key, value) => {
    store[key] = value;
    return Promise.resolve(null);
  }),
  getItem: jest.fn((key) => {
    return Promise.resolve(store[key] || null);
  }),
  removeItem: jest.fn((key) => {
    delete store[key];
    return Promise.resolve(null);
  }),
  clear: jest.fn(() => {
    store = {};
    return Promise.resolve(null);
  }),
  getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
  multiGet: jest.fn(keys => Promise.resolve(keys.map(key => [key, store[key] || null]))),
  multiSet: jest.fn(keyValuePairs => {
    keyValuePairs.forEach(([key, value]) => {
      store[key] = value;
    });
    return Promise.resolve(null);
  }),
  multiRemove: jest.fn(keys => {
    keys.forEach(key => {
      delete store[key];
    });
    return Promise.resolve(null);
  }),
};
