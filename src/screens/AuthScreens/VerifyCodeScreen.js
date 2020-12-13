import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions,
    BackHandler, TextInput, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; 
import * as Animatable from 'react-native-animatable';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CheckConfCode } from '../../components/AuthChecks';

const { width, height } = Dimensions.get('screen');

const initialState = {
    verifyCode: '',
    messageVerifyCode: '',
    messageErr: '',
    screen: ''
};

const VerifyCodeScreen = () => { 
    const route = useRoute();
    const navigation = useNavigation();
    const[details, setDetails] = useState({ 
        ...initialState,
        screen: route.params.screen
    });

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

    const onClickVerify = async () => {
        const checkConfCode = await CheckConfCode(details.verifyCode);
        if(checkConfCode.isValid) {
            if(details.screen === 'GroupId')
                goToGroupId();
            else
                goToForgetPass();
        }
            
        setDetails({ ...details,
            messageVerifyCode: checkConfCode.error });
    }

    const goToForgetPass = () => {
        navigation.reset({ routes: [{ name: 'ChangePass' }] });
    }

    const goToGroupId = () => {
        navigation.reset({ routes: [{ name: 'GroupID' }] });
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps={'handled'}>
            <View style={Styles.container}>
                <View style={Styles.header}>
                    <Text style={Styles.textHeader}>Verify your verification code</Text>
                </View>
                <Animatable.View 
                    style={Styles.footer}
                    animation="fadeInUpBig"
                    duration={1500}
                >
                    <Text style={Styles.text_footer}>Verification Code:</Text>
                    <View style={Styles.action}>
                        <TextInput 
                            placeholder={"Verification Code"}
                            returnKeyType={"done"}
                            onSubmitEditing={onClickVerify} 
                            style={Styles.textInput}
                            onChangeText={verifyCode => onChangeDetail('verifyCode', verifyCode)}
                            autoCapitalize={"none"}
                            defaultValue={details.verifyCode}
                        />
                    </View>
                    {details.messageVerifyCode !== '' ? <Text style={Styles.messageErr}>{details.messageVerifyCode}</Text> : null}
                    <View style={Styles.button}>
                        <TouchableOpacity
                            style={Styles.signIn}
                            onPress={onClickVerify}
                        >
                            <LinearGradient
                                colors={['#448AFF', '#448AFF']}
                                style={Styles.signIn}
                            >
                                <Text style={[Styles.textSignIn, { color: '#fff' }]}>Verify</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    {details.messageErr !== '' ? <Text style={Styles.messageErr}>{details.messageErr}</Text> : null}
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

export default VerifyCodeScreen;