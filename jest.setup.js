// AsyncStorage is now mocked via the __mocks__ directory.
// The manual mock definition has been removed from here.

// Mock for react-native-get-random-values
jest.mock('react-native-get-random-values', () => ({
  getRandomBase64: jest.fn(),
}));

// Mock for Expo's Linking module
jest.mock('expo-linking', () => {
  const actualLinking = jest.requireActual('expo-linking');
  return {
    ...actualLinking,
    createURL: jest.fn((path) => `exp://127.0.0.1:8081/${path}`),
    resolveScheme: jest.fn(() => 'exp'),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(),
    canOpenURL: jest.fn(() => Promise.resolve(true)),
    getInitialURL: jest.fn(() => Promise.resolve(null)),
  };
});

// Silence console during tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };
