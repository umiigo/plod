import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Title, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
import AddAlbumComponent from './AddAlbumButton'


export default class NewAlbumComponent extends Component {
  state={
    album: this.props.album
  }
  componentDidMount(){
    this.props.getImages())
  }

  componentWillUpdate(nextState){
    if (nextState.album!==this.state.album){
    this.props.getImages()}
  }

  renderAlbumAndImages = () => <Container>
  <Header transparent>
    <Left><Title>{this.props.album.title}</Title></Left>
    <Right>
    <Button transparent onPressIn={()=>this.props.deselectAlbum()}>
    <Title>X</Title>
            </Button>
    </Right>
  </Header>
    <Content>
    {this.props.images.map(image => 
      <Card>
        {/* <CardItem>
          <Left>
            <Thumbnail source={{uri: 'Image URL'}} />
            <Body>
              <Text>NativeBase</Text>
              <Text note>GeekyAnts</Text>
            </Body>
          </Left>
        </CardItem> */}
        <CardItem cardBody>
          <Image source={{uri: image.uri}} style={{
              flex: 1,
              aspectRatio: 1.333, 
              resizeMode: 'contain'
          }}/>
        </CardItem>
        <CardItem>
                        <Left>
            <Button transparent>
              <Icon active name="cloud-circle" style={{fontSize: 30}} />
            </Button>
          </Left>
          <Right>
            <Button transparent>
              <Icon active name="share" style={{fontSize: 30}} />
            </Button>
          </Right>
      

        </CardItem>
      </Card>)}
      <AddAlbumComponent
        state={this.props.state}
        getAlbumImages={this.props.getAlbumImages}
        incrementNumberOfImages={this.props.incrementNumberOfImages}
      ></AddAlbumComponent>
    </Content>
  </Container> 

  render() {
    return (
      this.props.album?
      this.renderAlbumAndImages():
      null
    );
  }
}