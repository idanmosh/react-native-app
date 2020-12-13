import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions,
    BackHandler, TextInput, ScrollView, ToastAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign'; 
import * as Animatable from 'react-native-animatable';
import { getGroupIdRequest, getPublicIP } from '../../components/api';
import { signUpRequest } from '../../components/api';
import { removeData, retrieveData } from '../../components/asyncStorage';
import { Permission, PERMISSION_TYPE } from '../../components/Permissions';
import Geolocation from 'react-native-geolocation-service';
import NetInfo from "@react-native-community/netinfo";
import LottieView from 'lottie-react-native';
import * as SocketService from '../../../services/socketService';

const { width, height } = Dimensions.get('screen');

const initialState = {
    groupId: '',
    loading: false,
    messageGroupId: '',
    messageErr: '',
    editable: true
};

const GroupIDScreen = () => { 
    const navigation = useNavigation();
    const[details, setDetails] = useState({ ...initialState });

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackBtn);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackBtn);
        }
    }, []);

    const handleBackBtn = () => {
        BackHandler.exitApp();
        return true;
    };

    const onChangeDetail = (key, value) => {
        setDetails({ ...details, [key]: value });
    };

    const setMessages = () => {
        setDetails({ 
            ...details,
            messageGroupId: ''
        });
    };

    const requestLocationPermissions = async () => {
        let checkLocationPermissions = await 
            Permission.checkPermissions([PERMISSION_TYPE.fine_location, PERMISSION_TYPE.coarse_location])
        .then(res => res)
        .catch(error => false);
        if(!checkLocationPermissions)
            checkLocationPermissions = await Permission.requestMultiple([PERMISSION_TYPE.fine_location, PERMISSION_TYPE.coarse_location])
            .then(res => res);

        return checkLocationPermissions;
    }

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    resolve(position.coords);
                },
                (error) => {
                    reject(error);
                },
                { enableHighAccuracy: true, timeout: 15000 }
            );
        });
    }

    const onClickSearch = () => {
        requestLocationPermissions()
            .then(res => {
                if(res) {
                    setDetails({ ...details, messageErr: '' });
                    NetInfo.fetch().then(state => {
                        if(state.type === 'wifi') {
                            setDetails({ ...details, loading: true });
                            setTimeout(() => {
                                getLocation()
                                .then(position => {
                                    getPublicIP()
                                    .then(publicIp => {
                                        getGroupIdRequest({ 
                                            lat: position.latitude, 
                                            lng: position.latitude, 
                                            publicIp 
                                        })
                                        .then(res => {
                                            setStateDetails(res);
                                        })
                                        .catch(error => setMessagesErrors(error.toString()));
                                    })
                                    .catch(error => setMessagesErrors(error.toString()));
                                })
                                .catch(error => setMessagesErrors(error.toString()));
                            }, 3000);
                        }
                        else 
                            setMessagesErrors('You must be on your wifi network to start the search');
                    });
                }
                else 
                    setMessagesErrors('You must give Pool-off access to your device location');
            });
    }

    const setMessagesErrors = (error) => {
        setMessages();
        onChangeDetail('messageErr', `*${error}`);
    }

    const setStateDetails = (res) => {
        if(res) {
            setDetails({ 
                ...details, 
                loading: false, 
                groupId: res, 
                messageErr: '', 
                editable: false 
            });
            ToastAndroid.show(`Found group-ID: ${res}`, ToastAndroid.LONG);
        }
        else {
            setDetails({ 
                ...details, 
                loading: false, 
                groupId: '', 
                messageErr: '',
                editable: true 
            });
            ToastAndroid('Not Found Group-ID near to your location, try again or insert it manually');
        }
    }

    const goToSignIn = () => {
        retrieveData('currentUser')
        .then(res => {
            signUpRequest({ ...res, groupId: details.groupId })
            .then(res => {
                removeData('currentUser');
                if(res.isAdmin) {
                    console.log(res);
                    SocketService.setup(res._id);
                    SocketService.emit('onInit', res);
                    SocketService.terminate();
                }
                navigation.reset({ routes: [{ name: 'SignIn' }] });
            })
            .catch(error => {
                setMessages();
                onChangeDetail('messageErr', `*${error}`);
            });
        })
        .catch(error => {
            setMessages();
            onChangeDetail('messageErr', `*${error}`);
        });
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'handled'}>
                {
                    details.loading ? 
                    <View style={Styles.radarStyle}>
                        <LottieView 
                            style={{ width: width * 0.9, height: height * 0.4 }}  
                            source={require('../../../assets/radar.json')} loop autoPlay
                        />
                    </View>
                    : 
                    <View style={Styles.container}>
                        <View style={Styles.header}>
                            <Text style={Styles.textHeader}>Add your group ID</Text>
                        </View>
                        <Animatable.View 
                            style={Styles.footer}
                            animation="fadeInUpBig"
                            duration={1500}
                        >
                            <Text style={Styles.text_footer}>Group-ID:</Text>
                            <View style={Styles.action}>
                                <AntDesign name="addusergroup" size={24} color="black" />
                                <TextInput
                                    editable={details.editable} 
                                    placeholder={"Group ID"}
                                    returnKeyType={details.groupId !== '' ? "done" : "search"}
                                    onSubmitEditing={details.groupId !== '' ? onClickSearch : goToSignIn} 
                                    style={Styles.textInput}
                                    onChangeText={groupId => onChangeDetail('groupId', groupId)}
                                    autoCapitalize={"none"}
                                    defaultValue={details.groupId}
                                />
                            </View>
                            {details.messageGroupId !== '' ? <Text style={Styles.messageErr}>{details.messageGroupId}</Text> : null}
                            <View style={Styles.button}>
                                <TouchableOpacity
                                    style={Styles.signIn}
                                    onPress={onClickSearch}
                                >
                                    <LinearGradient
                                        colors={['#448AFF', '#448AFF']}
                                        style={Styles.signIn}
                                    >
                                        <Text style={[Styles.textSignIn, { color: '#fff' }]}>Search Group ID</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity 
                                        style={[Styles.signIn, { borderColor: '#448AFF', borderWidth: 1, marginTop: 15 }]} 
                                        onPress={goToSignIn}>
                                        <Text style={[Styles.textSignIn, { color: '#448AFF' }]}>Verify Group ID</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {details.messageErr !== '' ? <Text style={Styles.messageErr}>{details.messageErr}</Text> : null}
                        </Animatable.View>
                    </View>
                }
        </ScrollView>
    );
}

const Styles = StyleSheet.create({
    container: {
        backgroundColor: '#448AFF',
        flex: 1
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30, 
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    textHeader: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: height * 0.01,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
        color: '#05375a',
        margin: 0,
        padding: 0
    },
    button: {
        alignItems: 'center',
        marginTop: height * 0.05
    },
    signIn: {
        width: '100%',
        height: height * 0.06,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    footerButtons: {
        width: '48%',
        height: height * 0.06,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: '2%'
    },  
    textSignIn: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    messageErr: {
        fontSize: 12,
        color: 'red'
    },
    radarStyle: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center', 
        width, 
        height, 
        backgroundColor: '#009387'
    }
});

export default GroupIDScreen;

