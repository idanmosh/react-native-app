import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import AndroidOpenSettings from 'react-native-android-open-settings';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather'; 

const { width, height } = Dimensions.get('screen');

//Settings Screen 
const SettingsScreen = () => {
    //App navigation reference
    const navigation = useNavigation();

    return (
        <ScrollView contentContainerStyle={Styles.container} keyboardShouldPersistTaps={'handled'}>
            <TouchableOpacity
                style={Styles.itemStyle} 
                onPress={() => navigation.navigate('Change_Password')}>
                <Feather name="lock" size={22} color="black" />
                <Text style={Styles.textStyle}>{'Change Password'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={Styles.itemStyle} 
                onPress={() => AndroidOpenSettings.appNotificationSettings()}>
                <Ionicons name="ios-notifications-outline" size={24} color="black" />
                <Text style={Styles.textStyle}>{'Notifications'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const Styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        marginTop: 5
    },
    itemStyle: {
        margin: 5,
        backgroundColor: 'white', 
        height: height * 0.10,
        borderRadius: 5,
        padding: 15,
        elevation: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    textStyle: {
        marginStart: width * 0.05
    }
});

export default SettingsScreen;