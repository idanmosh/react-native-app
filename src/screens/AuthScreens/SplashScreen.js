import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; 
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const { height, width } = Dimensions.get('screen');

const SplashScreen = () => {
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={Styles.container}>
                <View style={Styles.header}>
                    <Animatable.Image
                        animation="bounceIn"
                        duration={1500}
                        source={require('../../../assets/Logo.png')}
                        style={Styles.logo}
                        resizeMode="contain"
                    />
                </View>
                <Animatable.View 
                    style={Styles.footer} 
                    animation="fadeInUpBig"
                    duration={1500}>
                    <Text style={Styles.title}>Keeps you and your loved ones safe by preventing drowning!</Text>
                    <Text style={Styles.text}>Sign in with account</Text>
                    <View style={Styles.button}>
                        <TouchableOpacity onPress={() => navigation.reset({ routes: [{ name: 'SignIn' }] })}>
                            <LinearGradient
                                colors={['#448AFF', '#448AFF']}   
                                style={Styles.signIn}
                            >
                                <Text style={Styles.textSignIn}>Get Started</Text>
                                <MaterialIcons 
                                    name="navigate-next"
                                    size={20} 
                                    color="#fff" 
                                />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </View>
        </ScrollView>
    );
};

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#448AFF'
    },
    header: {
        flex: height * 0.002,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: height * 0.05,
        paddingHorizontal: width * 0.05
    },
    logo: {
        height: height * 0.4,
        width: height * 0.4,
        borderRadius: 500
    },
    title: {
        color: '#05375a',
        fontSize: 30,
        fontWeight: 'bold'
    },
    text: {
        color: 'gray',
        marginTop: height * 0.005
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },
    signIn: {
        width: width * 0.4,
        height: height * 0.05,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row'
    },
    textSignIn: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14
    }
});

export default SplashScreen;