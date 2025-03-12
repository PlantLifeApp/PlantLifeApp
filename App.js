import { StyleSheet } from 'react-native';
import { AuthProvider } from './context/authContext';
import AuthNavigator from './navigation/AuthNavigator';

export default function App() {
  return (
    <AuthNavigator />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
