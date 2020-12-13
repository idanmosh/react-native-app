import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './DrawerNavigator';
import AuthNavigator from './AuthNavigator';
import LoadingScreen from '../screens/AuthScreens/LoadingScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Loading' headerMode={"none"}>
                <Stack.Screen name="Loading" component={LoadingScreen}/>
                <Stack.Screen name="Auth" component={AuthNavigator} />
                <Stack.Screen name="App" component={DrawerNavigator} />
            </Stack.Navigator> 
        </NavigationContainer>
    );
}

export default RootNavigator;