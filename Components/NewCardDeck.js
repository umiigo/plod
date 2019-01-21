import React, {Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from "react-native"
import { Container, Content, Icon, Thumbnail, Label, Header, Left, Right, Body, Title, Button } from 'native-base'
import Card from './newcard'

export default class App extends Component {
  getUnsortedAlbum = () => Expo.MediaLibrary.getAlbumAsync('Unsorted').then(album=> this.setState({album}))
  selectAlbum = (album) => this.setState({selectedAlbum: album})
  getImages = () =>  Expo.MediaLibrary.getAssetsAsync({album: this.state.album.id}).then(images=> this.setState({images: images.assets}))
  getAlbums = () =>  Expo.MediaLibrary.getAlbumsAsync().then(albums => this.setState({ albums }))
  state = {
    imageIndex: 0,
    album:[],
    selectedAlbum:[],
    images:[],
    albums:[]
  }
  componentDidMount(){ 
       this.getUnsortedAlbum().then(resp=>this.getImages())
       this.getAlbums()

  }

  toggleCreateAlbumView = () => {
   this.props.toggleCreateAlbumView()
   this.props.toggleDeck()
  }

  nextCard = (swipedRight, asset) => {
    this.setState({imageIndex: this.state.imageIndex + 1})
    if (swipedRight) {
        if (this.state.selectedAlbum.title==='Unsorted') {
        null} else {
        Expo.MediaLibrary.addAssetsToAlbumAsync(asset, this.state.selectedAlbum, false)
        Expo.MediaLibrary.removeAssetsFromAlbumAsync(asset, this.state.album)
        }

      } else {
        Expo.MediaLibrary.removeAssetsFromAlbumAsync(asset, this.state.album)
        Expo.MediaLibrary.deleteAssetsAsync(asset)
      }
    }

  render() {
    const {imageIndex, album} = this.state
    return (
    <Container>
      <View style={{flex:1}}>
        <View style={{flex:1}}>
          <Content>
            <Header transparent>
                <Body>
                    <Title>Add Photos to Album</Title>
                </Body>
                <Right>
                    <Button transparent onPress={()=> this.props.toggleDeck()}>
                      <Label>Done</Label>
                    </Button>
                </Right>
            </Header>
          </Content>
        </View>

        <View style={{flex:8}}>
          {this.state.images.slice(imageIndex, imageIndex + 3).reverse().map((image) => {
          return (
            <Card
            key={image.id}
            image={image}
            onSwipeOff={this.nextCard}
            album={album}/>
          )
        })}
        </View>
      </View>


      <View style={{ height: 100 }}>
        
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 7 }}>
            <Text style={{ fontWeight: 'bold' }}>Albums</Text>
        </View>
        
        <View style={{ flex: 4 }}>

            <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{alignItems: 'center', paddingStart: 5, paddingEnd: 5, justifyContent: 'space-between'}}>       
                {/* make 2 cards per row?? if possibleeeeed */}
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 7 }}>
                {this.state.albums.map(album => {
                  return(
                    this.state.selectedAlbum === album?
                      <Content>
                        <TouchableOpacity>
                          <Thumbnail circle style={{ marginHorizontal: 15, borderColor: 'green', borderWidth: 6, backgroundColor:'green' }}/>
                            {/* source={require('../assets/1.jpg')} /> */}
                          <Text style={{ justifyContent:'space-between', alignItems:'center', textAlign:'center' }}>{album.title}</Text>
                        </TouchableOpacity>
                      </Content>
                      :
                      <Content>
                        <TouchableOpacity onPress={()=>this.selectAlbum(album)}>
                          <Thumbnail circle style={{ marginHorizontal: 15, borderColor: 'grey', borderWidth: 2, backgroundColor:'grey' }}/>
                            {/* source={require('../assets/1.jpg')} /> */}
                          <Text style={{ justifyContent:'space-between', alignItems:'center', textAlign:'center' }}>{album.title}</Text>
                        </TouchableOpacity>
                      </Content>
                    )}
                  )}
                      <Content>
                        <TouchableOpacity onPress={()=>this.toggleCreateAlbumView()}>
                          <Thumbnail circle medium style={{ marginHorizontal: 15, borderColor:'white', borderWidth: 2, backgroundColor:'none' }} source={require('../assets/14.png')} />
                          <Text style={{ justifyContent:'space-between', alignItems:'center', textAlign:'center' }}></Text>
                        </TouchableOpacity>
                      </Content>
              </View>
            </ScrollView>
      </View>
    </View>
  </Container>
    )
  }
}

