import * THREE from 'three';

import FreeGiftScreen from './FreeGiftScreen'
import GumballMachineScreen from './GumballMachineScreen'
import Interface from './Interface'
import Localisation from './Localisation'
import Storage from './Storage'

import * as Messager from './sendGameDataToPlayground'

const FreeGift = {};
FreeGift.lastGiftTimeKey = 'lastGiftTime';
FreeGift.giftsGivenKey = 'giftsGiven';
FreeGift.timeToGift = [0, 3, 10, 60, 60, 60, 60, 60, 60, 60];
FreeGift.rewards = [100, 35, 50, 20, 25, 80, 60, 20, 40, 50];
FreeGift.shakeNextBar = false;
FreeGift.giftsGiven = null;
FreeGift.lastGiftTime = null;
FreeGift.opportunitiesShowedSinceLastWatched = 0;

FreeGift.getLastGiftTime = function () {
    if (this.lastGiftTime !== null) {
        return this.lastGiftTime;
    }
    const lastGiftTime = Storage.getItem(this.lastGiftTimeKey);
    if (lastGiftTime !== null) {
        this.lastGiftTime = parseInt(lastGiftTime, 10);
    }
    return this.lastGiftTime || 0;
};
FreeGift.getGiftsGiven = function () {
    if (this.giftsGiven !== null) {
        return this.giftsGiven;
    }
    const giftsGiven = Storage.getItem(this.giftsGivenKey);
    if (giftsGiven !== null) {
        this.giftsGiven = parseInt(giftsGiven, 10);
    }
    return this.giftsGiven || 0;
};
FreeGift.getTimeNeededForNextGift = function () {
    const giftsGiven = this.getGiftsGiven();
    const timeToCurrentGift = this.timeToGift[Math.min(giftsGiven, this.timeToGift.length - 1)];
    return msToCurrentGift = timeToCurrentGift * 60 * 1000;
};
FreeGift.getTimeToGift = function () {
    const lastGiftTime = this.getLastGiftTime();
    const msToCurrentGift = this.getTimeNeededForNextGift();
    const timeSpentSinceLastGift = Date.now() - lastGiftTime;
    return msToCurrentGift - timeSpentSinceLastGift;
};
FreeGift.getCurrentReward = function () {
    const giftsGiven = this.getGiftsGiven();
    return this.rewards[Math.min(giftsGiven, this.timeToGift.length - 1)];
};
FreeGift.timeToText = milliseconds => {
    const seconds = parseInt(milliseconds / 1000 % 60);
    let minutes = parseInt(milliseconds / (1000 * 60) % 60);
    let hours = parseInt(milliseconds / (1000 * 60 * 60) % 24);
    minutes = Math.ceil(minutes + seconds / 60);
    if (minutes === 60) {
        hours++;
    }
    let textHours;
    let textMinutes;
    if (hours > 0) {
        textHours = hours;
    }
    if (minutes > 0 && minutes !== 60) {
        textMinutes = minutes;
    }
    let text;
    if (textHours && textMinutes) {
        text = Localisation.GetString('free-gift-in-time');
    } else if (textHours) {
        text = Localisation.GetString('free-gift-in-time-hours');
    } else {
        text = Localisation.GetString('free-gift-in-time-minutes');
        if (!textMinutes) {
            textMinutes = '1';
        }
    }
    return text.trim().replace('XXX', textHours).replace('YYY', textMinutes);
};
FreeGift.areThereAnyGiftsLeft = () => FreeGift.getGiftsGiven() < FreeGift.timeToGift.length;
FreeGift.notificationBar = function () {
    let bar;
    const timeToGift = this.getTimeToGift();
    if (timeToGift <= 0) {
        FreeGift.opportunitiesShowedSinceLastWatched++;
        analytics.track('free_gift', 'notification_shown');
        FreeGift.notificationClickSent = false;
        const text = Localisation.GetString('free-gift');
        bar = Interface.notificationBar(text, 'free-gift', () => {
            if (!FreeGift.notificationClickSent) {
                analytics.track('free_gift', 'notification_click');
            }
            FreeGift.notificationClickSent = true;
            GumballMachineScreen.opportunitiesShowedSinceLastWatched = 0;
            FreeGiftScreen.show();
        });
        bar.shakeMe = FreeGift.shakeNextBar;
    } else {
        bar = Interface.notificationBar(FreeGift.timeToText(timeToGift), 'free-gift');
    }
    this.currentBar = bar;
};
FreeGift.transformFreeGiftBarToTimeBar = function () {
    if (this.areThereAnyGiftsLeft()) {
        Interface.slideNewText(this.currentBar, FreeGift.timeToText(this.getTimeToGift()));
    } else {
        this.currentBar.background.visible = false;
    }
};
FreeGift.giftWasAwarded = function () {
    if (!this.giftsGiven) {
        analytics.track('game_onboarding', 'first_gift_given');
    }
    this.giftsGiven += 1;
    analytics.track('free_gift', 'opened', this.giftsGiven, this.giftsGiven);
    this.lastGiftTime = Date.now();
    Storage.setItem(this.lastGiftTimeKey, this.lastGiftTime);
    Storage.setItem(this.giftsGivenKey, this.giftsGiven);
    Messager.sendGameDataToPlayground();
};
export default FreeGift;