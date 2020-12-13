import React from 'react';
import { View, StyleSheet, Image, ToastAndroid, Text, Dimensions } from 'react-native';
import { DrawerItem } from '@react-navigation/drawer';
import { Drawer } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient'; 
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 
import * as actions from '../redux/actions/index';
import { removeData, retrieveData } from '../components/asyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import { signOutRequest } from '../components/api';

const { width, height } = Dimensions.get('screen');

export const DrawerContent = props => {
    const dispatch = useDispatch();
    const rootNav = useSelector(state => state.rootNavReducer.navigator);
    const user = useSelector(state => state.userReducer.user);
    let notifications = user.notifications ? user.notifications.filter(notification => !notification.isRead) : [];

    return (
        <View style={{ flex: 1 }}>
            <View style={Styles.drawerContent} {...props}>
                <View style={Styles.userInfoSection}>
                    <Image source={require('../../assets/Logo.png')}/>
                </View>
                <Drawer.Section style={Styles.drawerSection}>
                    <DrawerItem
                        icon={({color, size}) => (
                            <AntDesign 
                                name="home" 
                                size={size} 
                                color={color} 
                            />
                        )}
                        label={"Home"}
                        onPress={() => props.navigation.navigate("Home")}
                    />
                </Drawer.Section>
                <Drawer.Section style={Styles.drawerSection}>
                    <DrawerItem
                        icon={({color, size}) => (
                            <Feather 
                                name="settings" 
                                size={size} 
                                color={color} />
                        )}
                        label={"Settings"}
                        onPress={() => props.navigation.navigate("Settings")}
                    />
                </Drawer.Section>
                {
                    user.isAdmin ? 
                    <Drawer.Section style={Styles.drawerSection}>
                        <DrawerItem
                            icon={({color, size}) => (
                                <View>
                                    <MaterialCommunityIcons 
                                        name="format-list-checkbox" 
                                        size={size} 
                                        color={color} 
                                        style={notifications.length > 0 ? { position: 'absolute' } : null}/>
                                    {   
                                        notifications.length > 0 ?
                                        <LinearGradient
                                            colors={['#08d4c4', '#01ab9d']}
                                            style={Styles.iconStyle}
                                        >   
                                            <Text 
                                                style={Styles.badgeTextStyle}>
                                                    {notifications.length}
                                            </Text>
                                        </LinearGradient>
                                        :
                                        null
                                    }
                                </View>
                            )}
                            label={"Access  Requests"}
                            onPress={() => props.navigation.navigate("Access_Requests")}
                        />
                    </Drawer.Section>
                    : 
                    null
                }
            </View>
            <Drawer.Section style={Styles.bottomDrawerSection}>
                <DrawerItem
                    icon={({color, size}) => (
                        <FontAwesome 
                            name="sign-out" 
                            size={size} 
                            color={color}
                        />
                    )}
                    label={"Sign Out"}
                    onPress={() => { 
                        retrieveData('user')
                        .then(res => {
                            signOutRequest({ username: res })
                            .then(() => {
                                removeData('user')
                                .then(() => {
                                    dispatch(actions.setUser({}));
                                    rootNav.reset({ routes: [{ name: 'Loading' }] });
                                })
                                .catch(error => ToastAndroid.show(error.toString(), ToastAndroid.LONG));
                            })
                            .catch(error => ToastAndroid.show(error.toString(), ToastAndroid.LONG));
                        })
                        .catch(error => ToastAndroid.show(error.toString(), ToastAndroid.LONG));
                    }}
                />
            </Drawer.Section>
        </View>
    );
};

const Styles = StyleSheet.create({
    drawerContent: {
        flex: 1
    },  
    userInfoSection: {
        backgroundColor: '#448AFF',
        padding: 15,
        borderBottomWidth: 1,
        borderColor: '#F4F4F4'
    },
    drawerSection: {
        borderBottomWidth: 1,
        borderBottomColor: '#F4F4F4',
    },
    bottomDrawerSection: {
        borderTopColor: '#F4F4F4',
        borderTopWidth: 1
    },
    iconStyle: {
        height: width * 0.05,
        width: width * 0.05,
        borderRadius: 400,
        bottom: height * 0.005,
        left: width * 0.03
    },
    badgeTextStyle: {
       justifyContent: 'center',
       alignItems: 'center', 
       alignSelf: 'center', 
       fontSize: height * 0.015
    }  
});