import React, { Component } from 'react'
import { Container, Content, List, ListItem, Thumbnail,Title, Text, Left, Body, Right, Button, View } from 'native-base';
import {TouchableOpacity, StyleSheet} from 'react-native'

export default class AlbumListContainer extends Component {
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

  render() {
    return (
      <Content>
        <List>       
            {this.props.albums.map(album=>
            <ListItem key={album.title} thumbnail onPress={()=> this.albumSelector(album)}>
                {/* <Left>
                    <Button transparent onPress={(album)=>(console.log(this.setState({selectedAlbum:album})))}>
                    <Thumbnail square source={{ uri: 'Image URL' }} />
                    </Button>
                </Left> */}

                <Body>
                    <Text>{album.title}</Text>
                    <Text note numberOfLines={1}>{album.assetCount} items in this album</Text>
                </Body>

                {album.title.toLowerCase() !== "unsorted" && this.renderDeleteButton(album)}

            </ListItem>
            )}
        </List>
      </Content>
    )
  }
}

