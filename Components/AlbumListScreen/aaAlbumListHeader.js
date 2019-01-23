import React, { Component } from 'react'
import {Header, Body, Title} from 'native-base';


export default class AlbumListHeader extends Component {
  render() {
    return (
        <Header>
            <Body>
                <Title>
                    Private Albums
                </Title>
            </Body>
        </Header>
    )
  }
}

