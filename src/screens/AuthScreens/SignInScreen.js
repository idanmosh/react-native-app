import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, 
    BackHandler, TextInput, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; 
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';  
import Feather from 'react-native-vector-icons/Feather';
import { CheckEmail, CheckPass } from '../../components/AuthChecks';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../redux/actions/index';
import { signInRequest } from '../../components/api';
import { storeData } from '../../components/asyncStorage';

const { width, height } = Dimensions.get('screen');

const initialState = {
    email: '',
    pass: '',
    messageEmail: '',
    messagePass: '',
    messageErr: '',
    secureTextEntry: true
};

const SignIn = () => {
    const navigation = useNavigation();
    const ref = useRef();
    const dispatch = useDispatch();
    const rootNav = useSelector(state => state.rootNavReducer.navigator);
    const [details, setDetails] = useState({ ...initialState });

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

    const onClickSignIn = () => {
        const checkPass = CheckPass(details.pass, details.pass);
        const checkEmail = CheckEmail(details.email);

        if(checkPass.isValid && checkEmail.isValid) 
            signIn();
        
        
        setDetails({ ...details,
            messageEmail: checkEmail.error,
            messagePass: checkPass.error });
    };

    const setMessages = () => {
        setDetails({ ...details,
            messageEmail: '',
            messagePass: '' 
        });
    };

    const signIn = async () => {
        signInRequest({
            username: details.email,
            password: details.pass
        }).then(res => {
            storeData({
                key: 'user',
                content: res.user.email
            })
            .then(() => {
                storeData({
                    key: 'jwt',
                    content: res.token
                })
                .then(() => {
                    dispatch(actions.setUser({}));
                    rootNav.reset({ routes: [{ name: 'Loading' }] });
                })
                .catch(error => {
                    setMessages();
                    onChangeDetail('messageErr', '*' + error);
                });
            })
            .catch(error => {
                setMessages();
                onChangeDetail('messageErr', '*' + error);
            });
        })
        .catch(error => {
            setMessages();
            onChangeDetail('messageErr', '*' + error);
        });
    };

    const goToForgetPass = () => {
        navigation.reset({ routes: [{ name: 'ForgetPass' }] });
    };

    const goToSignUp = () => {
        navigation.reset({ routes: [{ name: 'SignUp' }] });
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'handled'}>
            <View style={Styles.container}>
                <View style={Styles.header}>
                    <Text style={Styles.textHeader}>Sign in to your account</Text>
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
                            onSubmitEditing={() => { ref.current.focus(); }} 
                            defaultValue={details.email}
                            placeholder={"Email"}
                            style={Styles.textInput}
                            onChangeText={email => onChangeDetail('email', email)}
                            autoCapitalize={"none"}
                        />
                        {CheckEmail(details.email).isValid ? 
                            <Animatable.View 
                                animation="bounceIn" 
                                duration={1500}>
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
                            ref={ref}
                            onSubmitEditing={onClickSignIn} 
                            defaultValue={details.pass}
                            placeholder={"Password"}
                            style={Styles.textInput}
                            secureTextEntry={details.secureTextEntry ? true : false}
                            onChangeText={pass => onChangeDetail('pass', pass)}
                            autoCapitalize={"none"}
                        />
                        <TouchableOpacity onPress={() => onChangeDetail('secureTextEntry', !details.secureTextEntry)}>
                            {details.secureTextEntry ? 
                                <Feather name="eye-off" size={20} color="gray" /> :
                                <Feather name="eye" size={20} color="gray" />
                            }
                        </TouchableOpacity>
                    </View>
                    {details.messagePass !== '' ? <Text style={Styles.messageErr}>{details.messagePass}</Text> : null}
                    <View style={Styles.button}>
                        <TouchableOpacity
                            style={Styles.signIn}
                            onPress={onClickSignIn}
                        >
                            <LinearGradient
                                colors={['#448AFF', '#448AFF']}
                                style={Styles.signIn}
                            >
                                <Text style={[Styles.textSignIn, { color: '#fff' }]}>Sign In</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <View style={{flexDirection: "row"}}>
                            <TouchableOpacity 
                                style={[Styles.footerButtons, { borderColor: '#448AFF', borderWidth: 1, marginTop: 15 }]} 
                                onPress={goToForgetPass}>
                                <Text style={[Styles.textSignIn, { color: '#448AFF' }]}>Forget Password</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[Styles.footerButtons, { borderColor: '#448AFF', borderWidth: 1, marginTop: 15 }]} 
                                onPress={goToSignUp}>
                                <Text style={[Styles.textSignIn, { color: '#448AFF' }]}>Sign Up</Text>
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

export default SignIn;