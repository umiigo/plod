import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Container, Content } from 'native-base'
import Swiper from 'react-native-swiper'

import Camera from './Components/Camera'
import Deck from './Components/Deck'
import AlbumList from './Components/AlbumList'
import ListAlbum from './Components/ListAlbum'
import AlbumComponent from './Components/AlbumComponent'
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
export default class App extends React.Component {

  constructor() {
    super()
    this.state = {
      outerScrollEnabled: true,
      clicked: false
    }
  }

  toggleDeck = () => this.setState({clicked: !this.state.clicked})

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
      this.state.clicked?
              <View style={styles.slideSwipe}>
                <Deck></Deck>
              </View>
      :
      <Container>
        <Content>
          <Swiper
            loop={false}
            showsPagination={false}
            index={0}
            scrollEnabled={this.state.outerScrollEnabled}
          >
            <View style={styles.slideSwipe}>
              <AlbumComponent></AlbumComponent>
            </View>
            <View style={styles.slideSwipe}>
              <ListAlbum></ListAlbum>
            </View>
            <Swiper
              loop={false}
              showsPagination={false}
              horizontal={false}
              index={1}
              onIndexChanged={(index) => this.verticalScroll(index)}
            >
              <View style={styles.slideDefault}>
                <Text style={styles.text}>Search</Text>
              </View>

              <View style={{ flex: 1 }}>
                <Camera toggleDeck={this.toggleDeck}></Camera>
              </View>
              {/* <View style={styles.slideSwipe}>
                <Deck></Deck>
              </View> */}
            </Swiper>
            <View style={styles.slideDefault}>
              <Text style={styles.text}>Stories</Text>
            </View>
          </Swiper>
        </Content>
      </Container>
    );
  }
}