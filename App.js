import React from 'react';
import { TextInput, CameraRoll, Button, StyleSheet, Text, View } from 'react-native';
import { Container, Content } from 'native-base'
import Swiper from 'react-native-swiper'

// import aws_exports from './aws-exports';
// import { withAuthenticator } from 'aws-amplify-react-native';
// import { Connect } from 'aws-amplify-react-native';
// import Amplify, { API, graphqlOperation, Storage } from 'aws-amplify';
// import SharedListAlbum from './Components/SharedListAlbum'
// import { throws } from 'assert';
import AddAlbumForm from './Components/AddAlbumForm'
import AlbumListView from './Components/AlbumListScreen/AlbumListView'
import CameraNew from './Components/CameraNew'
import NewCardDeck from './Components/NewCardDeck'
import NewAlbumComponent from './Components/NewAlbumComponent'
import * as styles from './styles'


export default class App extends React.Component {
  
  state = {
    // views:
    cardDeckView: false,
    albumFormView: false,
    swiperView: true,
    albumPicsView: false,
    //  other stuff
    i: 10,
    outerScrollEnabled: true,
    albums: [],
    images: [],
    album: false,
    albumImages: [],
  }

    setCardDeckView = () =>{
      this.setState({
        cardDeckView: true,
        albumFormView: false,
        swiperView: false,
        albumPicsView: false,
      })
      console.log('changed state to card deck')
    }

    setAlbumFormView = () =>{
      this.setState({
        cardDeckView: false,
        albumFormView: true,
        swiperView: false,
        albumPicsView: false,
      })
      console.log('changed state to album form')
    }

    setSwiperView = () =>{
      this.setState({
        cardDeckView: false,
        albumFormView: false,
        swiperView: true,
        albumPicsView: false,
      })
      console.log('changed state to swiper')
    }

    setAlbumPicsView = (album) =>{
      this.selectAlbum(album)
      this.setState({
        cardDeckView: false,
        albumFormView: false,
        swiperView: false,
        albumPicsView: true,
      })
      console.log('changed state to album pics')
    }



  getImages = async params => {
    return await new Promise((res, rej) =>
      CameraRoll.getPhotos(params)
        .then(data => {
          const assets = data.edges;
          const images = assets.map(asset => asset.node.image);
          const page_info = data.page_info;
          res({ images, page_info });
        })
        .then(images => this.setState({ images }))
        .catch(rej)
    );
  };
  toggleDeck = () => this.setState({ cardDeckView: !this.state.cardDeckView })
  togglealbumFormView = () => this.setState({ albumFormView: !this.state.albumFormView })
  toggleCreateAlbumView = () => togglealbumFormView()
  addUnsorted = (resp) => this.setState({ albums: [...this.state.albums, resp] })
  getAlbums = () => Expo.MediaLibrary.getAlbumsAsync().then(albums => this.setState({ albums }))

  getAlbum = () => Expo.MediaLibrary.getAlbumAsync(this.state.album.title).then(album => this.setState({ album }))

  getAlbumImages = () => {
    return Expo.MediaLibrary.getAssetsAsync({
      first: this.state.i,
      album: this.state.album.id
    })
      .then(images => this.setState({ albumImages: images.assets }))
  }
  deselectAlbum = () => this.setState({ album: !this.state.album, albumImages: [] })

  albumFalse = () => this.setState({ album: false })
  selectAlbum = (album) => this.setState({ album: album })
  deleteAlbum = (album) => Expo.MediaLibrary.deleteAlbumsAsync(album, true).then(resp => this.getAlbums())


  incrementNumberOfImages = (num) => {
    this.setState({ i: this.state.i + num })
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
      if(this.state.cardDeckView){
        return <View style={styles.styles.slideSwipe}>
          <NewCardDeck

            setSwiperView={this.setSwiperView}
            setAlbumFormView={this.setAlbumFormView}

            toggleRenderAlbumForm={this.toggleRenderAlbumForm}
            toggleCreateAlbumView={this.togglealbumFormView}
            
            />
        </View>}

      if(this.state.albumFormView){
     return <AddAlbumForm
          setCardDeckView={this.setCardDeckView}
          toggleCreateAlbumView={this.toggleCreateAlbumView}
          // toggleDeck={this.toggleDeck}
          getAlbum={this.getAlbums}
          state={this.state}
        />
      }

        if(this.state.album && this.state.albumPicsView){
            return<View style={styles.styles.slideSwipe}>
              <NewAlbumComponent

                setSwiperView={this.setSwiperView}
                selectAlbum={this.selectAlbum}
                deselectAlbum={this.deselectAlbum}
                album={this.state.album}
              />
            </View>}
          
          if(this.state.swiperView){
         return <Container>
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

                  setAlbumPicsView={this.setAlbumPicsView}
                  setSwiperView={this.setSwiperView}

                  getAlbum={this.getAlbum}
                  album={this.state.album}
                  toggleDeck={this.toggleDeck}
                  togglealbumFormView={this.togglealbumFormView}
                  albums={this.state.albums}
                  selectAlbum={this.selectAlbum}
                  deselectAlbum={this.deselectAlbum}
                  deleteAlbum={this.deleteAlbum}
                  albumFormView={this.state.albumFormView}
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

                  setCardDeckView={this.setCardDeckView}
                  setSwiperView={this.setSwiperView}

                  // toggleDeck={this.toggleDeck}
                  addUnsorted={this.addUnsorted}
                />
              </Swiper>
              
              {/* shared AWS stuff: DO NOT REMOVE */}
              {/* <View style={styles.styles.slideSwipe}>
                  <SharedListAlbum getAlbums={this.getAlbums}
                  getAlbum={this.getAlbum}
                  album={this.state.album}
                  toggleDeck={this.toggleDeck}
                  togglealbumFormView={this.togglealbumFormView}
                  albums={this.state.albums}
                  selectAlbum={this.selectAlbum}
                  deselectAlbum={this.deselectAlbum}
                  deleteAlbum={this.deleteAlbum}
                  albumFormView={this.state.albumFormView}
                  state={this.state}>
                  </SharedListAlbum>
                </View>   */}
              {/* This to be reinabled when shared albums */}
            </Swiper>
          </Container>
          }
    
  }
}
// {/* // export default withAuthenticator(App, { includeGreetings: false });
//  <----------reinable for shared albums
// export default App */}





