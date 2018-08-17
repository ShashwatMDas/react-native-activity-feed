import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';

import { buildStylesheet } from '../styles';

import { UserBar, Card } from 'react-native-activity-feed';

export default class BaseActivity extends React.Component {
  _onPress = () => {
    if (this.props.clickable) {
      this.props.navigation.navigate('SinglePost', {
        activity: this.props.activity,
        userId: this.props.userId,
        feedGroup: this.props.feedGroup,
      });
    }
  };

  _onPressAvatar = () => {
    if (this.props.activity.actor !== 'NotFound') {
      return;
    }
    // TODO: go to profile
  };

  renderHeader = () => {
    let { time, actor } = this.props.activity;
    let notFound = {
      id: '!not-found',
      created_at: '',
      updated_at: '',
      data: { name: 'Unknown' },
    };
    if (actor === 'NotFound') {
      actor = notFound;
    }
    return (
      <View style={{ padding: 15 }}>
        <UserBar
          username={actor.data.name}
          avatar={actor.data.profileImage}
          subtitle={this.props.sub}
          timestamp={time}
          icon={this.props.icon}
          onPressAvatar={this._onPressAvatar}
        />
      </View>
    );
  };

  renderContent = () => {
    const { width } = Dimensions.get('window');
    let { verb, object, content, image, attachments } = this.props.activity;
    return (
      <View>
        <View style={{ paddingBottom: 15, paddingLeft: 15, paddingRight: 15 }}>
          <Text>{typeof object === 'string' ? object : content}</Text>
        </View>

        {verb == 'repost' &&
          object instanceof Object && (
            <View style={{ paddingLeft: 15, paddingRight: 15 }}>
              <Card item={object.data} />
            </View>
          )}

        {image && (
          <Image
            style={{ width: width, height: width }}
            source={{ uri: image }}
          />
        )}

        {attachments &&
          attachments.images &&
          Boolean(attachments.images.length) && (
            <Image
              style={{ width: width, height: width }}
              source={{ uri: attachments.images[0] }}
            />
          )}

        {attachments &&
          attachments.og && (
            <Card
              item={{
                title: attachments.og.title,
                description: attachments.og.description,
                image: attachments.og.images[0].image,
                url: attachments.og.url,
              }}
            />
          )}
      </View>
    );
  };

  renderFooter = () => {
    return null;
  };

  render() {
    let { Header, Content, Footer } = this.props;

    let styles = buildStylesheet('defaultActivity', this.props.styles);

    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={this._onPress}
        disabled={!this.props.clickable}
      >
        {smartRender(Header, this.renderHeader)}
        {smartRender(Content, this.renderContent)}
        {smartRender(Footer, this.renderFooter)}
      </TouchableOpacity>
    );
  }
}

function smartRender(MaybeElement, fallback) {
  if (MaybeElement !== undefined) {
    if (!MaybeElement) {
      return null;
    }
    return React.isValidElement(MaybeElement) ? MaybeElement : <MaybeElement />;
  }
  return fallback && fallback();
}
