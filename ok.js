import React,{Component} from 'react';
import { TextInput, Button, StyleSheet, Text, View } from 'react-native';

import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react-native';
Amplify.configure(aws_exports);
import { Container, Content, Header, Label, List, ListItem, Left, Right, Body } from 'native-base'
// import { throws } from 'assert';
import { Connect } from 'aws-amplify-react-native';
import { graphqlOperation }  from 'aws-amplify';
import * as styles from '../styles'

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


class AlbumsList extends React.Component {
  albumItems() {
    return this.props.albums.sort(makeComparator('name')).map(album =>
                <ListItem key={album.id}>

                {/* <Left>
                <Button transparent onPress={(album)=>(console.log(this.setState({selectedAlbum:album})))}>
                    <Text>View</Text>
                  </Button>
                  <Thumbnail square source={{ uri: 'Image URL' }} />
                </Left> */}

                <Body>
                  <Text>{album.name}</Text>
                </Body>

                {/* <Right>
                  <Button onPress={()=>this.props.deleteAlbum(album)} transparent>
                    <Text>X</Text>
                  </Button>
                </Right> */}

              </ListItem>
   
    );
  }

  render() {
    return (
      <Content>
        <Header><Text>Cloud Albums</Text></Header>
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


class App extends Component {
  render() {
    return (
        <Container>
          <AlbumsListLoader />
      
      </Container>
    );
  }
}


export default withAuthenticator(App, { includeGreetings: true });