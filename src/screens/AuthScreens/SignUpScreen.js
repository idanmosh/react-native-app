import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions,
     BackHandler, TextInput, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; 
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';  
import Feather from 'react-native-vector-icons/Feather'; 
import { CheckPass, CheckEmail } from '../../components/AuthChecks';
import { useNavigation } from '@react-navigation/native';
import { emailVerifyRequest } from '../../components/api';
import { storeData } from '../../components/asyncStorage';
import messaging from '@react-native-firebase/messaging';

const { width, height } = Dimensions.get('screen');

const initialState = {
    email: '',
    pass: '',
    confPass: '',
    messageEmail: '',
    messagePass: '',
    messageConfPass: '',
    messageErr: '',
    secureTextEntry: true,
    confSecurityTextEntry: true
};

const SignUpScreen = () => {
    const navigation = useNavigation();
    const refs = useRef([
        'passRef',
        'confPassRef'
    ]);
    const[details, setDetails] = useState({ ...initialState });

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackBtn);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackBtn);
        }
    },[]);

    const handleBackBtn = () => {
        BackHandler.exitApp();
        return true;
    };

    const onChangeDetail = (key, value) => {
        setDetails({ ...details, [key]: value });
    };

    const onClickSignUp = () => {
        const checkPass = CheckPass(details.pass, details.confPass);
        const checkEmail = CheckEmail(details.email);
        
        if(checkPass.isValid && checkEmail.isValid)
            signUp(); 
        
        setDetails({ ...details,
            messageEmail: checkEmail.error,
            messagePass: checkPass.error,
            messageConfPass: checkPass.error });
    };

    const signUp = async () => {
        const firebase = await messaging().
        getToken()
        .then(token => { return { valid: true, token } })
        .catch(err => { return { valid: false }});

        if(firebase.valid) {
            storeData({ 
                key: 'currentUser',
                content: {
                    groupId: '',
                    email: details.email,
                    password: details.pass,
                    fireBaseToken: firebase.token
                }
            }).then(res => {
                emailVerifyRequest({ email: details.email })
                .then(res => {
                    storeData({
                        key: 'pinObj',
                        content: res
                    }).
                    then(() => {
                        console.log('[SignUpScreen] email Verified');
                        goToVerification();
                    })
                    .catch(error => {
                        setMessages();
                        onChangeDetail('messageErr', '*' + error);
                    });
                })
                .catch(error => {
                    setMessages();
                    onChangeDetail('messageErr', '*' + error);
                })
            })
            .catch(error => {
                setMessages();
                onChangeDetail('messageErr', '*' + error);
            });
        }
    }

    const setMessages = () => {
        setDetails({ ...details,
            messageEmail: '',
            messagePass: '',
            messageConfPass: '' });
    };

    const goToVerification = () => {
        navigation.reset({ routes: [{ name: 'VerifyCode', params: { screen: 'GroupId' } }] });
    };

    const goToSignIn = () => {
        navigation.reset({ routes: [{ name: 'SignIn' }] });
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'handled'}>
            <View style={Styles.container}>
                <View style={Styles.header}>
                    <Text style={Styles.textHeader}>Create a new account</Text>
                </View>
                <Animatable.View 
                    style={Styles.footer}
                    animation="fadeInUpBig"
                    duration={1500}
                >
                    <Text style={Styles.text_footer}>Email:</Text>
                    <View style={Styles.action}>
                        <FontAwesome name="user-o" size={20} color="black" />
                        <TextInput
                            returnKeyType={"next"}
                            onSubmitEditing={() => { refs.current['passRef'].focus(); }}  
                            placeholder={"Email"}
                            style={Styles.textInput}
                            onChangeText={email => onChangeDetail('email', email)}
                            autoCapitalize={"none"}
                            defaultValue={details.email}
                        />
                        {CheckEmail(details.email).isValid ? 
                            <Animatable.View animation="bounceIn">
                                <Feather name="check-circle" size={20} color="green" />
                            </Animatable.View>
                            : null
                        }
                    </View>
                    {details.messageEmail !== '' ? <Text style={Styles.messageErr}>{details.messageEmail}</Text> : null}
                    <Text style={[Styles.text_footer, { marginTop: 35 }]}>Password:</Text>
                    <View style={Styles.action}>
                        <Feather name="lock" size={20} color="#05375a" />
                        <TextInput
                            ref={ref => refs.current['passRef'] = ref}
                            returnKeyType={"next"}
                            onSubmitEditing={() => { refs.current['confPassRef'].focus(); }}  
                            placeholder={"Password"}
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
                    <Text style={[Styles.text_footer, { marginTop: 35 }]}>Confirm Password:</Text>
                    <View style={Styles.action}>
                        <Feather name="lock" size={20} color="#05375a" />
                        <TextInput 
                            ref={ref => refs.current['confPassRef'] = ref}
                            returnKeyType={"done"}
                            onSubmitEditing={onClickSignUp}  
                            placeholder={"Confirm Your Password"}
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
                            onPress={onClickSignUp}
                        >
                            <LinearGradient
                                colors={['#448AFF', '#448AFF']}
                                style={Styles.signIn}
                            >
                                <Text style={[Styles.textSignIn, { color: '#fff' }]}>Sign Up</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <View style={{flexDirection: "row"}}>
                            <TouchableOpacity 
                                style={[Styles.signIn, { borderColor: '#448AFF', borderWidth: 1, marginTop: 15 }]} 
                                onPress={goToSignIn}>
                                <Text style={[Styles.textSignIn, { color: '#448AFF' }]}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {details.messageErr !== '' ? <Text style={Styles.messageErr}>{details.messageErr}</Text> : null}
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
    }
});

export default SignUpScreen;