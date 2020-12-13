import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, AppState, BackHandler } from 'react-native';
import { NodePlayerView } from 'react-native-nodemediaclient';
import { useKeepAwake } from '@sayem314/react-native-keep-awake';
import { useNavigation } from '@react-navigation/native';
import * as SocketService from '../../services/socketService';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('screen');

const cameraScreen = () => {
    useKeepAwake();

    const navigation = useNavigation();
    const camera = useSelector(state => state.cameraReducer.currCamera);
    const [camState, setCamState] = useState({
        disconnect: true,
        connectionType: '',
        paused: false,
        appState: 'active',
        back: false,
    });
    
    const vlcPlayer = useRef(null);

    useEffect(() => {
        if(!camState.appState) return;

        if(camState.appState === 'active' && camState.back === false)    
            SocketService.emit(`startStreaming`, camera);
        else 
            SocketService.emit(`stopStreaming`, camera);
    }, [camState.appState]);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        AppState.addEventListener('change', handleAppChange);

        return () => { 
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
            AppState.removeEventListener('change', handleAppChange);
        }
    }, []);

    const handleBackPress = () => {
        SocketService.emit(`stopStreaming`, camera);
        return false;
    }

    const handleAppChange = (appState) => {
        console.log('handleAppChange: ', appState);
        setCamState({ ...camState, appState });
    }

    return (
        <View>
            <NodePlayerView
                style={{ height, width }}
                ref={vlcPlayer}
                inputUrl={camera.streamFromUrl}
                scaleMode={"ScaleAspectFit"}
                audioEnable={false}
                bufferTime={1000}
                maxBufferTime={1200}
                onStatus={data => console.log(data)}
                autoplay={true}
            />
        </View>
    );
};

const Styles = StyleSheet.create({});

export default cameraScreen;

/*<View>
            { camState.disconnect ?
                <View>
                    <VLCPlayer
                        ref={vlcPlayer} 
                        style={{ width, height: height * 0.85 }}
                        source={{
                            uri: camera.streamFromUrl
                        }}
                        onProgress={data => {
                            console.log(data);
                            setCamState({ ...camState, paused: false })
                        }}
                        onEnd={() => setCamState({ ...camState, paused: false })}
                        onBuffering={data => {
                            console.log(data);
                            if(data.currentTime !== 0 && data.bufferRate === 0)
                                setCamState({ ...camState, stopTime: Date.now() })
                            if(data.currentTime !== 0 && data.bufferRate === 100)
                                vlcPlayer.current.resume(true);
                        }}
                        onError={() => console.log('onError')}
                        onStopped={() => {
                            console.log('onStopped');
                            'setCamState({ ...camState, isLoading: true });'
                            `disconnect('onStopped');`
                        }}
                        onPlaying={() => {
                            console.log('onPlaying');
                            setCamState(prevState => ({ ...prevState, isLoading: false }));
                        }}
                        onPaused={() => {
                            console.log('onPaused');
                            setCamState({ ...camState, isLoading: true });
                            disconnect('onStopped');
                        }}
                        onLoadStart={() => {
                            console.log('onLoadStart');
                            if(camState.stopTime === 0)
                                vlcPlayer.current.seek(7.5);
                            else
                                vlcPlayer.current.seek((Date.now() - camState.stopTime) / 60000);
                            vlcPlayer.current.changeVideoAspectRatio('9:14');
                        }}
                        onOpen={() => console.log('onOpen')}
                    />
                   <ActivityIndicator 
                        animating={camState.isLoading} 
                        style={{ flex: 1, position: "absolute", bottom: height * 0.45, left: width * 0.45 }} 
                        size="large" 
                        color={"#009387"} />
                </View>
                : null
            }
        </View>
        
        */