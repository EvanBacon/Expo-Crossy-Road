import { AppState, Linking } from 'react-native';

function followUsOn(urls, minimumElapsedSeconds = 5) {
  return new Promise((res, rej) => {
    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active') {
        console.log('App has come to the foreground!'); // eslint-disable-line no-console

        /*
        The user has returned from twitter
      */
        AppState.removeEventListener('change', handleAppStateChange);

        const elapsedSeconds =
          Math.abs(this.timestamp.getTime(), new Date().getTime()) / 1000;
        if (elapsedSeconds > minimumElapsedSeconds) {
          res(true);
        } else {
          rej(
            'User returned in under ' +
              minimumElapsedSeconds +
              ' seconds, trust no one',
          );
        }
      } else if (nextAppState === 'inactive') {
        console.log('App has left foreground :/'); // eslint-disable-line no-console
        /*
        Once the app redirects we start the clock! 
        The user must be outside the app for minimumElapsedSeconds (5) after invoking this function.
      */
        this.timestamp = new Date();
      }
    };

    let didAnyWork = false; 
    for (let url of urls) {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
          didAnyWork = true;
          AppState.addEventListener('change', handleAppStateChange);
          Linking.openURL(url);
          break;
      } else {
        console.log("Can't handle url: " + url);
      }
    }
    if (!didAnyWork) {
      rej("User does not have twitter, or it's blocked");
    }
    
  });
}

export default followUsOn;


/*

** Twitter **

const username = "baconbrix";
const urls = [
`twitter:///user?screen_name=${username}`,
`tweetie:///user?screen_name=${username}`,
`http://twitter.com/${username}`,
]
try {
  const didFollow = await followUsOn(urls);
  if (didFollow) {
    /// Do something
  }
} catch (error) {
  console.log(error)
}

** Facebook **

const fbid = "1795328841";
const urls = [
`fb://profile/${fbid}`,
`https://www.facebook.com/${fbid}`,
]
try {
  const didFollow = await followUsOn(urls);
  if (didFollow) {
    /// Do something
  }
} catch (error) {
  console.log(error)
}

*/

