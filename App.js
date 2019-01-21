import React from 'react';
import { TextInput, Button, StyleSheet, Text, View } from 'react-native';

// import aws_exports from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
// import { Connect } from 'aws-amplify-react-native';
// import Amplify, { API, graphqlOperation, Storage } from 'aws-amplify';

import { Container, Content } from 'native-base'
import Swiper from 'react-native-swiper'
import ListAlbum from './Components/ListAlbum'
import SharedListAlbum from './Components/SharedListAlbum'
import CameraNew from './Components/CameraNew'
import NewCardDeck from './Components/NewCardDeck'
import NewAlbumComponent from './Components/NewAlbumComponent'
// import { throws } from 'assert';
const styles = StyleSheet.create({
  slideDefault: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  slideSwipe: {
    flex: 1,
    backgroundColor: 'white'
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold'
  },
  containero: {
    flex: 1,
    backgroundColor: '#fff',
  }
})
class App extends React.Component {
    state = {
      outerScrollEnabled: true,
      deckView: false,
      albums: [],
      images:[],
      album:false,
      albumImages:[],
      addAlbumView: false,
      viewAlbumView: false,
      selectedAlbum: false,
      selectedImages: [],
      albumName:false
    }

  toggleDeck = () => this.setState({deckView: !this.state.deckView})
  toggleCreateAlbumView = () => this.setState({addAlbumView: !this.state.addAlbumView})


  getAlbums = () =>  Expo.MediaLibrary.getAlbumsAsync(100).then(albums => this.setState({ albums }))

  getImages = () =>  Expo.MediaLibrary.getAssetsAsync().then(images=> this.setState({images}))

  getAlbum = () => Expo.MediaLibrary.getAlbumAsync(this.state.album.title).then(album=> this.setState({album}))
  getAlbumImages = () =>  Expo.MediaLibrary.getAssetsAsync({first:10, album: this.state.album.id}).then(images=> this.setState({albumImages: images.assets}))
  deselectAlbum = () => this.setState({album:!this.state.album, albumImages:[]})
  albumFalse = () => this.setState({album: false})
  selectAlbum = (album) => this.setState({album: album})
  deleteAlbum = (album) => Expo.MediaLibrary.deleteAlbumsAsync(album, true).then(resp=> this.getAlbums())

  
  
  verticalScroll = (index) => {
    if (index !== 1) {
      this.setState({
        outerScrollEnabled: false
      })
    }
    else {
      this.setState({
        outerScrollEnabled: true
      })
    }
  }

//   componentDidMount () {
//     this.getAlbums()
// }

  // componentDidUpdate(nextProps, nextState){
  // if (nextState.albums!==this.state.albums){
  //   this.getAlbums()
  // }}
  // if (nextState.album!==this.state.album &&this.state.album===false){
  // this.getAlbum()
  // }

  // }

  render() {
    return (
      this.state.deckView?
                        <View style={styles.slideSwipe}>
                          <NewCardDeck 
                          toggleCreateAlbumView={this.toggleCreateAlbumView}
                          toggleDeck={this.toggleDeck}></NewCardDeck>
                        </View>
                        :
                          this.state.album?
                            <Container>
              
                                    <View style={styles.slideSwipe}>
                                      <NewAlbumComponent album={this.state.album} images={this.state.albumImages} getImages={this.getAlbumImages} deselectAlbum={this.deselectAlbum}></NewAlbumComponent>
                                    </View>


                            </Container>
                          :
                            <Container>

                                <Swiper
                                  loop={false}
                                  showsPagination={false}
                                  index={0}
                                  bounces={false}
                                  resistance={true}
                                  resistanceRatio={0}
                                  >                              

                                  <View style={styles.slideSwipe}>
                                    <ListAlbum getAlbums={this.getAlbums}
                                    getAlbum={this.getAlbum}
                                    album={this.state.album}
                                    toggleDeck={this.toggleDeck}
                                    toggleCreateAlbumView={this.toggleCreateAlbumView}
                                    albums={this.state.albums}
                                    selectAlbum={this.selectAlbum}
                                    deselectAlbum={this.deselectAlbum}
                                    deleteAlbum={this.deleteAlbum}
                                    addAlbumView={this.state.addAlbumView}
                                    state={this.state}>
                                    </ListAlbum>
                                  </View>
                                  
                                  <Swiper loop={false}
                                  showsPagination={false}
                                  index={0}
                                  bounces={false}
                                  resistance={true}
                                  resistanceRatio={0}
                                  >  
                                  <CameraNew toggleDeck={this.toggleDeck}></CameraNew>
                                  </Swiper>

                                  {/* <View style={styles.slideSwipe}>
                                    <SharedListAlbum getAlbums={this.getAlbums}
                                    getAlbum={this.getAlbum}
                                    album={this.state.album}
                                    toggleDeck={this.toggleDeck}
                                    toggleCreateAlbumView={this.toggleCreateAlbumView}
                                    albums={this.state.albums}
                                    selectAlbum={this.selectAlbum}
                                    deselectAlbum={this.deselectAlbum}
                                    deleteAlbum={this.deleteAlbum}
                                    addAlbumView={this.state.addAlbumView}
                                    state={this.state}>
                                    </SharedListAlbum>
                                  </View>   */}
                                  {/* This to be reinabled when shared albums */}
                                    

                                </Swiper>
                              </Container>
            
    )
  }
}
// export default withAuthenticator(App, { includeGreetings: false }); <----------reinable for shared albums
export default App





