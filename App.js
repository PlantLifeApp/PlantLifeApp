import { StyleSheet } from 'react-native';
import { AuthProvider } from './context/authContext';
import AuthNavigator from './navigation/AuthNavigator';

export default function App() {
  return (
    <AuthProvider>
      <AuthNavigator />
    </AuthProvider>
  );
}