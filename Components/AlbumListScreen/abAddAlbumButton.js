import React, { Component } from 'react'
import {Button, Text} from 'native-base';


export default class AddAlbumButton extends Component {
  render() {
    return (
        <Button full info onPress={()=>this.props.toggleCreateAlbumView()}>
            <Text>
                ADD ALBUM
            </Text>
        </Button>
    )
  }
}

