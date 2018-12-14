//card.js

import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Container, Content, Header, Item, Icon, Input, Button } from 'native-base'

const {width, height} = Dimensions.get('window')

export default class Card extends Component {
  componentWillMount() {
    this.pan = new Animated.ValueXY()

    this.cardPanResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        {dx:this.pan.x, dy:this.pan.y},
      ]),
      onPanResponderRelease: (e, {dx}) => {
        const absDx = Math.abs(dx)
        const direction = absDx / dx

        if (absDx > 120) {
          if (direction === 1) {
            this.props.onSwipeRight(this.props.image)
          } else if (direction === -1) {
            this.props.onSwipeLeft(this.props.image)
          }
          this.props.onSwipeOff()
          Animated.decay(this.pan, {
            velocity: {x:3 * direction, y:0},
            deceleration: 0.995,
          }).start()
        } else {
          Animated.spring(this.pan, {
            toValue: {x:0, y:0},
            friction: 4.5,
          }).start()
        }
      },
    })
  }

  render() {
    const {uri} = this.props.image.node.image
    // const {timestamp} = this.props.image.node
    // const dateString = moment.unix(timestamp).format("dddd DD MMMM YYYY HH:mm");
    // const dateSTRING = dateString.toUpperCase()
    const galleryImage = `${uri}`


    const rotateCard = this.pan.x.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ['10deg', '0deg', '-10deg'],
    })
    const animatedStyle = {
      transform: [
        {translateX: this.pan.x},
        {translateY: this.pan.y},
        {rotate: rotateCard},
      ],
    }

    return (
      <Animated.View
        {...this.cardPanResponder.panHandlers}
        style={[styles.card, animatedStyle]}>
        <View style={{margin:10, alignSelf:'center'}}>
          <Text style={{fontSize:17, color:'darkgrey'}}></Text>
        </View>
        <Image
          style={{flex:1, resizeMode:'contain'}}
          source={{uri: galleryImage}}
        />
        <View style={{margin:10, alignSelf:'center'}}>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginBottom: 15, alignItems: 'flex-end' }}>
                            <MaterialCommunityIcons name="message-reply"
                                style={{ color: 'white', fontSize: 36 }}
                            ></MaterialCommunityIcons>

                            <View style={{ alignItems: 'center' }}>
                                <MaterialCommunityIcons name="circle-outline"
                                    style={{ color: 'white', fontSize: 100 }}

                                ></MaterialCommunityIcons>
                                <Icon
                                    onPress={()=>this.props.toggleDeck()} name="ios-images" style={{ color: 'white', fontSize: 36 }} />
                            </View>
                            <MaterialCommunityIcons name="google-circles-communities"
                                style={{ color: 'white', fontSize: 36 }}
                            ></MaterialCommunityIcons>

                        </View>
      </Animated.View>
      
    )
  }
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: width - 20,
    height: height * 0.7,
    top: (height * 0.30) / 2,
    overflow: 'hidden',
    backgroundColor: 'white',
    margin: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
  },
})
