/**
 * @format
 */

import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import { name as appName } from './app.json';
// import { PlaybackService } from './src/service/playbackService/playbackService';

AppRegistry.registerComponent(appName, () => App);
// TrackPlayer.registerPlaybackService(() => PlaybackService);
