import React, { useEffect, useRef, useState } from 'react';
import { View, Dimensions, Image, PanResponder, TouchableOpacity, 
    StyleSheet, Text, ToastAndroid, BackHandler } from 'react-native';
import { addCameraRequest, editCameraRequset } from '../components/api';
import * as SocketService from '../../services/socketService';
import Svg, { Line } from 'react-native-svg';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../redux/actions/index';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

//Initial State
const initialState = {
    messageErr: ''
}

//Paint on camera first frame screen
const PaintOnScreen = () => {
    //Local details state
    const [details, setDetails] = useState({ ...initialState });
    //App navigation reference
    const navigation = useNavigation();
    //Global state dispatch reference
    const dispatch = useDispatch();
    //Screen property to know which action to do (edit camera or add camera)
    const screen = useSelector(state => state.cameraReducer.screen);
    //Array of dots that user choose on the screen
    const dots = useSelector(state => state.cameraReducer.dots);
    //Current camera details
    const camera = useSelector(state => state.cameraReducer.currCamera);
    //First lines of area #1
    const lines1 = useSelector(state => state.cameraReducer.lines1);
    //Second lines of area #2
    const lines2 = useSelector(state => state.cameraReducer.lines2);
    //All areas that user choose on the screen
    const areas = useSelector(state => state.cameraReducer.areas);

    //Detect where user click on frame
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: (event, gestureState) => true,
            onStartShouldSetPanResponderCapture: (event, gestureState) => true,
            onMoveShouldSetPanResponder: (event, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (event, gestureState) => false,
            onPanResponderGrant: (event, gestureState) => false,
            onPanResponderMove: (event, gestureState) => false,
            onPanResponderRelease: (event, gestureState) => {
                addDot({ 
                    X: Math.round(event.nativeEvent.locationX.toFixed(2)) > Math.floor(width) ? 
                    Math.floor(width) : event.nativeEvent.locationX.toFixed(2),
                    Y: Math.round(event.nativeEvent.locationY.toFixed(2)) > Math.floor(height) 
                    ? Math.floor(height) : event.nativeEvent.locationY.toFixed(2)
                });
            }
        })
    ).current;

     //On click back handler
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackBtn);

        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackBtn);
        }
    }, []);

    //Handle back click action
    const handleBackBtn = () => {
        removeAllDots();
        return false;
    };

    //Add dot when user click on frame
    const addDot = dot => {
        dispatch(actions.addDot(dot));
    } 

    //Remove dot when user click on back button
    const removeDot = () => {
        dispatch(actions.removeDot());
    }

    //Remove all dots when user click on reset button 
    const removeAllDots = () => {
        dispatch(actions.removeAllDots());
    }

    //When user click on button save area
    const onClickSaveArea = () => {
        if(dots.length > 3) 
            dispatch(actions.saveArea({ 
                width: camera.size.width, 
                height: camera.size.height 
            }));
        else
            ToastAndroid.show('Area must contain at least 4 points', ToastAndroid.LONG);
    }

    //Paint on screen first area lines
    const getFirstLines = () => {
        return lines1.map((line, index) => {
            return(
                <Svg
                    { ...panResponder.panHandlers }
                    key={index} 
                    style={{ position: 'absolute', zIndex: 5 }}>
                    <Line
                        x1={parseFloat(line.X1)} // start coordinate x
                        y1={parseFloat(line.Y1)} // start coordinate y
                        x2={parseFloat(line.X2)} // end coordinate x
                        y2={parseFloat(line.Y2)} // end coordinate y
                        stroke="red"
                        strokeWidth="3"
                    />
                </Svg>
            );
        })
    }

    //Paint on screen second area lines
    const getSecondLines = () => {
        return lines2.map((line, index) => {
            return(
                <Svg
                    { ...areas.length < 3 ? {...panResponder.panHandlers} : null }
                    key={index} 
                    style={{ position: 'absolute', zIndex: 5 }}>
                    <Line
                        x1={parseFloat(line.X1)} // start coordinate x
                        y1={parseFloat(line.Y1)} // start coordinate y
                        x2={parseFloat(line.X2)} // end coordinate x
                        y2={parseFloat(line.Y2)} // end coordinate y
                        stroke="green"
                        strokeWidth="3"
                    />
                </Svg>
            );
        })
    }

    //Paint all dots on frame
    const paintDots = () => {
        return dots.map((point, index) => {
            return(
                <View
                    key={index} 
                    style={{
                        position: 'absolute',
                        borderRadius: 14,
                        backgroundColor: 'black',
                        zIndex: 5,
                        top: parseFloat(point.Y),
                        left: parseFloat(point.X), 
                        width: 10, 
                        height: 10  
                    }}
                /> 
            );
        });
    }

    //Add caemra request
    const addCamera = () => {
        addCameraRequest({
            camera : {
                ...camera,
                areas,
                frame: undefined,
                size: undefined
            }
        })
        .then(res => {
            SocketService.emit('newCamera', res);
            dispatch(actions.addCamera(res));
            dispatch(actions.clearCameraArr());
            navigation.navigate('Home');
        })
        .catch(error => {
            setDetails({
                ...details,
                messageErr: `*${error.toString()}`
            });
        });
    }

    //Edit camera request
    const editCamera = () => {
        editCameraRequset({
            camera : {
                ...camera,
                areas,
                frame: undefined,
                size: undefined
            }
        })
        .then(res => {
            SocketService.emit('editCamera', res);
            dispatch(actions.updateCamera(res));
            dispatch(actions.clearCameraArr());
            navigation.navigate('Home');
        })
        .catch(error => {
            setDetails({
                ...details,
                messageErr: `*${error.toString()}`
            });
        });
    }
    
    return(
        <View style={Styles.container}>
            <View>
                <Image 
                    style={{ height: height * 0.7, width }} 
                    { ...panResponder.panHandlers } 
                    source={{ uri: camera.frame }}/>
                { paintDots() }
                { areas.length >= 1 ? getFirstLines() : null }
                { areas.length === 3 ? getSecondLines() : null }
            </View>
                <View style={Styles.button}>
                    <TouchableOpacity
                        style={[Styles.footerButtons, { borderColor: '#448AFF', borderWidth: 1, ...Styles.signIn }]} 
                        onPress={ areas.length < 3 ?  onClickSaveArea : ( screen === 'Add_Camera' ? addCamera : editCamera )}
                    >
                        <Text style={[Styles.textSignIn, { color: '#448AFF' }]}>{ areas.length < 3 ? 'Save Area' : 'Add Camera' }</Text>
                    </TouchableOpacity>
                    {
                        dots.length > 0 ?
                        <View style={Styles.buttonsView}>
                            <TouchableOpacity 
                                style={[Styles.footerButtons, { borderColor: '#448AFF', borderWidth: 1, marginTop: 15 }]} 
                                onPress={removeDot}>
                                <Text style={[Styles.textSignIn, { color: '#448AFF' }]}>Step Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[Styles.footerButtons, { borderColor: '#448AFF', borderWidth: 1, marginTop: 15 }]} 
                                onPress={removeAllDots}>
                                <Text style={[Styles.textSignIn, { color: '#448AFF' }]}>Reset</Text>
                            </TouchableOpacity>
                        </View>
                        : null
                    }
                    { details.messageErr !== '' ? <Text style={Styles.messageErr}>{details.messageErr}</Text> : null }
                </View>
            </View>
    );
}

const Styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonsView: {
        flexDirection: "row",
        alignSelf: 'center'
    },
    signIn: {
        width: '100%',
        height: height * 0.06,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    button: {
        alignItems: 'center',
        marginTop: height * 0.02,
        marginHorizontal: width * 0.05
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

export default PaintOnScreen;