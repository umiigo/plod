import React, { Component } from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native'
import Swiper from 'react-native-swiper'
import { Container, Header, Content, List, ListItem, Thumbnail,Title, Text, Left, Body, Right, Button, View } from 'native-base';
import Form from './AddAlbumForm'
import NewAlbumComponent from './NewAlbumComponent';
import * as styles from '../styles'

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

    renderDeleteButton = (album) =>
      <Right>
        <Button onPress={()=>this.props.deleteAlbum(album)} transparent>
          <Text>X</Text>
        </Button>
      </Right>
    

    albumSelector = (album) => {
      if (this.props.album){
        this.props.deselectAlbum()
        this.props.selectAlbum(album)
      }else{
        this.props.selectAlbum(album)
      }
    }

    
    renderAlbumList = () => (
    <View style={styles.styles.slideSwipeListAlbum}>
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
              <ListItem key={album.title} thumbnail onPress={()=> this.albumSelector(album)}>

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

                {album.title.toLowerCase() !== "unsorted" && this.renderDeleteButton(album)}

              </ListItem>
            )}
          </List>
        </Content>
      </Container>
    </View> )

    renderAlbumView = () =>  (
    <View style={styles.styles.slideSwipeListAlbum} >
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


