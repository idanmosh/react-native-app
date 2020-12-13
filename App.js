import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './src/redux/store'; 
import RootNavigator from './src/navigation/RootNavigator';

const App = RootNavigator;

export default () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <StatusBar />
        <App />
      </PaperProvider>
    </Provider>
  );
};