import AppStoreInterstitial from './AppStoreInterstitial';
import Game from './Game';
import GameSave from './GameSave';
import GumballMachineScreen from './GumballMachineScreen';
import Interface from './Interface';
import Localisation from './Localisation';
import Storage from './Storage';

const RewardedHelper = {};
RewardedHelper.coinReward = 20;
RewardedHelper.opportunitiesShowedSinceLastWatched = 0;
RewardedHelper.shakeNextBar = false;
RewardedHelper.videosWatchedKey = 'videosWatched';
RewardedHelper.videosWatched = null;
RewardedHelper.disable = true;
RewardedHelper.init = () => {
    RewardedHelper.coins = [];
};
RewardedHelper.getVideosWatched = function () {
    if (this.videosWatched !== null) {
        return this.videosWatched;
    }
    const videosWatched = Storage.getItem(this.videosWatchedKey);
    if (videosWatched !== null) {
        this.videosWatched = parseInt(videosWatched, 10);
    }
    return this.videosWatched || 0;
};
RewardedHelper.getAdsWatched = () => parseInt(Storage.getItem('ads_watched'), 10) || 0;
RewardedHelper.triggerAdRequest = () => {
    if (RewardedHelper.disable || window.adBlocked) {
        return;
    }
    const onAdFinish = function onAdFinish() {
        RewardedHelper.adPlaying = false;
        Interface.unPause();
        Game.takesUserInput = true;
    };
    PokiSDK.rewardedBreak().then(withReward => {
        onAdFinish();
        if (withReward) {
            analytics.track('rewarded_video', 'finished', RewardedHelper.getAdsWatched(), RewardedHelper.getAdsWatched());
            RewardedHelper.awardReward();
        }
    }).catch(() => {
        onAdFinish();
    });
};
RewardedHelper.showingAd = false;
RewardedHelper.newRoundStarted = () => {
    RewardedHelper.showingAd = false;
};
let rewardedBar = null;
RewardedHelper.adPlaying = false;
RewardedHelper.showRewardedOpportunity = () => {
    if (RewardedHelper.disable) {
        return;
    }
    if (window.adBlocked) {
        return;
    }
    if (RewardedHelper.showingAd) {
        return;
    }
    if (Interface.CurrentScreen !== "death" || AppStoreInterstitial.isVisible()) {
        return;
    }
    RewardedHelper.opportunitiesShowedSinceLastWatched++;
    RewardedHelper.showingAd = true;
    analytics.track('rewarded_video', 'notification_shown');
    const text = Localisation.GetString('earn-coins');
    rewardedBar = Interface.notificationBar(text, 'rewarded', () => {
        analytics.track('rewarded_video', 'notification_click');
        RewardedHelper.opportunitiesShowedSinceLastWatched = 0;
        Game.takesUserInput = false;
        RewardedHelper.adPlaying = true;
        Interface.Pause();
        Game.audioManager.SetVolume(0);
        Storage.setItem('ads_watched', RewardedHelper.getAdsWatched() + 1);
        RewardedHelper.triggerAdRequest();
    });
    rewardedBar.shakeMe = RewardedHelper.shakeNextBar;
    if (!Interface.playButton._visible || Interface.playButton.y < 0 && Interface.activeNotificationBars.length === 1) {
        Interface.focusFirstNotificationBar();
    }
    Interface.setupEndScreenKeyboardNavigation();
};
RewardedHelper.awardReward = () => {
    if (Interface.isSound) {
        Game.audioManager.SetVolume(.8);
    }
    Storage.setItem(RewardedHelper.videosWatchedKey, ++RewardedHelper.videosWatched);
    const text = Localisation.GetString('coins-earned').replace('XXX', RewardedHelper.coinReward);
    Interface.slideNewText(rewardedBar, text);
    GameSave.ModifyCoins(RewardedHelper.coinReward);
    Interface.coinBlast(RewardedHelper.coinReward);
    Interface.coinsWereModified();
    GumballMachineScreen.showNotificationBar(true);
    Interface.setupEndScreenKeyboardNavigation();
    Interface.focusFirstNotificationBar();
    Interface.removeTutorialLock();
    Game.takesUserInput = true;
};
export default RewardedHelper;