import React, { Component } from 'react';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
export default class FloatingLabelExample extends Component {
  state={
    albumName:false,
  }

  createAlbum = () => Expo.MediaLibrary.createAlbumAsync('ok')
                        .then(() => {
                        console.log('Album created!');
                        })
                        .catch(error => {
                        console.log('err', error);
                        });
  render() {
    return (
      <Container>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>New Album Name</Label>
              <Input onChange={(e)=>this.setState({albumName: e.target.value})} />
              {console.log(this.state.albumName)}
            </Item>
            <Button full info onPress={()=>(this.createAlbum())}>
              <Text>Create</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}