import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    PermissionsAndroid,
    Alert,
    ActivityIndicator,
} from 'react-native'
import  Accordion  from './components/Accordion'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import Permissions from 'react-native-permissions'
const url = 'http://5d718e2d.ngrok.io'

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#292929',
    },
    recordingButton: {
        height: 30,
        width: 30,
        margin: 20,
        alignSelf: 'flex-end',
    },
    off: {
        opacity: 0.3,
    },
    noDataMessage: {
        color: '#555555',
        paddingTop: 8,
        paddingBottom: 8,
        fontSize: 20,
        textAlign: 'center',
    },
})
export default class App extends Component {
                   constructor(props) {
                       super(props)

                       this.state = {
                           tracks: [],
                           loading: true,
                       }
                   }
                   audioRecorderPlayer = new AudioRecorderPlayer()

                   onStartRecord = async () => {
                       const result = await this.audioRecorderPlayer.startRecorder(
                           path
                       )
                       this.audioRecorderPlayer.addRecordBackListener(
                           e => {
                               this.setState({
                                   recordSecs:
                                       e.current_position,
                                   recordTime: this.audioRecorderPlayer.mmssss(
                                       Math.floor(
                                           e.current_position
                                       )
                                   ),
                               })
                               return
                           }
                       )
                       console.log(result)
                   }

                   onStopRecord = async () => {
                       const result = await this.audioRecorderPlayer.stopRecorder()
                       this.audioRecorderPlayer.removeRecordBackListener()
                       this.setState({
                           recordSecs: 0,
                       })
                       this.uploadAudioCommand()
                   }

                   onRecorderClick() {
                       if (this.state.recording)
                           this.onStopRecord()
                       else this.onStartRecord()
                       this.setState({
                           recording: !this.state.recording,
                       })
                   }

                   uploadAudioCommand = async () => {
                       console.warn('ff')

                       file = {
                           uri: 'file:///sdcard/command.wav',
                           name: 'command.wav',
                           type: 'audio/wav',
                       }
                       const body = new FormData()
                       body.append('file', file)
                       try {
                           const res = await fetch(
                               'http://157.230.19.63:3000',
                               {
                                   method: 'POST',
                                   headers: {
                                       Accept:
                                           'application/json',
                                       'Content-Type':
                                           'multipart/form-data',
                                   },
                                   body,
                               }
                           )
                           console.log(res)
                       } catch (err) {
                           /*Alert.alert(
                "Le fichier audio n'a pas pu être envoyé au serveur..."
            );*/
                           console.log(err)
                       }
                   }

                   async componentDidMount() {
                       //    this.checkRecordPermission()
                       try {
                           const albumsUrl = await fetch(
                               url + '/db/albums'
                           )
                           await albumsUrl
                               .json()
                               .then(albumArray => {
                                   this.setState({
                                       albums: albumArray.albums,
                                       loading: false,
                                   })
                               })
                           for (let album of this.state.albums) {
                               albumSongsUrl = await fetch(
                                   url + '/db/album-songs',
                                   {
                                       method: 'POST',
                                       headers: {
                                           Accept:
                                               'application/json',
                                           'Content-Type':
                                               'application/json',
                                       },
                                       body: JSON.stringify({
                                           album: album['name'],
                                       }),
                                   }
                               ).then(res =>
                                   res.json().then(tmp => {
                                       this.setState({
                                           tracks: tmp,
                                           loading: false,
                                       })
                                   })
                               )
                           }
                       } catch (err) {
                           console.log(
                               'Erreur lors de la récupération des données...',
                               err
                           )
                       }
                   }

                   getTitleByFileName(track) {
                       return track.filename
                           .split('.')
                           .slice(0, -1)
                           .join('.')
                   }

                   getArtistName(albumName) {
                       let artistName = ''
                       this.state.tracks.map(track => {
                           if (
                               track.metadata.album === albumName
                           ) {
                               artistName = track.metadata.artist
                           }
                       })
                       return artistName
                   }

                   render() {
                       if (!this.state.loading) {
                           return (
                               <View>
                                   <ScrollView
                                       style={{
                                           marginTop: 10,
                                       }}
                                   >
                                       {this.renderAlbums()}
                                   </ScrollView>
                                   <TouchableOpacity
                                       activeOpacity={0.0}
                                       onPress={() => {
                                           this.onRecorderClick()
                                       }}
                                   >
                                       <Image
                                           style={[
                                               styles.recordingButton,
                                               this.state
                                                   .recording
                                                   ? []
                                                   : styles.off,
                                           ]}
                                           source={require('../img/microphone.png')}
                                       />
                                   </TouchableOpacity>
                               </View>
                           )
                       } else {
                           return <ActivityIndicator />
                       }
                   }
                   renderAlbums() {
                       let arr = []
                       for (let album of this.state.albums) {
                           arr.push(
                               <View key={album.name}>
                                   <Accordion
                                       label={album.name}
                                       info={this.getArtistName(
                                           album.name
                                       )}
                                   >

                                       {this.renderTracks(album)}
                                   </Accordion>
                               </View>
                           )
                       }
                       if (!arr || arr.length === 0) {
                           return (
                               <Text
                                   style={styles.noDataMessage}
                               >
                                   Aucun album trouvé.
                               </Text>
                           )
                       }
                       console.warn(arr);
                       
                       return <View>{arr}</View>
                   }

                   renderTracks(album) {
                       const { navigate } = this.props.navigation
                       let arr = []
               
                    
                       for (let track of this.state.tracks) {
                           if (
                               track.metadata.album ===
                               album.name
                           ) {
                               let trackTitle =
                                   track.metadata.title
                               if (track.metadata.title === null)
                                   trackTitle = this.getTitleByFileName(
                                       track.metadata
                                   )
                               arr.push(
                                   <View
                                       key={
                                           trackTitle
                                       }
                                   >
                                       <Text>
                                           {
                                               trackTitle
                                           }
                                       </Text>
                                       {/* <TouchableOpacity
                                           onPress={() =>
                                               navigate(
                                                   'MusicPlayer',
                                                   {
                                                       currentTrack: track,
                                                       currentAlbum: album,
                                                       tracks: this
                                                           .state
                                                           .tracks,
                                                   }
                                               )
                                           }
                                       >
                                           <Text
                                               style={{
                                                   fontSize: 18,
                                                   marginLeft: 20,
                                                   margin: 10,
                                                   color:
                                                       'white',
                                               }}
                                           >
                                               {trackTitle}
                                           </Text>
                                       </TouchableOpacity> */}
                                   </View>
                               )
                           }
                       }
                       if (!arr || arr.length === 0) {
                           return (
                               <Text
                                   style={styles.noDataMessage}
                               >
                                   Aucune piste trouvé.
                               </Text>
                           )
                       }
                       return <View>{arr}</View>
                   }
               }
