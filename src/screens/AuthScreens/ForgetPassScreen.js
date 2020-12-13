import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, BackHandler, TextInput, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; 
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';  
import Feather from 'react-native-vector-icons/Feather'; 
import { CheckEmail } from '../../components/AuthChecks';
import { emailVerifyRequest } from '../../components/api';
import { storeData } from '../../components/asyncStorage';

const { width, height } = Dimensions.get('screen');

const initialState = {
    email: '',
    messageEmail: '',
    messageErr: ''
};

const ForgetPass = () => {
    const navigation = useNavigation();
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

    const onClickSend = () => {
        const checkEmail = CheckEmail(details.email);

        if(checkEmail.isValid)
            resetPass();
        
        onChangeDetail('messageEmail', checkEmail.error);
    };

    const resetPass = () => {
        emailVerifyRequest({ 
            email: details.email    
        }).then(res => {
            storeData({
                key: 'pinObj',
                content: {
                    email: details.email,
                    pinCode: res.pinCode,
                    createdAt: res.createdAt
                }
            })
            .then(() => {
                console.log('[ForgetPassScreen] email Verified');
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
        });
    };

    const setMessages = () => {
        setDetails({ ...details,
            messageEmail: ''
        });
    };

    const goToVerification = () => {
        navigation.reset({ routes: [{ name: 'VerifyCode',
         params: { screen: 'ChangePass' } }] });
    };

    const goToSignIn = () => {
        navigation.reset({ routes: [{ name: 'SignIn' }] });
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'handled'}>
            <View style={Styles.container}>
                <View style={Styles.header}>
                    <Text style={Styles.textHeader}>Reset your password</Text>
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
                            placeholder={"Email"}
                            returnKeyType={"done"}
                            onSubmitEditing={onClickSend}
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
                    <View style={Styles.button}>
                        <TouchableOpacity
                            style={Styles.signIn}
                            onPress={onClickSend}
                        >
                            <LinearGradient
                                colors={['#448AFF', '#448AFF']}
                                style={Styles.signIn}
                            >
                                <Text style={[Styles.textSignIn, { color: '#fff' }]}>Send</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[Styles.signIn, { borderColor: '#448AFF', borderWidth: 1, marginTop: 15 }]} 
                            onPress={goToSignIn}>
                            <Text style={[Styles.textSignIn, { color: '#448AFF' }]}>Back to Sign In</Text>
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
        flex: height * 0.002,
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
    textSignIn: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    messageErr: {
        fontSize: 12,
        color: 'red'
    }
});

export default ForgetPass;