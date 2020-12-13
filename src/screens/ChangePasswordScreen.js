import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions,
    Text, ScrollView, TextInput, BackHandler, ToastAndroid } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; 
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable'; 
import Feather from 'react-native-vector-icons/Feather'; 
import { CheckPass } from '../components/AuthChecks';
import * as actions from '../redux/actions/index';
import { changePassRequest } from '../components/api';
import { retrieveData } from '../components/asyncStorage'; 
import { useDispatch } from 'react-redux';

const { width, height } = Dimensions.get('screen');

//Initial State
const initialState = {
    pass: '',
    confPass: '',
    oldPass: '',
    messagePass: '',
    messageConfPass: '',
    messageOldPass: '',
    messageErr: '',
    secureTextEntry: true,
    confSecurityTextEntry: true,
    oldSecurityTextEntry: true
};

//Change password Screen
const ChangePassword = () => {
    //Global state dispatch reference
    const dispatch = useDispatch();
    //Text inputs references
    const refs = useRef([
        'newPass',
        'confPass'
    ]);
    //App navigation reference
    const navigation = useNavigation();
    //Local details state
    const [details, setDetails] = useState({ ...initialState });

    //On click back handler
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackBtn);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackBtn);
        }
    }, []);

    //Handle back click action
    const handleBackBtn = () => {
        return false;
    };

    const onChangeDetail = (key, value) => {
        setDetails({ ...details, [key]: value });
    };

    const onClickChangePassword= () => {
        const checkPass = CheckPass(details.pass, details.confPass);
        const checkoldPass = CheckPass(details.oldPass, details.oldPass);
        
        if(checkPass.isValid && checkoldPass.isValid)
            changePassword();

        setDetails({ ...details, 
                messagePass: checkPass.error,
                messageConfPass: checkPass.error,
                messageOldPass: checkoldPass.error });
    };

    const changePassword = async () => {
        retrieveData('user')
        .then(res => {
            changePassRequest({
                email: res,
                oldPass: details.oldPass,
                newPass: details.pass
            })
            .then(res => {
                dispatch(actions.setUser(res));
                ToastAndroid.show('Password changed successfully', ToastAndroid.SHORT);
                navigation.navigate('Settings');
            })
            .catch(error => {
                ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
            });
        })
        .catch(error => {
            ToastAndroid.show(error.toString(), ToastAndroid.SHORT);
        });
    };

    const onClickBackSettings = () => {
        navigation.goBack();
    };

    return(
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'handled'}>
            <View style={Styles.container}>
                <View style={Styles.header}>
                    <Text style={Styles.textHeader}>Change your password</Text>
                </View>
                <Animatable.View 
                    style={Styles.footer}
                    animation="fadeInUpBig"
                    duration={1500}
                >
                    <Text style={Styles.text_footer}>Old Password:</Text>
                    <View style={Styles.action}>
                        <Feather name="lock" size={20} color="#05375a" />
                        <TextInput 
                            placeholder={"Old Password"}
                            returnKeyType={"next"}
                            onSubmitEditing={() => refs.current['newPass'].focus()}
                            style={Styles.textInput}
                            secureTextEntry={details.oldSecurityTextEntry ? true : false}
                            onChangeText={oldPass => onChangeDetail('oldPass', oldPass)}
                            autoCapitalize={"none"}
                            defaultValue={details.oldPass}
                        />
                        <TouchableOpacity onPress={() => onChangeDetail('oldSecurityTextEntry', !details.oldSecurityTextEntry)}>
                            {details.oldSecurityTextEntry ? 
                                <Feather name="eye-off" size={20} color="gray" /> :
                                <Feather name="eye" size={20} color="gray" />
                            }
                        </TouchableOpacity>
                    </View>
                    {details.messageOldPass !== '' ? <Text style={Styles.messageErr}>{details.messageOldPass}</Text> : null}
                    <Text style={[Styles.text_footer, { marginTop: 35 }]}>New Password:</Text>
                    <View style={Styles.action}>
                        <Feather name="lock" size={20} color="#05375a" />
                        <TextInput 
                            ref={ref => refs.current['newPass'] = ref}
                            placeholder={"New Password"}
                            returnKeyType={"next"}
                            onSubmitEditing={() => refs.current['confPass'].focus()}
                            style={Styles.textInput}
                            secureTextEntry={details.secureTextEntry ? true : false}
                            onChangeText={pass => onChangeDetail('pass', pass)}
                            autoCapitalize={"none"}
                            defaultValue={details.pass}
                        />
                        <TouchableOpacity onPress={() => onChangeDetail('secureTextEntry', !details.secureTextEntry)}>
                            {details.secureTextEntry ? 
                                <Feather name="eye-off" size={20} color="gray" /> :
                                <Feather name="eye" size={20} color="gray" />
                            }
                        </TouchableOpacity>
                    </View>
                    {details.messagePass !== '' ? <Text style={Styles.messageErr}>{details.messagePass}</Text> : null}
                    <Text style={[Styles.text_footer, { marginTop: 35 }]}>Confirm New Password:</Text>
                    <View style={Styles.action}>
                        <Feather name="lock" size={20} color="#05375a" />
                        <TextInput 
                            ref={ref => refs.current['confPass'] = ref}
                            returnKeyType={"done"}
                            onSubmitEditing={onClickChangePassword}
                            placeholder={"Confirm Your New Password"}
                            style={Styles.textInput}
                            secureTextEntry={details.confSecurityTextEntry ? true : false}
                            onChangeText={confpass => onChangeDetail('confPass', confpass)}
                            autoCapitalize={"none"}
                            defaultValue={details.confPass}
                        />
                        <TouchableOpacity onPress={() => onChangeDetail('confSecurityTextEntry', !details.confSecurityTextEntry)}>
                            {details.confSecurityTextEntry ? 
                                <Feather name="eye-off" size={20} color="gray" /> :
                                <Feather name="eye" size={20} color="gray" />
                            }
                        </TouchableOpacity>
                    </View>
                    {details.messageConfPass !== '' ? <Text style={Styles.messageErr}>{details.messageConfPass}</Text> : null}
                    <View style={Styles.button}>
                        <TouchableOpacity
                            style={Styles.signIn}
                            onPress={onClickChangePassword}
                        >
                            <LinearGradient
                                colors={['#448AFF', '#448AFF']}
                                style={Styles.signIn}
                            >
                                <Text style={[Styles.textSignIn, { color: '#fff' }]}>Change Password</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    
                        <TouchableOpacity 
                            style={[Styles.signIn, { borderColor: '#448AFF', borderWidth: 1, marginTop: 15 }]} 
                            onPress={onClickBackSettings}>
                            <Text style={[Styles.textSignIn, { color: '#448AFF' }]}>Back to Settings</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </View>
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
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
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
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    footerButtons: {
        width: '48%',
        height: 50,
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
    }
});

export default ChangePassword;

