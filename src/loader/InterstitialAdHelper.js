import * THREE from 'three';



import AppStoreInterstitial from './AppStoreInterstitial';
import Game from './Game';
import GameSave from './GameSave';
import GumballMachineScreen from './GumballMachineScreen';
import Interface from './Interface';
import Localisation from './Localisation';
import Storage from './Storage';
import RewardedHelper from './RewardedHelper';

const InterstitialAdHelper = {};
InterstitialAdHelper.adPlaying = false;
InterstitialAdHelper.disable = true;
InterstitialAdHelper.lastPosition = null;

InterstitialAdHelper.init = () => {
    if (InterstitialAdHelper.disable) {
        return;
    }
};

InterstitialAdHelper.triggerAdRequest = function (position) {
    const onFinish = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : () => { };
    if (InterstitialAdHelper.disable) {
        onFinish();
        return;
    }
    Game.takesUserInput = false;
    if (position !== 'preroll') {
        Interface.Pause();
    }
    this.lastPosition = position;
    InterstitialAdHelper.adPlaying = true;
    const isPreroll = this.lastPosition === 'preroll';
    const onAdFinish = function onAdFinish() {
        analytics.track(isPreroll ? 'preroll' : 'midroll', 'completed');
        InterstitialAdHelper.adPlaying = false;
        Game.takesUserInput = true;
        Interface.unPause();
        onFinish();
    };
    PokiSDK.commercialBreak().then(() => {
        onAdFinish();
    }).catch(() => {
        Interface.freeNotificationBars();
        onAdFinish();
    });
};

export default InterstitialAdHelper;