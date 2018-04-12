import Expo from 'expo';
import React, { Component } from 'react';
import { Animated, Dimensions, FlatList } from 'react-native';

import Fire from '../../Fire';
import Footer from './Footer';
import Item from './Item';

const { width } = Dimensions.get('window');
const itemHeight = 64;
const gutter = 4;
const totalGutter = gutter * 2;
const itemSize = itemHeight + totalGutter;
const PAGE_SIZE = 5;
const DEBUG = false;

class App extends Component {
  items = [];
  lastKnownKey = null;
  _scrollValue = 0;

  constructor(props) {
    super(props);

    this.scrollValue = new Animated.Value(0);
    this.scrollValue.addListener(({ value }) => (this._scrollValue = value));

    this.onScroll = Animated.event(
      [{ nativeEvent: { contentOffset: { x: this.scrollValue } } }],
      {
        useNativeDriver: false,
      },
    );

    this.state = {
      loading: false,
      data: {},
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
    };
  }

  addChild = item => {
    this.setState(previousState => ({
      data: {
        ...previousState.data,
        [item.key]: item,
      },
    }));
  };

  makeRemoteRequest = async () => {
    if (DEBUG) {
      return;
    }

    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });
    const { data, cursor } = await Fire.shared.getPagedScore({
      size: PAGE_SIZE,
      start: this.lastKnownKey,
    });

    this.lastKnownKey = cursor;

    for (let child of data) {
      this.addChild(child);
    }
    this.setState({ loading: false });
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true,
      },
      () => {
        this.makeRemoteRequest();
      },
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.makeRemoteRequest();
      },
    );
  };

  getCurrentIndex = () => Math.round(this._scrollValue / itemSize);

  renderItem = ({ item, index }) => (
    <Item
      index={index + 1}
      title={item.uid === Fire.shared.uid ? 'Me' : item.title}
      gutter={gutter}
      subtitle={item.score}
      backgroundColor={item.uid === Fire.shared.uid ? '#F4E1DB' : '#ffffff'}
      itemHeight={itemHeight}
      score={item.score}
    />
  );

  getItemLayout = (data, index) => ({
    length: itemSize,
    offset: itemSize * index,
    index,
  });

  render() {
    const data = Object.keys(this.state.data).map(key => this.state.data[key]);
    return (
      <FlatList
        onScroll={this.onScroll}
        ref={ref => (this.list = ref)}
        keyExtractor={(item, index) => index}
        data={data}
        getItemLayout={this.getItemLayout}
        renderItem={this.renderItem}
        ListFooterComponent={
          <Footer hasMore={true} isLoading={this.state.loading} />
        }
        ListHeaderComponent={this.renderHeader}
        onRefresh={this.handleRefresh}
        refreshing={this.state.refreshing}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={10}
      />
    );
  }
}

export default App;
