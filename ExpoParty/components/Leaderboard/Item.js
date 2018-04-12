import React from 'react';
import PropTypes from 'prop-types'; // 15.6.0
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Dimensions,
} from 'react-native';

const { height } = Dimensions.get('window');
class ListItem extends React.Component {
  render() {
    const {
      index,
      title,
      subtitle,
      backgroundColor,
      gutter,
      itemHeight,
    } = this.props;

    return (
      <View
        style={{
          marginVertical: gutter,
          height: itemHeight,
          maxHeight: itemHeight,
          flex: 1,
          marginHorizontal: gutter * 2,
          alignItems: 'stretch',
        }}
      >
        <View style={[styles.container, { backgroundColor, flex: 1 }]}>
          <View style={{ flexDirection: 'row' }}>
            {index && (
              <Text
                style={[styles.title, { fontWeight: 'bold', marginRight: 12 }]}
              >
                #{index}
              </Text>
            )}
            <Text style={[styles.title, { fontWeight: 'bold' }]}>{title}</Text>
          </View>
          <Text style={styles.title}>{subtitle} Points</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    borderRadius: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    flexDirection: 'row',
  },
  title: {
    opacity: 0.9,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});

export default ListItem;
