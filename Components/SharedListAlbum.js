import React, { Component } from 'react';
import aws_exports from '../aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
import { Connect, S3Image } from 'aws-amplify-react-native';
import Amplify, { API, graphqlOperation, Storage } from 'aws-amplify';
import { NativeRouter as Router, Route, Link as NavLink} from "react-router-native";
import { Container, Content, Header, Label, List, ListItem, Left,Text, Item, Input, Right, Thumbnail,Body, Button, Form, Title, Card, CardItem, Icon } from 'native-base'
import { throws } from 'assert';
import {v4 as uuid} from 'uuid';
import { ImagePicker } from 'expo';
import { Image, View, ScrollView, TouchableOpacity } from 'react-native';
import mime from 'mime-types'



Amplify.configure(aws_exports);


function makeComparator(key, order = 'asc') {
  return (a, b) => {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;

    const aVal = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
    const bVal = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (aVal > bVal) comparison = 1;
    if (aVal < bVal) comparison = -1;

    return order === 'desc' ? (comparison * -1) : comparison
  };
}


const ListAlbums = `query ListAlbums {
  listAlbums(limit: 9999) {
      items {
          id
          name
      }
  }
}`;

const SubscribeToNewAlbums = `
  subscription OnCreateAlbum {
    onCreateAlbum {
      id
      name
    }
  }
`;

const GetAlbum = `query GetAlbum($id: ID!, $nextTokenForPhotos: String) {
  getAlbum(id: $id) {
    id
    name
    members
    photos(sortDirection: DESC, nextToken: $nextTokenForPhotos) {
      nextToken
      items {
        thumbnail {
          width
          height
          key
        }
      }
    }
  }
}
`;

class S3ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { uploading: false,
    image: null }
  }

 pickImage = async () => {
  let pickerResult = await ImagePicker.launchImageLibraryAsync({
  });
  this.setState({image: pickerResult});
  
  if (this.state.image){
    this.onChange()
    this.setState({image:null})
  }
 }

 onChange = async () => {
  const uri = this.state.image.uri
  const fileName = uuid()
  const fileType = mime.lookup(this.state.image.uri);
  const file = await new Promise((resolve, reject) => {
    this.setState({uploading: true});
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
        resolve(xhr.response);
    };
    xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
})
  try {
    const result = await Storage.put(
      fileName,
      file,
      {
        customPrefix: { public: 'uploads/', contentType: 'image/${fileType}' },
        metadata: { albumid: this.props.albumId }
      }
    )
    console.log('Uploaded file: ', result);
    this.setState({uploading: false});
    this.setState({image: false})
  }catch (err) {
    console.log('error: ', err)
  }
}
  render() {
    return (
      <Content>
        <Form>
          <Button full info
          onPress={this.pickImage}
          disabled={this.state.uploading}
        >
         {this.state.uploading ? <Text>Uploading...</Text> : <Text>Pick Image</Text> }
        </Button>
        </Form>
      </Content>
    );
  }
}



