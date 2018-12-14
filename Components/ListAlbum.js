import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, View } from 'native-base';
import Form from './AddAlbumForm'
export default class ListThumbnailExample extends Component {
    state = {
        albums: [],
        images:[],
        addAlbumView: false
    }

    getAlbums = () =>  Expo.MediaLibrary.getAlbumsAsync().then(albums => this.setState({ albums }))
    getImages = () =>  Expo.MediaLibrary.getAssetsAsync().then(images=> this.setState({images}))


    componentDidMount () {
        this.getAlbums()
    }

    render() {
        console.log(this.state.albums)
    return (
    this.state.addAlbumView?
     <Container addAlbumView={this.state.addAlbumView}>
         <Header/>
            <Content>
          <Form></Form>
            </Content>
    </Container>:
      <Container>
        <Header/>
        <Content>
          <Button full info onPress={()=>this.setState({addAlbumView: !this.state.addAlbumView})}>
            <Text>ADD ALBUM</Text>
          </Button>
          <List>
            {this.state.albums.map(album=>
            <ListItem thumbnail>
              <Left>
                {/* <Thumbnail square source={{ uri: 'Image URL' }} /> */}
              </Left>
              <Body>
                <Text>{album.title}</Text>
                <Text note numberOfLines={1}>{album.assetCount} items in this album</Text>
              </Body>
              <Right>
                {/* <Button transparent>
                  <Text>View</Text>
                </Button> */}
              </Right>
            </ListItem>
            )}
          </List>
        </Content>
      </Container>
    )
  }
}