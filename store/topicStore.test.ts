// AsyncStorage is now mocked via the __mocks__ directory.
// The explicit jest.mock call has been removed from here.

import { useTopicStore } from './topicStore'; // Standard import
import { Topic } from '../constants/topics';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For use in beforeEach
import { act } from '@testing-library/react-native';

// Mock for the data, path should match import in store/topicStore.ts
// Module has a default export, so mock must provide { default: ... }
jest.mock('../data/topicsData', () => ({
  default: Array.from({ length: 20 }, (_, i) => ({
    id: `T${String(i + 1).padStart(3, '0')}`,
    title: `Topic ${i + 1}`,
    description: `Desc ${i + 1}`,
    bullets: [],
  })),
}));

describe('useTopicStore', () => {
  // Define initial state structure based on your TopicState interface
  const initialStoreState = {
    currentTopic: null,
    history: [],
    // Include other state properties if they exist in your TopicState interface
    // e.g., generateRandomTopic: expect.any(Function), setCurrentTopic: expect.any(Function)
    // However, for setState, only data properties are needed.
  };

  beforeEach(async () => {
    // Clear the mock AsyncStorage before each test
    // The mock in jest.setup.js is already in place.
    await AsyncStorage.clear(); // This now refers to the mock's clear method
    
    // Reset Zustand store to its initial state
    // Zustand's getInitialState() returns the state slice including functions if not careful.
    // It's often better to reset to a known initial data structure.
    // Or, if your store definition exports its initial state:
    // useTopicStore.setState(exportedInitialState, true);
    
    // For a simple reset of data properties:
    act(() => {
      // To satisfy TypeScript when `replace: true`, ensure all state members are present.
      // Functions are part of the state type but shouldn't be overwritten by the reset.
      // So, we take the existing functions and reset only data properties.
      const { generateRandomTopic, setCurrentTopic } = useTopicStore.getState();
      useTopicStore.setState({
        currentTopic: null,
        history: [],
        generateRandomTopic,
        setCurrentTopic,
      }, true);
    });

    // Clear mock function call stats (part of the mock in jest.setup.js)
    (AsyncStorage.clear as jest.Mock).mockClear();
    (AsyncStorage.setItem as jest.Mock).mockClear();
    (AsyncStorage.getItem as jest.Mock).mockClear();
    (AsyncStorage.removeItem as jest.Mock).mockClear();
    (AsyncStorage.getAllKeys as jest.Mock).mockClear();
    (AsyncStorage.multiGet as jest.Mock).mockClear();
    (AsyncStorage.multiSet as jest.Mock).mockClear();
    (AsyncStorage.multiRemove as jest.Mock).mockClear();
  });

  it('should have correct initial state', () => {
    // Access state after reset for initial state check
    const state = useTopicStore.getState();
    expect(state.currentTopic).toBeNull();
    expect(state.history).toEqual([]);
  });

  describe('generateRandomTopic', () => {
    it('should set a currentTopic', () => {
      act(() => {
        useTopicStore.getState().generateRandomTopic();
      });
      const { currentTopic } = useTopicStore.getState();
      expect(currentTopic).not.toBeNull();
      expect(currentTopic).toHaveProperty('id');
      expect(currentTopic).toHaveProperty('title');
    });

    it('should add the new topic to the beginning of history', () => {
      act(() => {
        useTopicStore.getState().generateRandomTopic();
      });
      const { currentTopic, history } = useTopicStore.getState();
      expect(history.length).toBe(1);
      expect(history[0]).toEqual(currentTopic);
    });

    it('should not exceed history limit of 10', () => {
      act(() => {
        for (let i = 0; i < 15; i++) {
          useTopicStore.getState().generateRandomTopic();
        }
      });
      const { history } = useTopicStore.getState();
      expect(history.length).toBe(10);
    });
    
    it('should add different topics to history on subsequent calls', () => {
      act(() => {
        useTopicStore.getState().generateRandomTopic();
        useTopicStore.getState().generateRandomTopic();
        useTopicStore.getState().generateRandomTopic();
      });
      const { history } = useTopicStore.getState();
      if (history.length > 1) {
          expect(history[0].id).not.toEqual(history[1].id);
      }
      expect(history.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('setCurrentTopic', () => {
    const sampleTopic: Topic = { id: 'TS1', title: 'Sample Topic', description: 'Sample Desc', bullets: [] };

    it('should correctly set the currentTopic', () => {
      act(() => {
        useTopicStore.getState().setCurrentTopic(sampleTopic);
      });
      const { currentTopic } = useTopicStore.getState();
      expect(currentTopic).toEqual(sampleTopic);
    });

    it('should add the topic to the history', () => {
      act(() => {
        useTopicStore.getState().setCurrentTopic(sampleTopic);
      });
      const { currentTopic, history } = useTopicStore.getState();
      expect(history.length).toBe(1);
      expect(history[0]).toEqual(currentTopic);
    });

    it('should not add duplicate to history if topic is already current and most recent in history', () => {
      act(() => {
        useTopicStore.getState().setCurrentTopic(sampleTopic);
        useTopicStore.getState().setCurrentTopic(sampleTopic);
      });
      const { history } = useTopicStore.getState();
      expect(history.length).toBe(1);
    });

    it('should move topic to the front of history if it exists elsewhere in history', () => {
      const topic1: Topic = { id: 'T001', title: 'Topic 1', description: 'Desc 1', bullets: [] };
      const topic2: Topic = { id: 'T002', title: 'Topic 2', description: 'Desc 2', bullets: [] };
      act(() => {
        useTopicStore.getState().setCurrentTopic(topic1);
        useTopicStore.getState().setCurrentTopic(topic2);
        useTopicStore.getState().setCurrentTopic(topic1);
      });
      const { history } = useTopicStore.getState();
      expect(history.length).toBe(2);
      expect(history[0].id).toBe('T001');
      expect(history[1].id).toBe('T002');
    });
  });
  
  describe('Persistence with AsyncStorage', () => {
    it('should call AsyncStorage.setItem when state changes', () => {
      act(() => {
        useTopicStore.getState().generateRandomTopic();
      });
      // AsyncStorage is imported and its methods are jest.fn() due to the mock
      expect(AsyncStorage.setItem).toHaveBeenCalled();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'topic-storage', // This is the 'name' option in persist
        expect.any(String) // The serialized state
      );
    });
  });
});
