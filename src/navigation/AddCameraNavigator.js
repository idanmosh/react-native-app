import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AddCameraScreen from '../screens/AddCameraScreen';
import FontAwesome  from 'react-native-vector-icons/FontAwesome'; 

const { height, width } = Dimensions.get('window');
const Stack = createStackNavigator();

const AddCameraNavigator = ({ navigation }) => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Add_Camera" 
                component={AddCameraScreen} 
                options={{
                    title: '',
                    headerLeft: () => (
                        <TouchableOpacity style={Styles.barStyle} onPress={() => navigation.toggleDrawer()}>
                            <FontAwesome name="bars" size={30} color="black" />
                        </TouchableOpacity>
                    )
                }} 
            />
        </Stack.Navigator>
    );
};

const Styles = StyleSheet.create({
    barStyle: {
        margin: width * 0.03
    }
});

export default AddCameraNavigator;