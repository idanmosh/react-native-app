import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, FlatList, Text,
    ToastAndroid, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient'; 
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import Feather from 'react-native-vector-icons/Feather'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 
import { fcmService } from '../notification/FCMService';
import { localNotificationService } from '../notification/LocalNotificationService';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserRequest, deleteCameraRequest, getCurrentUserRequest } from '../components/api';
import * as SocketService from '../../services/socketService';
import * as actions from '../redux/actions/index';

const { width, height } = Dimensions.get('screen');

//Home Screen
const HomeScreen = () => { 
    //App navigation reference
    const navigation = useNavigation();
    //User state properties
    const user = useSelector(state => state.userReducer.user);
    //Cameras state properties
    const cameras = useSelector(state => state.cameraReducer.cameras);
    //Global state dispatch reference
    const dispatch = useDispatch();
    
    //Register to push notification and generate new firebase token
    useEffect(() => {
        fcmService.registerAppWithFCM();
        fcmService.register(onRegister, onNotification, onOpenNotification);
        localNotificationService.configure(onRegister, onNotification, onOpenNotification);
        localNotificationService.createChannels();

        return () => {
            console.log('[App] unRegister');
            fcmService.unRegister();
            localNotificationService.unregister();
        }
    }, []);

    //Setup socket service
    useEffect(() => {
        SocketService.setup(user._id);
        SocketService.on(`updateUser-${user._id}`, () => {
            getCurrentUserRequest(user.email)
            .then(res => {
                dispatch(actions.setUser(res));
                console.log('[App Socket] user updated');
            })  
            .catch(error => ToastAndroid.show(error.toString(), ToastAndroid.LONG));
        });
    }, []);

    //Update user if is change in firebase push notification token
    const onRegister = (token) => {
        console.log('[App] onRegister: ', token);
        if(user.fireBaseToken !== token) {
            let userObj = { 
                ...user,
                fireBaseToken: token
            };
            updateUserRequest({ user: userObj })
            .then(res => {
                if(res.fireBaseToken !== user.fireBaseToken)
                    dispatch(actions.setUser(res));
            })
            .catch(error => ToastAndroid.show(error.toString(), ToastAndroid.LONG));
        }
    }

    //On get new push notification
    const onNotification = (notify) => { 
        console.log('[App] onNotification: ', notify);
        localNotificationService.showNotification(notify);
    }

    //On user open notification
    const onOpenNotification = (notification) => {
        console.log('[App] onOpenNotification: ', notification);
        if(notification.data.case === 'join group req')
            navigation.navigate('Access_Requests');
    }

    //Alert ask if delete camera from list of cameras
    const askDelete = (item) => {
        console.log(item);
        Alert.alert(
            `Camera ${item.details.name}`,
            `Are you sure you want to delete ${item.details.name} Camera?`,
            [
                {
                    text: 'Yes',
                    onPress: () => deleteItem(item)
                },
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel' 
                },
            ]
            ,{ cancelable: false }
        );
    }

    //Delete camera from list of cameras
    const deleteItem = (item) => {
        deleteCameraRequest(item._id)
        .then(res => {
            SocketService.emit('removeCamera', item);
            dispatch(actions.removeCamera(item));
            ToastAndroid.show(`Camera ${item.details.name} deleted successfully!`, ToastAndroid.SHORT);
        })
        .catch(error => {
            ToastAndroid.show(`${error.toString()}`, ToastAndroid.LONG);
        });
    }

    //When user to on edit camera icon navigate to edit camera screen
    const editItem = (item) => {
        dispatch(actions.insertCurrCamera(item));
        navigation.navigate('Edit_Camera');
    }
    

    return(
        <View style={{ flex: 1 }}>
            {
                user.isGroupApproved ? 
                <View style={Styles.containerStyle}>
                    <FlatList 
                        data = {cameras}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                onPress={() => {
                                    dispatch(actions.insertCurrCamera(item));
                                    navigation.navigate('Camera_Screen');
                                }}
                                style={Styles.itemStyle}>
                                <Text style={Styles.itemTextStyle}>{item.details.name}</Text>
                                <View style={Styles.itemIconsViewStyle}>
                                    <TouchableOpacity style={Styles.itemIconStyle} onPress={() => editItem(item)}>
                                        <MaterialCommunityIcons name="pencil-outline" size={30} color="black" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => askDelete(item)}>
                                        <Feather name="trash" size={28} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item._id}
                    />
                    <TouchableOpacity
                                style={Styles.buttonStyle} 
                                onPress={() => navigation.navigate('Add_Camera')}>
                                <LinearGradient
                                    colors={['#448AFF', '#448AFF']}
                                    style={Styles.iconStyle}
                                    >
                                        <AntDesign name="plus" size={width * 0.08} color="black" />
                                </LinearGradient>
                    </TouchableOpacity>
                </View>
                :
                <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', flex: 1  }}>
                    <Text style={Styles.messageStyle}>{'Waiting approval from the group manager'}</Text>
                </View>
            }
        </View>
    );
};

const Styles = StyleSheet.create({
    containerStyle: {
        flex: 1,
        marginTop: 3
    },
    itemStyle: {
        flex: 1,
        margin: 3,
        backgroundColor: 'white', 
        height: height * 0.12,
        borderRadius: 5,
        padding: 10,
        elevation: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    itemIconsViewStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemIconStyle: {
        marginHorizontal: width * 0.04
    },
    itemTextStyle: {
        fontSize: 18,
        alignSelf: 'center'
    },
    iconStyle: {
        height: width * 0.16,
        width: width * 0.16,
        borderRadius: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },  
    buttonStyle: {
        position: 'absolute', 
        bottom: height * 0.01,
        margin: width * 0.04,
        borderRadius: 400, 
        elevation: 8 
    },
    messageStyle: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: width * 0.04
    }
});

export default HomeScreen;