import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeNavigation from '../navigation/HomeNavigator';
import AddCameraNavigator from '../navigation/AddCameraNavigator';
import SettingsNavigator from '../navigation/SettingsNavigator';
import CameraNavigator from './CameraNavigator';
import ChangePasswordNavigator from './ChangePasswordNavigator';
import EditCameraNavigator from './EditCameraNavigator';
import AccessRequestsNavigator from './AccessRequestsNavigator';
import PaintScreen from '../screens/PaintOnScreen';
import { DrawerContent } from './DrawerContent';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    
    return(
        <Drawer.Navigator initialRouteName={"Home"} drawerContent={props => <DrawerContent {...props}  />}>
            <Drawer.Screen name="Home" component={HomeNavigation} />
            <Drawer.Screen name="Add_Camera" component={AddCameraNavigator} options={{ unmountOnBlur: true }}/>
            <Drawer.Screen name="Settings" component={SettingsNavigator} options={{ unmountOnBlur: true }}/>
            <Drawer.Screen name="Camera_Screen" component={CameraNavigator} options={{ unmountOnBlur: true }}/>
            <Drawer.Screen name="Change_Password" component={ChangePasswordNavigator} options={{ unmountOnBlur: true }}/>
            <Drawer.Screen name="Edit_Camera" component={EditCameraNavigator} options={{ unmountOnBlur: true }}/>
            <Drawer.Screen name="Access_Requests" component={AccessRequestsNavigator} options={{ unmountOnBlur: true }}/>
            <Drawer.Screen name="Paint_Screen" component={PaintScreen} options={{ unmountOnBlur: true }}/>
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;

