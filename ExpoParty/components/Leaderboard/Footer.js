import React from 'react';
import PropTypes from 'prop-types'; // 15.6.0
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';

class Footer extends React.Component {
  static propTypes = {
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
  };

  static defaultProps = {
    hasMore: false,
    isLoading: false,
  };

  render() {
    const { hasMore, isLoading } = this.props;
    const title = hasMore ? 'Loading more...' : 'No Mas!';

    return (
      <View style={styles.container}>
        <ActivityIndicator animating={isLoading} />
        {false && <Text style={styles.title}>{title}</Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    flexDirection: 'row',
  },
  title: {
    opacity: 0.7,
    marginLeft: 8,
  },
});

export default Footer;
