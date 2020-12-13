import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '../screens/AuthScreens/SignUpScreen';
import SignInScreen from '../screens/AuthScreens/SignInScreen';
import SplashScreen from '../screens/AuthScreens/SplashScreen';
import ForgetPassScreen from '../screens/AuthScreens/ForgetPassScreen';
import VerifyCodeScreen from '../screens/AuthScreens/VerifyCodeScreen';
import ChangePassScreen from '../screens/AuthScreens/ChangePassScreen';
import GroupIDScreen from '../screens/AuthScreens/GroupIDScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {

    return (
        <Stack.Navigator initialRouteName={"SplashScreen"} headerMode={"none"}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="ForgetPass" component={ForgetPassScreen} />
            <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
            <Stack.Screen name="ChangePass" component={ChangePassScreen} />
            <Stack.Screen name="GroupID" component={GroupIDScreen} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;