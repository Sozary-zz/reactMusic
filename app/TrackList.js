import React, { Component } from 'react'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import Permissions from 'react-native-permissions'

export default class App extends Component {
    render() {
        return <Player tracks={TRACKS} />
    }
}
