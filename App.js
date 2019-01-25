import React from 'react';
import { TextInput, Button, StyleSheet, Text, View } from 'react-native';
import { Container, Content } from 'native-base'
import Swiper from 'react-native-swiper'

// import aws_exports from './aws-exports';
// import { withAuthenticator } from 'aws-amplify-react-native';
// import { Connect } from 'aws-amplify-react-native';
// import Amplify, { API, graphqlOperation, Storage } from 'aws-amplify';
// import SharedListAlbum from './Components/SharedListAlbum'
// import { throws } from 'assert';
import AlbumListView from './Components/AlbumListScreen/AlbumListView'
import CameraNew from './Components/CameraNew'
import NewCardDeck from './Components/NewCardDeck'
import NewAlbumComponent from './Components/NewAlbumComponent'
import * as styles from './styles'


class App extends React.Component {
    state = {
      i: 10,
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

  addUnsorted = (resp)=> this.setState({albums: [...this.state.albums, resp]})


  getAlbums = () =>  Expo.MediaLibrary.getAlbumsAsync(100).then(albums => this.setState({ albums }))

  getImages = () =>  Expo.MediaLibrary.getAssetsAsync().then(images=> this.setState({images}))

  getAlbum = () => Expo.MediaLibrary.getAlbumAsync(this.state.album.title).then(album=> this.setState({album}))
  getAlbumImages = () =>  {
    return Expo.MediaLibrary.getAssetsAsync({
      first:this.state.i,
      album: this.state.album.id
    })
    .then(images=> this.setState({albumImages: images.assets}))
  }
  deselectAlbum = () => this.setState({album:!this.state.album, albumImages:[]})
  albumFalse = () => this.setState({album: false})
  selectAlbum = (album) => this.setState({album: album})
  deleteAlbum = (album) => Expo.MediaLibrary.deleteAlbumsAsync(album, true).then(resp=> this.getAlbums())

  
  incrementNumberOfImages = (num)=>{
    this.setState({i: this.state.i+num})
  }
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

  render() {
    return (
      this.state.deckView?
                        <View style={styles.styles.slideSwipe}>
                          <NewCardDeck 
                          toggleCreateAlbumView={this.toggleCreateAlbumView}
                          toggleDeck={this.toggleDeck}></NewCardDeck>
                        </View>
                        :
                          this.state.album?
                            <Container>
              
                                    <View style={styles.styles.slideSwipe}>
                                      <NewAlbumComponent 
                                      album={this.state.album}
                                       images={this.state.albumImages} 
                                       getImages={this.getAlbumImages} 
                                       deselectAlbum={this.deselectAlbum}
                                       state={this.state}
                                        getAlbumImages={this.getAlbumImages}
                                        incrementNumberOfImages={this.incrementNumberOfImages}
                                       ></NewAlbumComponent>
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

                                  <View style={styles.styles.slideSwipe}>
                                    <AlbumListView getAlbums={this.getAlbums}
                                      getAlbum={this.getAlbum}
                                      album={this.state.album}
                                      toggleDeck={this.toggleDeck}
                                      toggleCreateAlbumView={this.toggleCreateAlbumView}
                                      albums={this.state.albums}
                                      selectAlbum={this.selectAlbum}
                                      deselectAlbum={this.deselectAlbum}
                                      deleteAlbum={this.deleteAlbum}
                                      addAlbumView={this.state.addAlbumView}
                                      state={this.state}
                                      getAlbumImages={this.getAlbumImages}
                                      incrementNumberOfImages={this.incrementNumberOfImages}
                                    />
                                  </View>
                                  
                                  <Swiper 
                                    loop={false}
                                    showsPagination={false}
                                    index={0}
                                    bounces={false}
                                    resistance={true}
                                    resistanceRatio={0}
                                  >  
                                    <CameraNew 
                                      toggleDeck={this.toggleDeck}
                                      addUnsorted={this.addUnsorted}
                                    />
                                  </Swiper>

                                  {/* <View style={styles.styles.slideSwipe}>
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





