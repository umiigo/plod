// import React,{Component} from 'react';
// import { TextInput, StyleSheet, View } from 'react-native';


// import { Container, Content, Header, Label, List, ListItem, Left,Text, Item, Input, Right, Body, Button, Title } from 'native-base'
// import { throws } from 'assert';
// import { Connect } from 'aws-amplify-react-native';
// import { graphqlOperation }  from 'aws-amplify';
// import Form from './AddAlbumForm'

// function makeComparator(key, order = 'asc') {
//   return (a, b) => {
//     if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;

//     const aVal = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
//     const bVal = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

//     let comparison = 0;
//     if (aVal > bVal) comparison = 1;
//     if (aVal < bVal) comparison = -1;

//     return order === 'desc' ? (comparison * -1) : comparison
//   };
// }


// const ListAlbums = `query ListAlbums {
//   listAlbums(limit: 9999) {
//       items {
//           id
//           name
//       }
//   }
// }`;

// const SubscribeToNewAlbums = `
//   subscription OnCreateAlbum {
//     onCreateAlbum {
//       id
//       name
//     }
//   }
// `;



// class AlbumsList extends React.Component {
//   albumItems() {
//     return this.props.albums.sort(makeComparator('name')).map(album =>
//                 <ListItem key={album.id}>

//                 {/* <Left>
//                 <Button transparent onPress={(album)=>(console.log(this.setState({selectedAlbum:album})))}>
//                     <Text>View</Text>
//                   </Button>
//                   <Thumbnail square source={{ uri: 'Image URL' }} />
//                 </Left> */}

//                 <Body>
//                   <Text>{album.name}</Text>
//                 </Body>

//                 <Right>
//                   <Button onPress={()=>this.props.deleteAlbum(album)} transparent>
//                     <Text>X</Text>
//                   </Button>
//                 </Right>

//               </ListItem>
   
//     );
//   }

//   render() {
//     return (
//       <Content>
//         <List divided relaxed>
//           {this.albumItems()}
//         </List>
//       </Content>
//     );
//   }
// }


// class AlbumsListLoader extends React.Component {
//   onNewAlbum = (prevQuery, newData) => {
//     let updatedQuery = Object.assign({}, prevQuery);
//     updatedQuery.listAlbums.items = prevQuery.listAlbums.items.concat([newData.onCreateAlbum]);
//     return updatedQuery;
//   }

//   render() {
//     return (
//       <Connect
//         query={graphqlOperation(ListAlbums)}
//         subscription={graphqlOperation(SubscribeToNewAlbums)}
//         onSubscriptionMsg={this.onNewAlbum}
//       >
//         {({ data, loading, errors }) => {
//           if (loading) { return <Text>Loading...</Text>; }
//           if (!data.listAlbums) return;

//           return <AlbumsList albums={data.listAlbums.items} />;
//         }}
//       </Connect>
//     );
//   }
// }

// class NewAlbum extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       albumName: ''
//     };
//   }

//   handleSubmit = async (event) => {
//     event.preventDefault();
//     const NewAlbum = `mutation NewAlbum($name: String!) {
//           createAlbum(input: {name: $name}) {
//               id
//               name
//           }
//       }`;
//     try {
//       const result = await API.graphql(graphqlOperation(NewAlbum, { name: this.state.albumName }));
//       console.info(`Created album with id ${result.data.createAlbum.id}`);
//       this.setState({ albumName: ''});
//     }
//     catch (err) {
//       console.error('NewAlbum mutation failed', err);
//     }
//   }

//   render() {
//     return (
//       <Content>
//         <Button onPress={()=>this.handleSubmit()}><Text>Add a new album</Text></Button>
//         <Item regular >
//               <Input placeholder='Enter New Album Name'onChangeText={(e)=>(this.setState({albumName: e}))} />              
//             </Item>
//       </Content>
//     )
//   }
// }


// export default class SharedListAlbum extends Component {
//   render() {
//     return (
//         <Container>
//           <Header>
//           <Body>
//             <Title>
//               Your Shared Albums
//             </Title>
//           </Body>
//         </Header>
//         {/* <Button full info onPress={()=>this.props.toggleCreateAlbumView()}>
//             <Text>ADD ALBUM</Text>
//           </Button> */}
//           <AlbumsListLoader />
//           <NewAlbum />
//       </Container>
//     );
//   }
// }


// const styles = StyleSheet.create({
//   slideDefault: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#9DD6EB'
//   },
//   slideSwipe: {
//     flex: 1,
//     backgroundColor: '#9DD6EB'
//   },
//   text: {
//     color: 'white',
//     fontSize: 30,
//     fontWeight: 'bold'
//   }
// })