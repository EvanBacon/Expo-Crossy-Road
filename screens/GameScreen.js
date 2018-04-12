import React from 'react';

import Game from '../components/Game';
import Loading from '../components/Loading';

class GameScreen extends React.Component {
  state = {
    loading: true,
  };

  render() {
    return (
      <Loading loading={this.state.loading}>
        <Game
          navigation={this.props.navigation}
          onLoad={() => this.setState({ loading: false })}
        />
      </Loading>
    );
  }
}
export default GameScreen;
