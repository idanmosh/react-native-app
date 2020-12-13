import React, { useEffect, useState } from 'react';
import { ToastAndroid, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUserRequest, getCamerasRequest } from '../../components/api';
import * as actions from '../../../src/redux/actions/index';
import { retrieveData } from '../../components/asyncStorage';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import loader from '../../../assets/loader_points.json';

const LoadingScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.userReducer.user);

    const checkUserExist = () => {
        retrieveData('user')
        .then(res => {
            if(res) {
                getCurrentUserRequest(res)
                .then(res => {
                    console.log(`get user: ${res}`);
                    if(res) {
                        dispatch(actions.setUser(res));
                        return res.groupId
                    }
                    else 
                        dispatch(actions.setUser({ param: '' }));
                })
                .then(groupId => {
                    getCamerasRequest(groupId)
                    .then(res => {
                        dispatch(actions.insertCameras(res));
                    })
                    .catch(error => {
                        ToastAndroid.show(error.toString(), ToastAndroid.LONG);
                        dispatch(actions.setUser({ param: '' }));
                    });
                })
                .catch(error => {
                    console.log(error);
                    ToastAndroid.show(error.toString(), ToastAndroid.LONG);
                    dispatch(actions.setUser({ param: '' }));
                });
            }
            else
                dispatch(actions.setUser({ param: '' }));
        })
        .catch(error => {
            ToastAndroid.show(error.toString(), ToastAndroid.LONG);
            dispatch(actions.setUser({ param: '' }));
        });
    }

    useEffect(() => {
        setTimeout(() => {
            checkUserExist()
        }, 3000);
    }, []);

    useEffect(() => {
        if(Object.keys(user).length === 0) return;
        dispatch(actions.setNav(navigation));
        if(user.email) 
            navigation.reset({ routes: [{ name: 'App' }] });
        else
            navigation.reset({ routes: [{ name: 'Auth' }] });
    }, [user]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LottieView  source={loader} loop autoPlay/>
        </View>
    );
   
};

export default LoadingScreen;