class PhotosList extends React.Component {
  photoItems() {
    return (
    <Content>
    {this.props.photos.map(photo =>
        <Card>
          {console.log(photo)}
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
       
            {/* <Image source={{uri: photo.thumbnail.key}} key={photo.thumbnail.key} imgKey={photo.thumbnail.key.replace('public/', '')} style={{height: 300, width: null, flex: 1}}/> */}
  
              <S3Image 
                key={photo.thumbnail.key} 
                imgKey={photo.thumbnail.key.replace('public/', '')} 
                style={{height: 300, width: null, flex: 1}}
              />
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
      </Content>
    )
  }
  render() {
    return (
      <Content>
        {this.photoItems()}
      </Content>
    );
  }
}



class AlbumDetailsLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nextTokenForPhotos: null,
      hasMorePhotos: true,
      album: null,
      loading: true,
      addUserView: false
    }
  }

  toggleAddUserView = () => this.setState({addUserView: !this.state.addUserView}) 

  async loadMorePhotos() {
    if (!this.state.hasMorePhotos) return;
    this.setState({ loading: true });
    const { data } = await API.graphql(graphqlOperation(GetAlbum, {id: this.props.id, nextTokenForPhotos: this.state.nextTokenForPhotos}));
    let album;
    if (this.state.album === null) {
      album = data.getAlbum;
    } else {
      album = this.state.album;
      album.photos.items = album.photos.items.concat(data.getAlbum.photos.items);
    }
    this.setState({ 
      album: album,
      loading: false,
      nextTokenForPhotos: data.getAlbum.photos.nextToken,
      hasMorePhotos: data.getAlbum.photos.nextToken !== null
    });
  }
  componentDidMount() {
    this.loadMorePhotos();
  }
  render() {
    return (
      this.state.addUserView?
     <AddUserToAlbumForm toggleAddUserView={this.toggleAddUserView}loadingPhotos={this.state.loading} album={this.state.album} loadMorePhotos={this.loadMorePhotos.bind(this)} hasMorePhotos={this.state.hasMorePhotos}/>
        :
     <AlbumDetails toggleAddUserView={this.toggleAddUserView} loadingPhotos={this.state.loading} album={this.state.album} loadMorePhotos={this.loadMorePhotos.bind(this)} hasMorePhotos={this.state.hasMorePhotos}/>
    )

  }
}

class AddUserToAlbumForm extends Component {
  render() {
    if (!this.props.album) return <Text>Loading Form...</Text>
    return (
      <Container>
        <Header>
          <Left>
          </Left>
          <Body>
            <Title>Add A User</Title>
          </Body>
          <Right>
            <Button transparent onPress={()=>this.props.toggleAddUserView()}>
              <Text>Cancel</Text>
            </Button>
          </Right>
        </Header>
          <Header transparent></Header>
          <AddUsernameToAlbum albumId={this.props.album.id} />          
    </Container>
    )
  }
}



class AlbumDetails extends Component {
  render() {
    if (!this.props.album) return <Text>Loading album...</Text>
    return (
      <Container>
        <Content>
        <View style={{flex:5}}>
          <View style={{flex:1}}>
            <Content>
            <Header transparent>
            <Left>
              <Title>{this.props.album.name}</Title>
            </Left>
            <Right>
              <Button transparent>
                  <Route
                  path="/albums/:albumId"
                  render={ () => <NavLink to='/'><Label>Back</Label></NavLink>}
                />
              </Button>
            </Right>
          </Header>
            </Content>
          </View>
          <View  style={{flex:5}}>
          <Content>
          <AlbumMembers toggleAddUserView={this.props.toggleAddUserView} members={this.props.album.members} />
          </Content>
          </View>
        </View>
        <S3ImageUpload albumId={this.props.album.id}/>
        <PhotosList photos={this.props.album.photos.items} />
        {
          this.props.hasMorePhotos && 
        <Button full info
          onPress={this.props.loadMorePhotos}
          disabled={this.props.loadingPhotos}
        >
         {this.props.loadingPhotos ? <Text>Loading...</Text> : <Text>Load more photos</Text> }
        </Button>
        }
      </Content>
    </Container>
    )
  }
}

class AddUsernameToAlbum extends Component {
  constructor(props) {
    super(props);
    this.state = { username: '' };
  }      
handleSubmit = async (event) => {
    const AddUsernameToAlbum = `
      mutation AddUser($username: String!, $albumId: String!) {
          addUsernameToAlbum(username: $username, albumId: $albumId) {
              id
          }
      }`;
    const result = await API.graphql(graphqlOperation(AddUsernameToAlbum, { username: this.state.username, albumId: this.props.albumId }));
    console.log(`Added ${this.state.username} to album id ${result.data.addUsernameToAlbum.id}`);
    this.setState({ username: '' });
  }
render() {
    return (
      <Container>
        <Content>
          <Item regular >
            <Input placeholder='Enter Username' onChangeText={(e)=>(this.setState({username: e}))}/>
          </Item>

          <Header transparent/>
            <Body flexDirection= "row" justifyContent= "center">
             <Button block info onPress={()=>(this.handleSubmit())}>
              <Text>Add New User</Text>
            </Button>
          </Body>      
      </Content>
      </Container>
    )
  }
}




