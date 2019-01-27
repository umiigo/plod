
import React from 'react';
import { CameraRoll, View, FlatList, StyleSheet, InteractionManager, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Container, Header, Title, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

import { Constants } from 'expo';

const NUM_COLUMNS = 1;
const PAGE_SIZE = NUM_COLUMNS * 10;


const getImages = async (params) => {
  return await new Promise((res, rej) =>
    CameraRoll.getPhotos(params)
      .then(data => {
        const assets = data.edges;
        const images = assets.map(asset => asset.node.image);
        const page_info = data.page_info;
        res({ images, page_info });
      })
      .catch(rej)
  );
};

export default class App extends React.Component {


  componentDidMount(){
    console.log("PROPS:",this.props)
  }
  render() {
    return (
      <View style={styles.container}>
        <Header transparent>
          <Left><Title>{this.props.album.title}</Title></Left>
          <Right>
          <Button transparent onPressIn={()=>this.props.setSwiperView()}>
            <Title>X</Title>
          </Button>
          </Right>
        </Header>
        <Gallery 
          album={this.props.album}
        />
      </View>
    );
  }
}

class Gallery extends React.Component {
  state = {
    permission: null, // <= not ready yet
    images: null,
  };

  componentDidMount(){
      this.getMoreImages()      
  }
  
  getMoreImages = () => {
    InteractionManager.runAfterInteractions(async () => {
      const { end_cursor, has_next_page, images } = this.state;
      if (!has_next_page && images) {
        return;
      }
      const { images: newImages, page_info: pageInfo } = await getImages({
        first: PAGE_SIZE,
        after: end_cursor,
        groupTypes: "Album",
        groupName:  this.props.album.title
      });
      // console.log("Images in getMoreImages:", images)

      this.setState({
        images: (images || []).concat(newImages),
        end_cursor: pageInfo.end_cursor,
        has_next_page: pageInfo.has_next_page,
      });
    });
  };

  render = () => (
    <List
      images={this.state.images}
      onSelectImage={image => {
        console.log('Go to photo thing');
      }}
      onEndReached={this.getMoreImages}
      hasMore={this.state.has_next_page}
    />
  );
}

const List = ({ hasMore, images, onSelectImage, onEndReached }) => {

  return <FlatList
    data={images || []}
    renderItem={({ item, index }) => (
      <Item uri={item.uri} onPress={() => onSelectImage(item, index)} />
    )}
    ListFooterComponent={<LoadingFooter hasMore={hasMore} animating={false} />}
    keyExtractor={item => item.uri}
    numColumns={NUM_COLUMNS}
    onEndReachedThreshold={0.5}
    onEndReached={onEndReached}
  />
    }

const Item = ({ uri, onPress }) => (
  <TouchableOpacity style={styles.touchable} onPress={onPress}>
    <Card>
        
        <CardItem cardBody>
          <Image source={{uri}} style={{
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
      </Card>
  </TouchableOpacity>
);

const LoadingFooter = ({ hasMore }) => (
  <View style={styles.footerContainer}>
    {hasMore && <ActivityIndicator />}
    <Text style={styles.footerText}>
      {hasMore ? 'Loading more photos...' : "That's all!"}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  touchable: {
    flex: 1,
    aspectRatio: 1,
  },
  image: {
    flex: 1,
    margin: 1,
    backgroundColor: '#ddd',
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    flexDirection: 'row',
  },
  footerText: {
    opacity: 0.7,
    marginLeft: 8,
  },
});
