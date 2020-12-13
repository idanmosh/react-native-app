import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TextInput, Text, ScrollView,
    Dimensions, TouchableOpacity, BackHandler } from 'react-native';
import { Picker } from '@react-native-community/picker';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import { checks } from '../components/AddCameraChecks';
import { useDispatch, useSelector } from 'react-redux';
import constants from '../constants.json';
import LottieView from 'lottie-react-native';
import * as actions from '../redux/actions/index';
import * as SocketService from '../../services/socketService';
import loader from '../../assets/loader_points.json';

const { width, height } = Dimensions.get('window');

const initialState = {
    name: '',
    ip: '',
    protocol: '554',
    userID: '',
    pass: '',
    nameErr: '',
    ipErr: '',
    userIDErr: '',
    passErr: '',
    groupIdErr: '',
    messageErr: '',
    secureTextEntry: true,
    loading: false
}; 

const AddCameraScreen = () => {
    const navigation = useNavigation();
    const refs = useRef([
        'ipAdress',
        'userID',
        'pass'
    ]);
    const user = useSelector(state => state.userReducer.user);
    const cameras = useSelector(state => state.cameraReducer.cameras);
    const dispatch = useDispatch();
    const [camDetails, setCamDetails] = useState({ ...initialState });

    useEffect(() => {
        SocketService.on(`retFirstFrame-${user.groupId}`, (data) => {
            if(data.frame) {
                dispatch(actions.insertCurrCamera(data));
                dispatch(actions.insertScreen('Add_Camera'));
                navigation.navigate('Paint_Screen');
            }
            else
                setCamDetails({ 
                    ...camDetails,
                    messageErr: '*Error when try to connect camera, please check camera connection and camera details you enter' 
                });
        });
    }, []);

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackBtn);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackBtn);
        }
    }, []);

    const handleBackBtn = () => {
        return false;
    };

    const onChangeDetail = (key, value) => {
        setCamDetails({ ...camDetails, [key]: value });
    };

    const onCancelClick = () => {
        navigation.goBack();
    };

    const onSaveClick = () => {
        const result = checks(camDetails);

        if(result.check) {
            if(checkCameraName())
                checkCameraDetails();
        }
        else 
            setCamDetails({ 
                ...camDetails, 
                ...result.camDetails, 
                messageErr: '' 
            });
    };

    const checkCameraName = () => {
        let camera = cameras.filter(camera => camera.details.name === camDetails.name);
        return camera.length === 0;
    }

    const getprotocolType = () => {
        if(camDetails.protocol === '554')
            return 'rtsp';
        return '8080';
    }

    const checkCameraDetails = () => {
        const cameraUrl = `${getprotocolType()}://${camDetails.userID}:${camDetails.pass}@${camDetails.ip}:${camDetails.protocol}`;
        
        const streamFromUrl = `${constants.BASE_URL.replace(':5000/api', '')}:8000/live/${user.groupId}.flv`;
        
        const streamToUrl = `${constants.BASE_URL.replace('http', 'rtmp').replace(':5000/api', '')}:1935/live/${user.groupId}`;

        const camera = {
            size: { 
                width: Math.floor(width),
                height: Math.floor(height * 0.7) 
            },
            groupId: user.groupId,
            cameraUrl,
            streamFromUrl,
            streamToUrl,
            details: {
                name: camDetails.name,
                ip: camDetails.ip,
                protocol: camDetails.protocol,
                userID: camDetails.userID,
                userPass: camDetails.pass
            }
        }

        setCamDetails({ 
            ...camDetails, 
            loading: true,
            nameErr: '',
            ipErr: '',
            userIDErr: '',
            passErr: '',
            groupIdErr: '',
        });
        SocketService.emit('requestFirstFrame', camera);
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'handled'}>
            {
                camDetails.loading ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView  source={loader} loop autoPlay/>
                </View>
                :
                <View style={Styles.container}>
                    <View style={Styles.header}>
                        <Text style={Styles.textHeader}>Add Camera</Text>
                    </View>
                    <Animatable.View 
                        style={Styles.footer}
                        animation="fadeInUpBig"
                        duration={1500}
                    >
                            <Text style={[Styles.text_footer, { marginTop: height * 0.02 }]}>Camera Name:</Text>
                            <View style={Styles.action}>
                                <TextInput 
                                    placeholder={"Camera Name"}
                                    returnKeyType={"next"}
                                    onSubmitEditing={() => refs.current['ipAdress'].focus()}
                                    style={Styles.textInput}
                                    defaultValue={camDetails.name}
                                    onChangeText={name => onChangeDetail('name', name)}
                                    autoCapitalize={"none"}
                                />
                            </View>
                            {camDetails.nameErr !== '' ? <Text style={Styles.messageErr}>{camDetails.nameErr}</Text> : null}
                            <Text style={[Styles.text_footer, { marginTop: height * 0.02 }]}>IP adress:</Text>
                            <View style={Styles.action}>
                                <TextInput 
                                    ref={ref => refs.current['ipAdress'] = ref}
                                    returnKeyType={"next"}
                                    onSubmitEditing={() => refs.current['userID'].focus()}
                                    placeholder={"IP adress or Domain name"}
                                    style={Styles.textInput}
                                    defaultValue={camDetails.ip}
                                    onChangeText={ip => onChangeDetail('ip', ip)}
                                    autoCapitalize={"none"}
                                />
                            </View>
                            {camDetails.ipErr !== '' ? <Text style={Styles.messageErr}>{camDetails.ipErr}</Text> : null}
                            <View style={Styles.pickerStyle}>
                                <Picker
                                    selectedValue={camDetails.protocol}
                                    mode="dialog"
                                    onValueChange={protocol => onChangeDetail('protocol', protocol)}
                                >
                                    <Picker.Item label="rtsp" value="554" />
                                    <Picker.Item label="http" value="8080" />
                                </Picker>
                            </View>
                            <Text style={[Styles.text_footer, { marginTop: height * 0.02 }]}>Camera User-ID:</Text>
                            <View style={Styles.action}>
                                <TextInput 
                                    ref={ref => refs.current['userID'] = ref}
                                    returnKeyType={"next"}
                                    onSubmitEditing={() => refs.current['pass'].focus()}
                                    placeholder={"Camera User-ID"}
                                    style={Styles.textInput}
                                    defaultValue={camDetails.userID}
                                    onChangeText={userID => onChangeDetail('userID', userID)}
                                    autoCapitalize={"none"}
                                />
                            </View>
                            {camDetails.userIDErr !== '' ? <Text style={Styles.messageErr}>{camDetails.userIDErr}</Text> : null}
                            <Text style={[Styles.text_footer, { marginTop: height * 0.02 }]}>Camera Password:</Text>
                            <View style={Styles.action}>
                                <TextInput 
                                    ref={ref => refs.current['pass'] = ref}
                                    returnKeyType={"done"}
                                    onSubmitEditing={onSaveClick}
                                    placeholder={"Camera Password"}
                                    style={Styles.textInput}
                                    secureTextEntry={camDetails.secureTextEntry ? true : false}
                                    defaultValue={camDetails.pass}
                                    onChangeText={pass => onChangeDetail('pass', pass)}
                                    autoCapitalize={"none"}
                                />
                                <TouchableOpacity onPress={() => onChangeDetail('secureTextEntry', !camDetails.secureTextEntry)}>
                                    {camDetails.secureTextEntry ? 
                                        <Feather name="eye-off" size={20} color="gray" /> :
                                        <Feather name="eye" size={20} color="gray" />
                                    }
                                </TouchableOpacity>
                            </View>
                            {camDetails.passErr !== '' ? <Text style={Styles.messageErr}>{camDetails.passErr}</Text> : null}
                            <View style={Styles.button}>
                                <View style={{flexDirection: "row"}}>
                                    <TouchableOpacity 
                                        style={[Styles.footerButtons, { borderColor: '#448AFF', borderWidth: 1, marginTop: 15 }]} 
                                        onPress={onCancelClick}>
                                        <Text style={[Styles.textSignIn, { color: '#448AFF' }]}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[Styles.footerButtons, { borderColor: '#448AFF', borderWidth: 1, marginTop: 15 }]} 
                                        onPress={onSaveClick}>
                                        <Text style={[Styles.textSignIn, { color: '#448AFF' }]}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {camDetails.messageErr !== '' ? <Text style={Styles.messageErr}>{camDetails.messageErr}</Text> : null}
                    </Animatable.View>
                </View>
            }
        </ScrollView>
    );
};

const Styles = StyleSheet.create({
    container: {
        backgroundColor: '#448AFF',
        flex: 1
    },
    header: {
        flex: height * 0.0004,
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
    action: {
        flexDirection: 'row',
        marginTop: height * 0.01,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
    },
    pickerStyle: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 5,
        marginTop: height * 0.02
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
        marginTop: height * 0.01
    },
    footerButtons: {
        width: '48%',
        height: height * 0.06,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: '2%'
    },  
    messageErr: {
        fontSize: 12,
        color: 'red'
    }
});

export default AddCameraScreen;