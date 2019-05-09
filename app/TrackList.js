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
// import { AccordionList } from 'accordion-collapse-react-native'
// import { Separator } from 'native-base'
import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import Permissions from 'react-native-permissions'
const url = 'http://7117de9a.ngrok.io'
export default class App extends Component {
                   constructor(props) {
                       super(props)

                       this.state = {
                           tracks: [],
                           loading: true,
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
                               </View>
                           )
                       } else {
                           return <ActivityIndicator />
                       }
                   }
                   _head(item) {
                       return (
                           <Separator
                               bordered
                               style={{ alignItems: 'center' }}
                           >
                               <Text>{item.title}</Text>
                           </Separator>
                       )
                   }
                   _body(item){
                        return (
                            <View style={{padding:10}}>
                            <Text style={{textAlign:'center'}}>{item.body}</Text>
                            </View>
                        );
                    }
                   renderAlbums() {
                    let arr = []
                    for (let album of this.state.albums) {
                        arr.push(
                            <View key={album.name}>
                                {/* <Accordion
                                    label={album.name}
                                    info={this.getArtistName(
                                        album.name
                                    )}
                                >
                                    {this.renderTracks(
                                        album
                                    )}
                                </Accordion> */}
                                <Text>{this.getArtistName(
                                        album.name
                                    )}</Text>
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
                                   <View key={trackTitle}>
                                       <TouchableOpacity
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
                                       </TouchableOpacity>
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
