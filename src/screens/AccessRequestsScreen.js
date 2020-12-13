import React from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList,
    TouchableOpacity, ToastAndroid } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import { useDispatch, useSelector } from 'react-redux';
import { updateUserRequest } from '../components/api';
import * as actions from '../redux/actions/index';
import * as SocketService from '../../services/socketService';

const { width, height } = Dimensions.get('screen');

const AccessRequestsScreen = () => { 

    const dispatch = useDispatch();
    const user = useSelector(state => state.userReducer.user);
    let notifications = user.notifications ? user.notifications.filter(notification => !notification.isRead) : [];

    const onClickConfirm = item => {
        updateUserRequest({
            user: {
                ...item.sender,
                isGroupApproved: true
            }
        })
        .then(res1 => {
            updateUser(item)
            .then(res2 => {
                dispatch(actions.setUser(res2));
                SocketService.emit('userUpdated', res1);
            })
            .catch(error => ToastAndroid.show(error.toString(), ToastAndroid.LONG));
        })
        .catch(error => ToastAndroid.show(error.toString(), ToastAndroid.LONG));
    }

    const onClickDeny = item => {
        updateUser(item)
        .then(res => dispatch(actions.setUser(res)))
        .catch(error => ToastAndroid.show(error.toString(), ToastAndroid.LONG));
    }

    const updateUser = async (item) => {
        try {
            const ans = await updateUserRequest({
                user: {
                    ...user,
                    notifications: user.notifications
                    .map(notification => notification._id === item._id ?
                    { ...item, isRead: true } : notification)
                }
            });

            return ans;
        } catch(error) {
            throw error;
        }
    }

    return(
        <View style={Styles.containerStyle}>
            <FlatList 
                data={notifications}
                renderItem={({ item }) => (
                    <View style={Styles.itemStyle}>
                        <Text style={Styles.itemTextStyle}>
                            {`${item.content.slice(0, 32)}\n${item.content.slice(32)}`}
                        </Text>
                        <View style={Styles.itemIconsViewStyle}>
                            <View style={Styles.itemIconsViewStyle}>
                                <TouchableOpacity 
                                    style={Styles.itemIconStyle} 
                                    onPress={() => onClickConfirm(item)}>
                                    <AntDesign name="checkcircleo" size={width * 0.11} color="green" />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    onPress={() => onClickDeny(item)}>
                                    <AntDesign name="closecircleo" size={width * 0.11} color="red" />
                                </TouchableOpacity>
                            </View>    
                        </View>
                    </View>
                )}
                keyExtractor={item => item.isRead ? null :item._id}
            />
        </View>
    );
}

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
    itemTextStyle: {
        fontSize: width * 0.03,
        alignSelf: 'center'
    },
    iconStyle: {
        height: width * 0.16,
        width: width * 0.16,
        borderRadius: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemIconStyle: {
        marginHorizontal: width * 0.09
    }  
});

export default AccessRequestsScreen;