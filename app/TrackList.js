import React, { Component } from 'react'
import  { View,Text } from 'react-native'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import Permissions from 'react-native-permissions'

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
        tracks:[]
        };
    }
    componentDidMount(){
    console.warn(" jdkjfw");
    
    }

    render() {
        return(
            <View>
            <Text>Salut</Text>
        </View>
        )
       
    }
}
