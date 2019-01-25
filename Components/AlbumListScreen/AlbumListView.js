import React, { Component } from 'react';
import { Container, Content, Button, View } from 'native-base';
import AlbumListHeader from './aaAlbumListHeader'
// import AddAlbumButton from '../AddAlbumButton';
import AlbumListContainer from './ac03AlbumList';

import * as styles from '../../styles'


export default class AlbumListView extends Component {

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
   
    render() {
    return (
      <View style={styles.styles.slideSwipeListAlbum}>
        <Container>
            <AlbumListHeader></AlbumListHeader>
            {/* <AddAlbumButton
              state={this.props.state}
              getAlbumImages={this.props.getAlbumImages}
              incrementNumberOfImages={this.incrementNumberOfImages}
            >
            </AddAlbumButton> */}
            <AlbumListContainer 
              albums={this.props.albums} 
              deselectAlbum={this.props.deselectAlbum} 
              selectAlbum={this.props.selectAlbum}>
            </AlbumListContainer>
        </Container>
      </View> 
    )
  }
}


