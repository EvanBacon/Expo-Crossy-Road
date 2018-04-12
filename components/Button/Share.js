import Expo from 'expo';
import React from 'react';
import { Share } from 'react-native';
import { connect } from 'react-redux';

import storeUrl from '../../utils/storeUrl';
import Icon from './Icon';

class ShareButton extends React.Component {
  onPress = async () => {
    const { score, screenshot: url } = this.props;
    // const url = await AssetUtils.uriAsync(image);
    const appName = Expo.Constants.manifest.name;
    const title = `${appName}`;
    const message = `OMG! I got ${score} points in @baconbrix ${appName}. ${storeUrl() ||
      ''}`;
    Share.share(
      {
        message,
        title,
        url,
      },
      {
        tintColor: Expo.Constants.manifest.tintColor,
        excludedActivityTypes: [
          'com.apple.UIKit.activity.Print',
          'com.apple.UIKit.activity.AssignToContact',
          'com.apple.UIKit.activity.AddToReadingList',
          'com.apple.UIKit.activity.AirDrop',
          'com.apple.UIKit.activity.OpenInIBooks',
          'com.apple.UIKit.activity.MarkupAsPDF',
          'com.apple.reminders.RemindersEditorExtension', //Reminders
          'com.apple.mobilenotes.SharingExtension', // Notes
          'com.apple.mobileslideshow.StreamShareService', // iCloud Photo Sharing - This also does nothing :{
        ],
      },
    );
    this.props.onPress && this.props.onPress();
  };

  render() {
    const { onPress, screenshot, name, ...props } = this.props;
    if (!screenshot) {
      return null;
    }
    return <Icon onPress={this.onPress} name="share" {...props} />;
  }
}

export default connect(({ score: { last: score }, screenshot }) => ({
  score,
  screenshot,
}))(ShareButton);
