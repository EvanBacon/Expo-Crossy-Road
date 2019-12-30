import Carousel from './Carousel';
import FreeGift from './FreeGift';
import Game from './Game';
import GameSave from './GameSave';
import GumballMachineScreen from './GumballMachineScreen';
import Interface from './Interface';
import RewardedHelper from './RewardedHelper';

MetaHelper = {};

MetaHelper.features = [{
    key: 'rewarded',
    check: function check(round) {
        RewardedHelper.shakeNextBar = false;
        if (window.adBlocked) {
            return false;
        }
        if (Carousel.HowManyUnlocked().number <= 1) {
            return false;
        }
        if (round < 2) {
            return false;
        }
        if (!this.gotThroughChecksFirstAtRound) {
            this.gotThroughChecksFirstAtRound = round;
        }
        if (RewardedHelper.opportunitiesShowedSinceLastWatched >= 3) {
            if (!this.stickyTimes || this.stickyTimes < 2) {
                this.stickyTimes = (this.stickyTimes || 0) + 1;
                RewardedHelper.shakeNextBar = true;
                return true;
            } else {
                this.stickyTimes = 0;
                RewardedHelper.opportunitiesShowedSinceLastWatched = 0;
            }
        }
        const roundDelta = 3;
        if ((round - this.gotThroughChecksFirstAtRound) % roundDelta !== 0) {
            return false;
        }
        this.overridesAllOtherFeatures = false;
        return true;
    }
}, {
    key: 'free-gift',
    check: function check(round) {
        FreeGift.shakeNextBar = false;
        if (!FreeGift.areThereAnyGiftsLeft()) {
            return false;
        }
        if (FreeGift.opportunitiesShowedSinceLastWatched >= 3) {
            if (!this.stickyTimes || this.stickyTimes < 2) {
                this.stickyTimes = (this.stickyTimes || 0) + 1;
                FreeGift.shakeNextBar = true;
                return true;
            } else {
                this.stickyTimes = 0;
                FreeGift.opportunitiesShowedSinceLastWatched = 0;
            }
        }
        if (FreeGift.getGiftsGiven() === 0) {
            Interface.lockForTutorial();
            return true;
        }
        if (Carousel.HowManyUnlocked().number === 1 || FreeGift.getGiftsGiven() < 2) {
            if (round % 2 === 0) {
                return true;
            }
            return false;
        }
        if (round < 3) {
            return false;
        }
        if (!this.gotThroughChecksFirstAtRound) {
            this.gotThroughChecksFirstAtRound = round;
        }
        let roundDelta;
        if (Carousel.hasEnoughCoinsForCharacter()) {
            roundDelta = 2;
        } else {
            roundDelta = 5;
        }
        if ((round - this.gotThroughChecksFirstAtRound) % roundDelta !== 0) {
            return false;
        }
        return true;
    }
}, {
    key: 'unlock-new',
    check: function check(round) {
        GumballMachineScreen.shakeNextBar = false;
        if (!Carousel.hasEnoughCoinsForCharacter()) {
            return false;
        }
        if (Carousel.HowManyUnlocked().all) {
            return false;
        }
        if (GumballMachineScreen.opportunitiesShowedSinceLastWatched >= 3) {
            if (!this.stickyTimes || this.stickyTimes < 2) {
                this.stickyTimes = (this.stickyTimes || 0) + 1;
                GumballMachineScreen.shakeNextBar = true;
                return true;
            } else {
                this.stickyTimes = 0;
                GumballMachineScreen.opportunitiesShowedSinceLastWatched = 0;
            }
        }
        if (FreeGift.getGiftsGiven() === 0) {
            return false;
        }
        if (Carousel.HowManyUnlocked().number === 1 || FreeGift.getGiftsGiven() < 2) {
            if (Carousel.HowManyUnlocked().number === 1) {
                Interface.lockForTutorial();
            }
            return true;
        }
        if (round < 3) {
            return false;
        }
        if (!this.gotThroughChecksFirstAtRound) {
            this.gotThroughChecksFirstAtRound = round;
        }
        const roundDelta = 2;
        if ((round - this.gotThroughChecksFirstAtRound) % roundDelta !== 0) {
            return false;
        }
        return true;
    }
}, {
    key: 'coins-to-go',
    check: function check(round) {
        if (Carousel.HowManyUnlocked().number === 1) {
            return false;
        }
        if (!this.gotThroughChecksFirstAtRound) {
            this.gotThroughChecksFirstAtRound = round;
        }
        if (round < 3) {
            return false;
        }
        const coins = GameSave.GetCoins();
        if (Carousel.hasEnoughCoinsForCharacter()) {
            return false;
        }
        if (coins < 10) {
            return false;
        }
        const roundDelta = 5;
        if ((round - this.gotThroughChecksFirstAtRound) % roundDelta !== 0) {
            return false;
        }
        return true;
    }
}, {
    key: 'upsell-notification',
    overridesAllOtherFeatures: true,
    check: function check() {
        const amountUnlocked = Carousel.HowManyUnlocked().number;
        if (amountUnlocked === 3 && Game.deathsSinceLastCharacterUnlock === 3) {
            return true;
        }
        if (amountUnlocked === 4 && Game.deathsSinceLastCharacterUnlock === 3) {
            return true;
        }
        if (amountUnlocked === 4 && Game.deathsSinceLastCharacterUnlock === 5 && !Interface.upsellWasClicked) {
            return true;
        }
        if (amountUnlocked === 5 && Game.deathsSinceLastCharacterUnlock === 2) {
            return true;
        }
        return false;
    }
}];
MetaHelper.getFeaturesByRound = round => {
    let features = [];
    let noMoreFeatures = false;
    MetaHelper.features.forEach(feature => {
        if (noMoreFeatures) {
            return;
        }
        if (feature.check(round)) {
            const result = {
                key: feature.key
            };
            if (feature.overridesAllOtherFeatures) {
                noMoreFeatures = true;
                features = [result];
            } else {
                features.push(result);
            }
        }
    });
    if (Interface.tutorialWasLockedLastRound && features.length === 0) {
        features.push({
            key: 'free-gift'
        });
    }
    return features;
};
export default MetaHelper;