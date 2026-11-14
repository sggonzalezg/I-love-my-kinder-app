jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));

it('mock', () => {
  try {
    const mod = require('react-native-reanimated/mock');
    console.log(Object.keys(mod).length);
  } catch (error) {
    console.log(String(error), (error as Error).stack?.split('\n').slice(0, 8).join('\n'));
  }
});
