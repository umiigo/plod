import React, { Component } from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native'
import Swiper from 'react-native-swiper'
import { Container, Header, Content, List, ListItem, Thumbnail,Title, Text, Left, Body, Right, Button, View } from 'native-base';
import Form from './AddAlbumForm'
import NewAlbumComponent from './NewAlbumComponent';
export default class ListThumbnailExample extends Component {

    state={
      albums: (this.props.state.albums),
      album: (this.props.state.album)
    }
    componentDidMount () {
        this.props.getAlbums()
    }

    componentDidUpdate(nextProps, nextState){
    if (nextState.albums!==this.state.albums){
      this.props.getAlbums()
    }
    if (nextState.album!==this.state.album &&this.state.album===false){
     this.props.getAlbum()
    }
  
    }

    albumSelector = (album) => {
      if (this.props.album){
        this.props.deselectAlbum()
        this.props.selectAlbum(album)
      }else{
        this.props.selectAlbum(album)
      }
    }

    
    renderAlbumList = () => (
    <View style={styles.slideSwipe}>
      <Container>
        <Header>
          <Body>
            <Title>
                Private Albums
            </Title>
          </Body>
        </Header>
        <Content>
          {/* <Button full info onPress={()=>this.props.toggleCreateAlbumView()}>
            <Text>ADD ALBUM</Text>
          </Button> */}
          <List>         
            {this.props.albums.map(album=>
              <ListItem thumbnail onPress={()=> this.albumSelector(album)}>

                <Left>
                {/* <Button transparent onPress={(album)=>(console.log(this.setState({selectedAlbum:album})))}>
                    <Text>View</Text>
                  </Button> */}
                  {/* <Thumbnail square source={{ uri: 'Image URL' }} /> */}
                </Left>

                <Body>
                  <Text>{album.title}</Text>
                  <Text note numberOfLines={1}>{album.assetCount} items in this album</Text>
                </Body>

                <Right>
                  <Button onPress={()=>this.props.deleteAlbum(album)} transparent>
                    <Text>X</Text>
                  </Button>
                </Right>

              </ListItem>
            )}
          </List>
        </Content>
      </Container>
    </View> )

    renderAlbumView = () =>  (
    <View style={styles.slideSwipe} >
      {/* <NewAlbumComponent
         deselectAlbum={this.props.deselectAlbum} 
         album={this.props.album} 
         getImages={this.props.getAlbumImages} 
         images={this.props.albumImages} ></NewAlbumComponent> */}
    </View>)

    
    render() {
    return (
      this.props.addAlbumView?
      <Container>
              <Content>
                  <Form toggleDeck={this.props.toggleDeck} getAlbums={this.props.getAlbums} toggleCreateAlbumView={this.props.toggleCreateAlbumView}></Form>
              </Content>
        </Container>:
        this.renderAlbumList()
    )
  }
}

const styles = StyleSheet.create({
  slideDefault: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB'
  },
  slideSwipe: {
    flex: 1,
    backgroundColor: '#9DD6EB'
  },
  text: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold'
  }
})