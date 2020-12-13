import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, BackHandler, TextInput, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; 
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { CheckPass } from '../../components/AuthChecks';
import Feather from 'react-native-vector-icons/Feather'; 
import { retrieveData, removeData } from '../../components/asyncStorage';
import { resetPassRequest } from '../../components/api';

const { width, height } = Dimensions.get('screen');

const initialState = {
    newPass: '',
    confNewPass: '',
    messageNewPass: '',
    messageConfPass: '',
    messageErr: '',
    secureTextEntry: true,
    confSecurityTextEntry: true,
};

const ChangePass = () => {
    const navigation = useNavigation();
    const ref = useRef();
    const [details, setDetails] = useState({ ...initialState });

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackBtn);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackBtn);
        }
    }, []);

    const handleBackBtn = () => {
        BackHandler.exitApp();
        return false;
    };

    const onChangeDetail = (key, value) => {
        setDetails({ ...details, [key]: value });
    };

    const onClickResetPass= () => {
        const checkPass = CheckPass(details.newPass, details.confNewPass);
        
        if(checkPass.isValid)
            changePassword();

        setDetails({ ...details, 
                messageNewPass: checkPass.error,
                messageConfPass: checkPass.error
        });
    };

    const changePassword = () => {
        retrieveData('pinObj')
        .then(res => {
            resetPassRequest({
                email: res.email,
                password: details.newPass
            })
            .then(() => {
                removeData('pinObj');
                goToSignIn()
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
    }

    const setMessages = () => {
        setDetails({ ...details,
            messageNewPass: '',
            messageConfPass: '',
        });
    };

    const goToSignIn = () => {
        navigation.reset({ routes: [{ name: 'SignIn' }] });
    };

    return(
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
                    <Text style={Styles.text_footer}>New Password:</Text>
                    <View style={Styles.action}>
                        <Feather name="lock" size={20} color="#05375a" />
                        <TextInput 
                            placeholder={"New password"}
                            returnKeyType={"next"}
                            onSubmitEditing={() => ref.current.focus()}
                            style={Styles.textInput}
                            secureTextEntry={details.secureTextEntry ? true : false}
                            onChangeText={newPass => onChangeDetail('newPass', newPass)}
                            autoCapitalize={"none"}
                            defaultValue={details.newPass}
                        />
                        <TouchableOpacity onPress={() => onChangeDetail('secureTextEntry', !details.secureTextEntry)}>
                            {details.secureTextEntry ? 
                                <Feather name="eye-off" size={20} color="gray" /> :
                                <Feather name="eye" size={20} color="gray" />
                            }
                        </TouchableOpacity>
                    </View>
                    {details.messageNewPass !== '' ? <Text style={Styles.messageErr}>{details.messageNewPass}</Text> : null}
                    <Text style={[Styles.text_footer, { marginTop: 35 }]}>Confirm New Password:</Text>
                    <View style={Styles.action}>
                        <Feather name="lock" size={20} color="#05375a" />
                        <TextInput
                            ref={ref} 
                            onSubmitEditing={onClickResetPass}
                            returnKeyType={"done"}
                            placeholder={"Confirm New Password"}
                            style={Styles.textInput}
                            secureTextEntry={details.confSecurityTextEntry ? true : false}
                            onChangeText={confNewPass => onChangeDetail('confNewPass', confNewPass)}
                            autoCapitalize={"none"}
                            defaultValue={details.confNewPass}
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
                            onPress={onClickResetPass}
                        >
                            <LinearGradient
                                colors={['#448AFF', '#448AFF']}
                                style={Styles.signIn}
                            >
                                <Text style={[Styles.textSignIn, { color: '#fff' }]}>Reset Password</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[Styles.signIn, { borderColor: '#448AFF', borderWidth: 1, marginTop: 15 }]} 
                            onPress={goToSignIn}>
                            <Text style={[Styles.textSignIn, { color: '#448AFF' }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </View>
        </ScrollView>
    );
}

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

export default ChangePass;