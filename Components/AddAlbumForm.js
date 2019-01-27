import React, { Component } from 'react';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text, Left, Icon, Body, Title, Right } from 'native-base';
import Amplify, { API, graphqlOperation } from 'aws-amplify';



class NewAlbum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      albumName: ''
    };
  }

  handleSubmit = async (event) => {
    const NewAlbum = `mutation NewAlbum($name: String!) {
          createAlbum(input: {name: $name}) {
              id
              name
          }
      }`;
    try {
      const result = await API.graphql(graphqlOperation(NewAlbum, { name: this.state.albumName }));
      console.info(`Created album with id ${result.data.createAlbum.id}`);
      this.setState({ albumName: ''});
    }
    catch (err) {
      console.error('NewAlbum mutation failed', err);
    }
  }

  render() {
    return (
      <Content>
        <Header><Button full info onPress={()=>this.handleSubmit()}><Text>Add a new album</Text></Button></Header>
        <Item regular >
              <Input placeholder='Enter New Album Name'onChangeText={(e)=>(this.setState({albumName: e}))} />              
        </Item>
      </Content>
    )
  }
}


export default class AddAlbumForm extends Component {

  state = {
    albumName:false
  }

  handleSubmit = async (event) => {
    const NewAlbum = `mutation NewAlbum($name: String!) {
          createAlbum(input: {name: $name}) {
              id
              name
          }
      }`;
    try {
      const result = await API.graphql(graphqlOperation(NewAlbum, { name: this.state.albumName }));
      console.info(`Created album with id ${result.data.createAlbum.id}`);
      this.setState({ albumName: ''});
    }
    catch (err) {
      console.error('NewAlbum mutation failed', err);
    }
  }

  createAlbum = () => Expo.MediaLibrary.createAlbumAsync(this.state.albumName)
                        .then(() => {
                        this.props.toggleCreateAlbumView()
                        this.props.toggleDeck()
                        this.props.getAlbums()
                        // this.handleSubmit()    < --------- Remember to reinable when adding shared albums
                        alert(this.state.albumName + ' created')
                        })
                        .catch(error => {
                        console.log('err', error);
                        });
                        
  render() {
    return (
      <Container>
      <Header>
          <Left>
          </Left>
          <Body>
            <Title>Create Album </Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.props.setCardDeckView()&&this}>
              <Text>Cancel</Text>
            </Button>
          </Right>
        </Header>
        <Content>
           <Item regular >
              <Input placeholder='Enter New Album Name'onChangeText={(e)=>(this.setState({albumName: e}))} />              
            </Item>
            <Header transparent/>
            <Body flexDirection= "row" justifyContent= "center">
            <Button block info onPress={()=>(this.createAlbum())}>
              <Text>Create New Album</Text>
            </Button>
            </Body>
        </Content>
        </Container>

    );
  }
}