const AlbumMembers = (props) => (
  <Content>
    <View style={{ height: 130 }}>
        
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 7 }}>
              <Text style={{ justifyContent:'space-between', alignItems:'center', textAlign:'center' }}></Text>
              <Text style={{ justifyContent:'space-between', alignItems:'center', textAlign:'center' }}>This Albums Members:</Text>
              <Text style={{ justifyContent:'space-between', alignItems:'center', textAlign:'center' }}></Text>
        </View>
        
        
        <View style={{ flex: 4 }}>

            <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{alignItems: 'center', paddingStart: 5, paddingEnd: 5, justifyContent: 'space-between'}}>       
                
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 7 }}>
              {props.members && props.members.map((member) =>{
                  return(
                      <Content>
                        <TouchableOpacity onPress={()=>this.selectAlbum(album)}>
                          <Thumbnail key={member} circle style={{ marginHorizontal: 15, borderColor: 'grey', borderWidth: 2, backgroundColor:'grey' }}/>
                            {/* source={require('../assets/1.jpg')} /> */}
                          <Text style={{ justifyContent:'space-between', alignItems:'center', textAlign:'center' }}>{member}</Text>
                        </TouchableOpacity>
                      </Content>
                    )}
                  )}
                      <Content>
                        <TouchableOpacity onPress={()=>props.toggleAddUserView()}>
                          <Thumbnail circle medium style={{ marginHorizontal: 15, borderColor:'white', borderWidth: 2, backgroundColor:'none' }} source={require('../assets/14.png')} />
                          <Text style={{ justifyContent:'space-between', alignItems:'center', textAlign:'center' }}></Text>
                        </TouchableOpacity>
                      </Content>
              </View>
            </ScrollView>
    </View>
    </View>
  </Content>
);


   





class AlbumsList extends React.Component {
  albumItems() {
    return this.props.albums.sort(makeComparator('name')).map(album =>
      <ListItem key={album.id}>
         <Body>
           <NavLink to={`/albums/${album.id}`}><Text>{album.name}</Text></NavLink>
        </Body>
      </ListItem>
    );
  }

  render() {
    return (
      <Content>
            <Header>
          <Body>
            <Title>
              Shared Albums
            </Title>
          </Body>
        </Header>
        <List divided relaxed>
          {this.albumItems()}
        </List>
      </Content>
    );
  }
}


class AlbumsListLoader extends React.Component {
  onNewAlbum = (prevQuery, newData) => {
    let updatedQuery = Object.assign({}, prevQuery);
    updatedQuery.listAlbums.items = prevQuery.listAlbums.items.concat([newData.onCreateAlbum]);
    return updatedQuery;
  }

  render() {
    return (
      <Connect
        query={graphqlOperation(ListAlbums)}
        subscription={graphqlOperation(SubscribeToNewAlbums)}
        onSubscriptionMsg={this.onNewAlbum}
      >
        {({ data, loading, errors }) => {
          if (loading) { return <Text>Loading...</Text>; }
          if (!data.listAlbums) return;

          return <AlbumsList albums={data.listAlbums.items} />;
        }}
      </Connect>
    );
  }
}

class SharedListAlbum extends Component {
  render() {
    return (
      <Router>
        <Content>
          <Route path="/" exact component={AlbumsListLoader}/>
          <Route
            path="/albums/:albumId"
            render={ props => <AlbumDetailsLoader id={props.match.params.albumId}/> }
          />
      </Content>
    </Router>
    );
  }
}


export default SharedListAlbum
