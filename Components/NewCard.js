import React, {Component} from 'react'
import { Image, PanResponder,  Animated, } from 'react-native'
import * as styles from '../styles'


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
        const swipedRight = direction > 0
        const asset = this.props.image
        

        if (absDx > 120) {
          Animated.decay(this.pan, {
            velocity: {x:3 * direction, y:0},
            deceleration: 0.995,
          }).start(this.props.onSwipeOff(swipedRight, asset))
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
    const {uri} = this.props.image


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
        style={[styles.styles.card, animatedStyle]}>
        <Image
          style={{flex:1, 
            // aspectRatio: 1.5, 
            resizeMode: 'contain'}}
          source={{uri: uri}}
        />
        {/* <View style={{margin:20}}>
          <Text style={{fontSize:20}}>{name}, {profileAge}</Text>
          <Text style={{fontSize:15, color:'darkgrey'}}>{bio}</Text>
        </View> */}
      </Animated.View>
    )
  }
}
