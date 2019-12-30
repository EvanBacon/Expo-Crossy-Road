import * THREE from 'three';

import ThreeUI from './ThreeUI';
import AppStoreInterstitial from './AppStoreInterstitial';
import Carousel from './Carousel';
import CharacterTryouts from './CharacterTryouts';
import Game from './Game';
import GameSave from './GameSave';
import InputControls from './InputControls';
import InterstitialAdHelper from './InterstitialAdHelper';
import KeyboardHint from './KeyboardHint';
import KeyboardUIControls from './KeyboardUIControls';
import RewardedHelper from './RewardedHelper';
import Storage from './Storage';
import Utils from './Utils';
import GumballMachineScreen from './GumballMachineScreen';

function slideIn(bar, skipDelay) {
    const idx = Interface.activeNotificationBars.length - 1;
    const dimensions = getNotificationBarContentDimensions();
    let baseDelay = 500 * idx;
    const contentDelay = 150;
    if (skipDelay) {
        baseDelay = 0;
    }
    if (Interface.tutorialLock) {
        baseDelay += 250;
    }
    bar.contentAnimator.x = -bar.background.width;
    const buttonStartDimensions = [bar.button.width, bar.button.height];
    const buttonTargetDimensions = buttonStartDimensions.map(value => value * 1.4);
    const scaleUpAnimationTime = 500;
    const targetHeight = bar.background.height;
    bar.background.height = 0;
    bar.background.visible = true;
    new TWEEN.Tween(bar.background).to({
        height: targetHeight
    }, 300).delay(baseDelay).easing(TWEEN.Easing.Exponential.InOut).start();
    new TWEEN.Tween(bar.contentAnimator).to({
        x: 0
    }, 500).delay(contentDelay + baseDelay).easing(TWEEN.Easing.Sinusoidal.InOut).onComplete(() => {
        new TWEEN.Tween(bar.button).to({
            width: buttonTargetDimensions[0],
            height: buttonTargetDimensions[1]
        }, 100).onComplete(() => {
            Game.playSfx('bannerhit3-g');
            new TWEEN.Tween(bar.button).to({
                width: buttonStartDimensions[0],
                height: buttonStartDimensions[1]
            }, 400).easing(TWEEN.Easing.Quartic.Out).start();
        }).start();
        if (bar.button2._visible) {
            new TWEEN.Tween(bar.button2).to({
                width: buttonTargetDimensions[0],
                height: buttonTargetDimensions[1]
            }, 100).delay(250).easing(TWEEN.Easing.Quartic.Out).onComplete(() => {
                Game.playSfx('bannerhit3-g');
                new TWEEN.Tween(bar.button2).to({
                    width: buttonStartDimensions[0],
                    height: buttonStartDimensions[1]
                }, 400).easing(TWEEN.Easing.Quartic.Out).start();
            }).start();
        }
        if (bar.button3._visible) {
            new TWEEN.Tween(bar.button3).to({
                width: buttonTargetDimensions[0],
                height: buttonTargetDimensions[1]
            }, 100).delay(500).easing(TWEEN.Easing.Quartic.Out).onComplete(() => {
                Game.playSfx('bannerhit3-g');
                new TWEEN.Tween(bar.button3).to({
                    width: buttonStartDimensions[0],
                    height: buttonStartDimensions[1]
                }, 400).easing(TWEEN.Easing.Quartic.Out).start();
            }).start();
        }
    }).start();
}

function doUnmute() {
    Interface.isSound = true;
    Storage.setItem('isSound', 'true');
    Game.audioManager.SetVolume(.8);
    setMuteButton();
}

function setMuteButton() {
    if (Interface.isSound) {
        mute.setAssetPath('mute-off.png');
        mute.blinkSprite = 'mute-off-blink.png';
    } else {
        mute.setAssetPath('mute.png');
        mute.blinkSprite = 'mute-blink.png';
    }
    mute.defaultSprite = mute.assetPath;
}

function playHint() {
    if (isMobile) {
        finger.visible = true;
    } else {
        arrowHint.width = btnWidth;
        arrowHint.visible = true;
    }
    const position = {
        x: -75,
        y: -200
    };
    const target = {
        x: 75,
        y: -200
    };
    fingerTween = new TWEEN.Tween(position).to(target, 600);
    fingerTween.easing(TWEEN.Easing.Sinusoidal.In);
    fingerTween.onUpdate(() => {
        finger.x = position.x;
        finger.y = position.y;
    });
    fingerTween.onComplete(() => {
        finger.visible = false;
    });
    fingerTween.start();
    finger.x = position.x;
    finger.y = position.y;
    const right = {
        x: -75
    };
    const rightEnd = {
        x: 75
    };
    let lineRightTween = new TWEEN.Tween(right).to(rightEnd, 600).onStart(() => {
        if (isMobile) {
            hintLine.visible = true;
        }
    }).easing(TWEEN.Easing.Sinusoidal.In).onUpdate(() => {
        hintLine.offset.left = right.x;
    });
    lineRightTween.start();
    hintLine.offset.left = right.x;
    const left = {
        x: 75
    };
    const leftEnd = {
        x: -75
    };
    let lineLeftTween = new TWEEN.Tween(left).to(leftEnd, 475).easing(TWEEN.Easing.Sinusoidal.In).onUpdate(() => {
        hintLine.offset.right = left.x;
    }).delay(300);
    var btnWidth = 28.0 * hintScaleFactor;
    const heightToWidthRatio = 18.0 / 26.0;
    const size = {
        width: btnWidth
    };
    const arrowLeftTweenUp = new TWEEN.Tween(size).to({
        width: btnWidth * 1.5
    }, 200).easing(TWEEN.Easing.Sinusoidal.In).onUpdate(() => {
        arrowHint.width = size.width;
        arrowHint.height = size.width * heightToWidthRatio;
    });
    const arrowLeftTweenDown = new TWEEN.Tween(size).to({
        width: btnWidth
    }, 200).delay(200).easing(TWEEN.Easing.Sinusoidal.Out).onUpdate(() => {
        arrowHint.width = size.width;
        arrowHint.height = size.width * heightToWidthRatio;
    });
    arrowLeftTweenUp.chain(arrowLeftTweenDown);
    arrowLeftTweenUp.start();
    arrowHint.setAssetPath("keyboard-full.png");
    window.setTimeout(() => {
        if (isMainMenu()) {
            arrowHint.setAssetPath("keyboard-up.png");
        } else {
            arrowHint.setAssetPath("keyboard-left.png");
        }
    }, 200);
    window.setTimeout(() => {
        arrowHint.setAssetPath("keyboard-full.png");
        size.width = btnWidth;
        const arrowRightTweenUp = new TWEEN.Tween(size).to({
            width: btnWidth * 1.5
        }, 200).delay(200).easing(TWEEN.Easing.Sinusoidal.In).onUpdate(() => {
            arrowHint.width = size.width;
            arrowHint.height = size.width * heightToWidthRatio;
        });
        const arrowRightTweenDown = new TWEEN.Tween(size).to({
            width: btnWidth
        }, 200).delay(200).easing(TWEEN.Easing.Sinusoidal.Out).onUpdate(() => {
            arrowHint.width = size.width;
            arrowHint.height = size.width * heightToWidthRatio;
        });
        arrowRightTweenUp.chain(arrowRightTweenDown);
        arrowRightTweenUp.start();
        window.setTimeout(() => {
            if (isMainMenu()) {
                arrowHint.setAssetPath("keyboard-up.png");
            } else {
                arrowHint.setAssetPath("keyboard-right.png");
            }
            window.setTimeout(() => {
                arrowHint.setAssetPath("keyboard-full.png");
            }, 300);
        }, 200 + 200);
    }, 500);
    lineLeftTween.onComplete(() => {
        hintLine.visible = false;
        lineLeftTween = null;
        lineRightTween = null;
        window.setTimeout(() => {
            fingerTween = null;
            if (playingHint) {
                playHint();
            } else {
                size.width = btnWidth;
                const arrowGoneTween = new TWEEN.Tween(size).to({
                    width: 0
                }, 100).easing(TWEEN.Easing.Sinusoidal.Out).onUpdate(() => {
                    arrowHint.width = size.width;
                    arrowHint.height = size.width * heightToWidthRatio;
                }).onComplete(() => {
                    arrowHint.visible = false;
                });
                arrowGoneTween.start();
            }
        }, 700);
    });
    lineLeftTween.start();
    hintLine.offset.right = left.x;
}

class Interface {
    static playButtonCallback(...args) {
        const _this = this;
        const autoWalk = args.length > 0 && args[0] !== undefined ? args[0] : true;
        KeyboardHint.cancelReappearTimeout();
        this.ButtonSound();
        KeyboardHint.hide();
        AppStoreInterstitial.hide();
        switch (this.CurrentScreen) {
            case "main":
                Interface.pauseBtn.visible = true;
                Interface.characterSelect.visible = false;
                Interface.showMore.visible = false;
                mute.visible = false;
                Interface.showUpsell.visible = false;
                Interface.topScore.visible = false;
                scoreText.visible = true;
                Interface.coinText.visible = true;
                Interface.coinIcon.visible = true;
                Interface.moveToPlay.visible = false;
                Interface.moveToPlayHitzone1.visible = false;
                Interface.moveToPlayHitzone2.visible = false;
                this.HidePlay();
                this.hideLogo();
                this.CloseShowMore();
                Game.playing = true;
                Game.takesUserInput = true;
                analytics.track('game_play', 'round_started', Game.playerController.roundIdx, Game.playerController.roundIdx);
                PokiSDK.gameplayStart();
                PokiSDK.roundStart(Game.currentWorld === 'original_cast' ? 'original' : Game.currentWorld);
                if (!window.gameStartTracked) {
                    window.gameStartTracked = true;
                    analytics.track('game_onboarding', 'game_start');
                    window.setTimeout(() => {
                        analytics.track('heartbeat', '30sec');
                    }, 1000 * 30);
                    window.setTimeout(() => {
                        analytics.track('heartbeat', '2min');
                    }, 1000 * 60 * 2);
                    window.setTimeout(() => {
                        analytics.track('heartbeat', '6min');
                    }, 1000 * 60 * 6);
                    window.setTimeout(() => {
                        analytics.track('heartbeat', '10min');
                    }, 1000 * 60 * 10);
                }
                if (Storage.getItem('first_round_finished') && !Storage.getItem('second_round_started')) {
                    analytics.track('game_onboarding', 'second_round_started');
                    Storage.setItem('second_round_started', true);
                }
                if (autoWalk) {
                    InputControls.forward(true);
                }
                KeyboardHint.switch('full-movement-hint');
                KeyboardHint.triggerReappearTimeout(4000);
                break;
            case "selectingCharacter":
                Carousel.SelectCharacter();
                break;
            case "death":
                const restart = function restart() {
                    _this.tutorialWasLockedLastRound = _this.tutorialLock;
                    Game.wipeAndRestart();
                };
                if (!window.adBlocked && !InterstitialAdHelper.disable && Game.playerController.roundIdx >= 3) {
                    this.HidePlay();
                    InterstitialAdHelper.triggerAdRequest('midroll', restart);
                } else {
                    restart();
                }
                break;
        }
        this.tutorialLock = false;
    }

    static ToggleMute() {
        this.ButtonSound();
        if (Interface.isSound) {
            this.doMute();
        } else {
            doUnmute();
        }
    }

    static lockForTutorial() {
        this.tutorialLock = true;
    }

    static removeTutorialLock() {
        if (!this.tutorialLock) {
            return;
        }
        this.unfadeFromBlueTween.start();
        this.ShowPlay(200);
    }

    static handleDeathUI() {
        if (this.deathUIShown) {
            return;
        }
        this.deathUIShown = true;
        if (this.tutorialLock) {
            fadeToBlueTween.start();
            Interface.focusFirstNotificationBar();
            KeyboardHint.show('death-onboarding');
            return;
        }
        let btnDelay = 500;
        const tutorialLock = false;
        for (let idx = 0; idx < Interface.activeNotificationBars.length; idx++) {
            const bar = Interface.activeNotificationBars[idx];
            if (bar.shakeMe) {
                btnDelay = Math.max(2000, btnDelay);
            } else if (bar.type === 'upsell-notification') {
                btnDelay = Math.max(1000, btnDelay);
            } else {
                btnDelay = Math.max(500 + 500 * Interface.activeNotificationBars.length, btnDelay);
            }
        }
        if (AppStoreInterstitial.isVisible()) {
            btnDelay = Math.max(1000, btnDelay);
        }
        this.playButton.navigateOnLeft = null;
        this.playButton.navigateOnRight = null;
        Interface.ShowPlay(btnDelay);
        Interface.focusFirstNotificationBar();
    }

    static UpdateUI(deltaTime) {
        if (Interface.CurrentScreen === 'death') {
            if (!Game.playerController.waitingForEagle) {
                if (Game.playerController.eagleCountdown > 0) {
                    Game.playerController.eagleCountdown -= deltaTime;
                } else {
                    this.handleDeathUI();
                }
            }
        } else {
            Interface.deathUIShown = false;
        }
        Interface.coinText.setText(GameSave.GetCoins());
        if (Game.score > 0) {
            scoreText.setText(Math.round(Game.score));
            let ts = 0;
            if ((ts = Storage.getItem('crossyScore')) != null) {
                if (ts > 0) {
                    Interface.topScore.setText(`TOP ${Math.round(ts).toString()}`);
                } else {
                    Interface.topScore.setText("");
                }
            }
        } else {
            scoreText.setText("");
            Interface.topScore.setText("");
        }
        let timeForTapBlink;
        if (Interface.moveToPlay.assetPath === 'tap1.png' || Interface.moveToPlay.assetPath === 'keyboard-full.png') {
            timeForTapBlink = 0.333;
        } else {
            timeForTapBlink = 0.25;
        }
        if (timeSinceLastTapBlink >= timeForTapBlink) {
            if (Interface.moveToPlay.assetPath === 'tap1.png') {
                Interface.moveToPlay.setAssetPath('tap2.png');
                Interface.moveToPlay.y = 26;
            } else if (Interface.moveToPlay.assetPath === 'tap2.png') {
                Interface.moveToPlay.setAssetPath('tap1.png');
                Interface.moveToPlay.y = 20;
            }
            timeSinceLastTapBlink = 0;
        } else {
            timeSinceLastTapBlink += deltaTime;
        }
        if (Interface.CurrentScreen === 'main' && Game.playing && !finger.visible && !arrowHint.visible && !hintLine.visible && !KeyboardHint.isVisible()) {
            Game.UI.clearRect = {
                x: 0,
                y: 0,
                width: Game.UI.width,
                height: 100
            };
        } else {
            Game.UI.clearRect = null;
        }
        for (let idx = 0; idx < Interface.activeNotificationBars.length; idx++) {
            const bar = Interface.activeNotificationBars[idx];
            if (bar.shakeMe) {
                const timer = Game.frameCount / 30;
                const shakeAmount = Math.abs(Math.max(-1, Math.sin(timer) * 2));
                bar.background.y = bar.background.startY + Utils.getRandomArbitrary(-shakeAmount, shakeAmount);
            } else {
                bar.background.y = bar.background.startY;
            }
        }
    }

    static Init() {
        Interface.buttonParent = Game.UI.createRectangle('rgba(0,0,0,0)');
        Interface.buttonParent.stretch.x = true;
        Interface.buttonParent.stretch.y = true;
        Interface.buttonParent.anchor.x = ThreeUI.anchors.center;
        Interface.buttonParent.anchor.y = ThreeUI.anchors.bottom;
        Interface.buttonParent.smoothing = false;
        Interface.buttonParent.offset.bottom = -180;
        Interface.playButton = Game.UI.createSpriteFromSheet('play-wide.png', 'sprites/interface.png', 'sprites/interface.json');
        Interface.playButton.x = 0;
        Interface.playButton.y = 10;
        Interface.playButton.alpha = 1;
        Interface.playButton.pivot.x = 0.5;
        Interface.playButton.pivot.y = 1;
        Interface.playButton.smoothing = false;
        Interface.playButton.anchor.x = ThreeUI.anchors.center;
        Interface.playButton.anchor.y = ThreeUI.anchors.bottom;
        Interface.playButton.parent = Interface.buttonParent;
        Interface.playButton.visible = false;
        Interface.playButton.defaultSprite = Interface.playButton.assetPath;
        Interface.playButton.blinkSprite = 'play-wide-blink.png';
        Interface.characterSelect = Game.UI.createSpriteFromSheet('characterSelect.png', 'sprites/interface.png', 'sprites/interface.json');
        Interface.characterSelect.x = 10;
        Interface.characterSelect.y = 10;
        Interface.characterSelect.smoothing = false;
        Interface.characterSelect.anchor.x = ThreeUI.anchors.left;
        Interface.characterSelect.anchor.y = ThreeUI.anchors.bottom;
        Interface.characterSelect.pivot.x = 0;
        Interface.characterSelect.pivot.y = 1;
        Interface.characterSelect.parent = Interface.buttonParent;
        Interface.characterSelect.defaultSprite = Interface.characterSelect.assetPath;
        Interface.characterSelect.blinkSprite = 'characterSelectBlink.png';
        mute = Game.UI.createSpriteFromSheet('mute-off.png', 'sprites/interface.png', 'sprites/interface.json');
        mute.x = 10;
        mute.pivot.x = 1;
        mute.pivot.y = 1;
        mute.smoothing = false;
        mute.anchor.x = ThreeUI.anchors.right;
        mute.anchor.y = ThreeUI.anchors.bottom;
        mute.visible = false;
        mute.defaultSprite = mute.assetPath;
        mute.blinkSprite = 'mute-off-blink.png';
        Interface.showUpsell = Game.UI.createSpriteFromSheet('GoTo.png', 'sprites/interface.png', 'sprites/interface.json');
        Interface.showUpsell.x = 10;
        Interface.showUpsell.smoothing = false;
        Interface.showUpsell.pivot.x = 1;
        Interface.showUpsell.pivot.y = 1;
        Interface.showUpsell.anchor.x = ThreeUI.anchors.right;
        Interface.showUpsell.anchor.y = ThreeUI.anchors.bottom;
        Interface.showUpsell.visible = false;
        Interface.showUpsell.navigateOnBottom = () => {
            if (AppStoreInterstitial.isVisible()) {
                return null;
            }
            return mute;
        };
        Interface.showUpsell.defaultSprite = Interface.showUpsell.assetPath;
        Interface.showUpsell.blinkSprite = 'GoTo-blink.png';
        Interface.showMore = Game.UI.createSpriteFromSheet('arrow-up.png', 'sprites/interface.png', 'sprites/interface.json');
        Interface.showMore.x = 10;
        Interface.showMore.y = 10;
        Interface.showMore.rotation = 0;
        Interface.showMore.alpha = 1;
        Interface.showMore.smoothing = false;
        Interface.showMore.anchor.x = ThreeUI.anchors.right;
        Interface.showMore.anchor.y = ThreeUI.anchors.bottom;
        Interface.showMore.pivot.x = 1;
        Interface.showMore.pivot.y = 1;
        Interface.showMore.parent = Interface.buttonParent;
        Interface.showMore.defaultSprite = Interface.showMore.assetPath;
        Interface.showMore.blinkSprite = 'arrow-up-blink.png';
        Interface.showMore.navigateOnTop = () => {
            if (!isShowingMore) {
                Interface.showMore.fireEvent('click');
            }
            return mute;
        };
        scoreText = Game.UI.createBitmapText('', 5, 0, 0, 'fonts/8-bit-wonder.png', 'fonts/8-bit-wonder.json');
        scoreText.y = 10;
        scoreText.x = 10;
        scoreText.anchor.x = ThreeUI.anchors.left;
        scoreText.anchor.y = ThreeUI.anchors.top;
        scoreText.smoothing = false;
        Interface.topScore = Game.UI.createBitmapText('', 2.6, 0, 0, 'fonts/8-bit-wonder.png', 'fonts/8-bit-wonder.json');
        Interface.topScore.y = scoreText.y + 68;
        Interface.topScore.x = scoreText.x;
        Interface.topScore.anchor.x = ThreeUI.anchors.left;
        Interface.topScore.anchor.y = ThreeUI.anchors.top;
        Interface.topScore.smoothing = false;
        Interface.coinText = Game.UI.createBitmapText(GameSave.GetCoins(), 3.6, 0, 0, 'fonts/8-bit-wonder-yellow.png', 'fonts/8-bit-wonder.json');
        Interface.coinText.y = 11;
        Interface.coinText.anchor.x = ThreeUI.anchors.right;
        Interface.coinText.anchor.y = ThreeUI.anchors.top;
        Interface.coinText.pivot.x = 1;
        Interface.coinText.smoothing = false;
        Interface.coinIcon = Game.UI.createSpriteFromSheet('coin.png', 'sprites/interface.png', 'sprites/interface.json');
        Interface.coinIcon.smoothing = false;
        Interface.coinIcon.anchor.x = ThreeUI.anchors.right;
        Interface.coinIcon.anchor.y = ThreeUI.anchors.top;
        Interface.coinIcon.pivot.x = 1;
        Interface.coinIcon.pivot.y = 1;
        Interface.coinIcon.y = Interface.coinText.y + Interface.coinText.height;
        Interface.coinIcon.x = 5;
        Interface.coinIcon.width = 35;
        Interface.coinIcon.height = 35;
        Interface.coinText.x = Interface.coinIcon.x + Interface.coinIcon.width;
        Interface.hintContainer = Game.UI.createRectangle();
        Interface.hintContainer.alpha = 0;
        Interface.hintContainer.stretch.x = true;
        Interface.hintContainer.stretch.y = true;
        const hintLineParent = Game.UI.createRectangle('#ffffff', 0, 0, 1, 1);
        hintLineParent.alpha = 0;
        hintLineParent.anchor.x = ThreeUI.anchors.center;
        hintLineParent.anchor.y = ThreeUI.anchors.center;
        hintLineParent.parent = Interface.hintContainer;
        hintLine = Game.UI.createRectangle('#ffffff', 0, 0, 1, 15);
        hintLine.smoothing = false;
        hintLine.y = -240;
        hintLine.visible = false;
        hintLine.stretch.x = true;
        hintLine.offset.left = 75;
        hintLine.offset.right = 75;
        hintLine.parent = hintLineParent;
        finger = Game.UI.createSpriteFromSheet('tap1.png', 'sprites/interface.png', 'sprites/interface.json');
        finger.smoothing = false;
        finger.anchor.x = ThreeUI.anchors.center;
        finger.anchor.y = ThreeUI.anchors.center;
        finger.y = -200;
        finger.visible = false;
        finger.width = 23 * hintScaleFactor;
        finger.height = 48 * hintScaleFactor;
        finger.parent = Interface.hintContainer;
        arrowHint = Game.UI.createSpriteFromSheet('keyboard-full.png', 'sprites/interface.png', 'sprites/interface.json');
        arrowHint.smoothing = false;
        arrowHint.anchor.x = ThreeUI.anchors.center;
        arrowHint.anchor.y = ThreeUI.anchors.center;
        arrowHint.x = 0;
        arrowHint.parent = Interface.hintContainer;
        arrowHint.visible = false;
        arrowHint.width = 26 * hintScaleFactor;
        arrowHint.height = 18 * hintScaleFactor;
        Interface.moveToPlay = Game.UI.createSpriteFromSheet('keyboard-full.png', 'sprites/interface.png', 'sprites/interface.json');
        Interface.moveToPlay.anchor.x = ThreeUI.anchors.center;
        Interface.moveToPlay.anchor.y = ThreeUI.anchors.bottom;
        Interface.moveToPlay.pivot.y = 1;
        if (window.isMobile) {
            Interface.moveToPlay.y = 20;
        } else {
            Interface.moveToPlay.visible = false;
            Interface.moveToPlay.y = 18;
        }
        Interface.moveToPlay.smoothing = false;
        Interface.moveToPlay.onClick(() => {
            Interface.playButtonCallback();
        });
        Interface.moveToPlay.navigateOnTop = () => {
            Interface.playButtonCallback();
            return null;
        };
        Interface.moveToPlay.defaultSprite = Interface.moveToPlay.assetPath;
        Interface.moveToPlay.blinkSprite = 'keyboard-up.png';
        Interface.characterSelect.navigateOnRight = () => {
            KeyboardHint.switch('main');
            return Interface.playButton;
        };
        Interface.showMore.navigateOnLeft = () => {
            Interface.CloseShowMore();
            return Interface.playButton;
        };
        mute.navigateOnTop = Interface.showUpsell;
        mute.navigateOnBottom = Interface.showMore;
        mute.navigateOnLeft = () => {
            Interface.CloseShowMore();
            return Interface.playButton;
        };
        Interface.showUpsell.navigateOnLeft = () => {
            if (AppStoreInterstitial.isVisible()) {
                return null;
            }
            Interface.CloseShowMore();
            return Interface.playButton;
        };
        if (isMobile) {
            Interface.moveToPlay.setAssetPath('tap1.png');
        }
        Interface.moveToPlayHitzone1 = Game.UI.createRectangle();
        Interface.moveToPlayHitzone1.alpha = 0;
        Interface.moveToPlayHitzone1.pivot.y = 1;
        Interface.moveToPlayHitzone1.anchor.y = ThreeUI.anchors.bottom;
        Interface.moveToPlayHitzone1.stretch.x = true;
        Interface.moveToPlayHitzone1.forceEventsWhenVisible = true;
        Interface.moveToPlayHitzone1.onClick(() => {
            if (!AppStoreInterstitial.isVisible()) {
                Interface.playButtonCallback();
            }
        });
        Interface.moveToPlayHitzone2 = Game.UI.createRectangle();
        Interface.moveToPlayHitzone2.alpha = 0;
        Interface.moveToPlayHitzone2.stretch.x = true;
        Interface.moveToPlayHitzone2.offset.right = 100;
        Interface.moveToPlayHitzone2.stretch.y = true;
        Interface.moveToPlayHitzone1.forceEventsWhenVisible = true;
        Interface.moveToPlayHitzone2.onClick(() => {
            if (!AppStoreInterstitial.isVisible()) {
                Interface.playButtonCallback();
            }
        });
        const blueFadeOverlay = Game.UI.createRectangle('rgba(105, 206, 236, 0)');
        blueFadeOverlay.stretch.x = true;
        blueFadeOverlay.stretch.y = true;
        blueFadeOverlay.offset.left = -1;
        blueFadeOverlay.offset.right = -1;
        blueFadeOverlay.offset.top = -1;
        blueFadeOverlay.offset.bottom = -1;
        blueFadeOverlay.alpha = 0;
        fadeToBlueTween = new TWEEN.Tween(blueFadeOverlay).onStart(function () {
            this.alpha = 0;
            this.visible = true;
        }).to({
            alpha: 1
        }, 500).easing(TWEEN.Easing.Quartic.Out);
        this.unfadeFromBlueTween = new TWEEN.Tween(blueFadeOverlay).onStart(function () {
            this.visible = true;
        }).to({
            alpha: 0
        }, 500).easing(TWEEN.Easing.Quartic.Out);
        pauseOverlay = document.createElement('div');
        document.body.appendChild(pauseOverlay);
        pauseOverlay.style.position = 'absolute';
        pauseOverlay.style.display = 'none';
        pauseOverlay.style.backgroundColor = 'rgba(105, 206, 236, 0.4)';
        pauseOverlay.style.zIndex = 4;
        pauseOverlay.addEventListener('click', () => {
            if (!Game.takesUserInput) {
                return;
            }
            Interface.unPause();
        });
        Interface.pauseBtn = Game.UI.createSpriteFromSheet('pause.png', 'sprites/interface.png', 'sprites/interface.json');
        Interface.pauseBtn.smoothing = false;
        Interface.pauseBtn.visible = false;
        Interface.pauseBtn.anchor.x = ThreeUI.anchors.right;
        Interface.pauseBtn.anchor.y = ThreeUI.anchors.top;
        Interface.pauseBtn.y = 44 + 35;
        Interface.pauseBtn.x = 10;
        Interface.pauseBtn.pivot.x = 1;
        Interface.pauseBtn.width = 7 * 4;
        Interface.pauseBtn.height = 7 * 4;
        pauseCounter = document.createElement('div');
        pauseCounter.style.font = '64px EditUndoBrk';
        pauseCounter.style.color = '#fff';
        pauseCounter.style.textAlign = 'center';
        pauseCounter.style.width = '300px';
        pauseCounter.style.height = '100px';
        pauseCounter.style.position = 'absolute';
        pauseCounter.style.left = '50%';
        pauseCounter.style.top = '50%';
        pauseCounter.style.display = 'none';
        pauseOverlay.appendChild(pauseCounter);
        pauseIndicator = document.createElement('img');
        pauseIndicator.className = 'pixelated';
        pauseIndicator.src = 'sprites/pause.png';
        pauseIndicator.style.position = 'absolute';
        pauseIndicator.style.left = '50%';
        pauseIndicator.style.top = '47.5%';
        pauseIndicator.style.height = '10%';
        pauseIndicator.style.display = 'none';
        pauseOverlay.appendChild(pauseIndicator);
        interstitialPanel = document.createElement('div');
        interstitialPanel.style.position = 'absolute';
        interstitialPanel.style.left = '0';
        interstitialPanel.style.top = '0';
        interstitialPanel.style.width = '100%';
        interstitialPanel.style.height = '100%';
        interstitialPanel.style.perspective = '1000px';
        interstitialPanel.style.display = 'flex';
        interstitialPanel.style.justifyContent = 'center';
        interstitialPanel.style.alignItems = 'center';
        interstitialPanel.style.zIndex = 2;
        interstitialPanel.style.overflow = 'hidden';
        interstitialBg = document.createElement('div');
        interstitialBg.style.zIndex = 1;
        interstitialBg.style.backgroundColor = 'rgb(105, 206, 236)';
        interstitialBg.style.transition = '0.5s opacity ease-out';
        interstitialBg.style.opacity = 1;
        interstitialBg.style.position = 'absolute';
        interstitialBg.style.left = '0';
        interstitialBg.style.top = '0';
        interstitialBg.style.width = '100%';
        interstitialBg.style.height = '100%';
        interstitialBg.style.perspective = '1000px';
        logo = document.createElement('img');
        logo.src = 'sprites/crossy-road-logo.png';
        logo.style.minWidth = '50%';
        logo.style.maxWidth = '80%';
        logo.style.maxHeight = '50%';
        logo.style.marginTop = '-15%';
        logo.style.position = 'relative';
        logo.style.pointerEvents = 'none';
        logo.style.zIndex = 2;
        interstitialPanel.appendChild(logo);
        interstitialPanel.appendChild(interstitialBg);
        Game.container.appendChild(interstitialPanel);
        Interface.ButtonScaleSet();
        Interface.setupButtonEventHandlers();
        Interface.determineLogoTransform();
        logo.style.transform = `translate3d(${-logoHiddenTransform.x}px, ${logoHiddenTransform.y}px, 0)`;
        Interface.updatePauseUI();
        showInterstitialTween = new TWEEN.Tween({
            t: 0
        }).to({
            t: 1
        }, 500).onStart(() => {
            interstitialBg.style.transition = '0.5s opacity ease-out';
            interstitialBg.style.opacity = 1;
        });
        hideInterstitialTween = new TWEEN.Tween({
            t: 0
        }).to({
            t: 1
        }, 500).onStart(() => {
            interstitialBg.style.transition = '0.5s opacity ease-in';
            interstitialBg.style.opacity = 0;
        });
        showLogoTween = new TWEEN.Tween({
            t: 0
        }).to({
            t: 750
        }, 750).easing(TWEEN.Easing.Quartic.Out).onStart(() => {
            interstitialPanel.style.display = 'flex';
            logo.style.display = 'block';
            logo.style.transition = `${logoTransitionDuration} ${logoShowTransition}`;
            requestAnimationFrame(() => {
                logo.style.transform = logoShownStyleTransform;
            });
        }).onComplete(() => {
            logo.style.transition = '';
        });
        hideLogoTween = new TWEEN.Tween({
            t: 0
        }).to({
            t: 750
        }, 750).easing(TWEEN.Easing.Quartic.In).onStart(() => {
            logo.style.transition = `${logoTransitionDuration} ${logoHideTransition}`;
            logo.style.transform = `translate3d(${logoHiddenTransform.x}px, ${-logoHiddenTransform.y}px, 0)`;
        }).onComplete(() => {
            interstitialPanel.style.display = 'none';
            logo.style.transform = `translate3d(${-logoHiddenTransform.x}px, ${logoHiddenTransform.y}px, 0)`;
        });
        UIloaded = true;
        AppStoreInterstitial.hide();
    }

    static showInterstitial(onComplete) {
        const dontHide = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        if (Interface.currentScreen === "interstitial") {
            return;
        }
        Interface.currentScreen = "interstitial";
        Interface.showLogo();
        window.setTimeout(() => {
            hideInterstitialTween.stop();
            showInterstitialTween.start().onComplete(() => {
                onComplete();
                if (dontHide) {
                    return;
                }
                window.setTimeout(() => {
                    hideInterstitialTween.start().onComplete(() => {
                        Interface.currentScreen = "main";
                    });
                }, 250);
            });
        }, 200);
    }

    static coinBlast(amount) {
        
        if (this.coins && this.coins.length > 0) {
            this.coins.forEach(coin => {
                Game.UI.delete(coin);
            });
        }
        window.setTimeout(() => {
            Game.playSfx('gift/emptying the piggy bank 2');
        }, 100);
        this.coins = [];
        const maxDistance = getDistance(0, 0, Game.UI.width, Game.UI.height);
        for (let idx = 0; idx < amount; idx++) {
            const startX = Utils.getRandomInt(0, Game.UI.width);
            const destX = Utils.getRandomInt(0, Game.UI.width);
            const startY = -coinSize;
            const destY = Utils.getRandomInt(0, Game.UI.height);
            const coinIcon = Game.UI.createSpriteFromSheet('coin-basic.png', 'sprites/interface.png', 'sprites/interface.json');
            coinIcon.smoothing = false;
            coinIcon.anchor.x = ThreeUI.anchors.left;
            coinIcon.anchor.y = ThreeUI.anchors.top;
            coinIcon.x = startX;
            coinIcon.y = startY;
            this.coins.push(coinIcon);
            const coords = {
                x: startX,
                y: startY,
                w: coinSize * .001,
                coin: coinIcon,
                idx
            };
            const delay = Math.random() * 200;
            new TWEEN.Tween(coords).to({
                x: destX,
                y: destY,
                w: coinSize
            }, 400).easing(TWEEN.Easing.Quartic.Out).onUpdate(function () {
                this.coin.width = this.w;
                this.coin.height = this.w;
                this.coin.x = this.x;
                this.coin.y = this.y;
            }).delay(delay).onComplete(function () {
                window.setTimeout(() => {
                    if (Game.UI.displayObjects.includes(this.coin)) {
                        if (this.idx % 5 === 0) {
                            Game.playSfx('get-coin-79', true);
                        }
                    }
                    removeCoin(this.coin);
                }, 200 + this.idx * 30);
            }).start();
            new TWEEN.Tween(coinIcon).to({
                rotation: Utils.getRandomInt(-180, 180)
            }, 600).easing(TWEEN.Easing.Cubic.Out).delay(delay).start();
        }
    }

    static hideRemainingCoins() {
        if (this.coins && this.coins.length > 0) {
            this.coins.forEach(coin => {
                Game.UI.delete(coin);
            });
        }
    }
}


Interface.buttonParent = null;
Interface.characterSelect = null;
Interface.coinIcon = null;
Interface.coinText = null;
Interface.CurrentScreen = "main";
Interface.isSound = true;
Interface.moveToPlay = null;
Interface.pauseBtn = null;
Interface.playButton = null;
Interface.showMore = null;
Interface.showUpsell = null;
Interface.topScore = null;
Interface.hintContainer = null;
Interface.moveToPlayHitzone1 = null;
Interface.moveToPlayHitzone2 = null;
var arrowHint = null;
let canGo = true;
let fadeToBlueTween = null;
var finger = null;
var hintLine = null;
const interstitialBG = null;
let interstitialPanel = null;
const interstitialTween = {
    opacity: 1
};
let isShowingMore = false;
const logoAngle = 104;
const logoCot = 1 / Math.tan(logoAngle * Math.PI / 180);
const logoHiddenTransform = {
    x: 0,
    y: 0
};
const logoHideTransition = 'cubic-bezier(0.895, 0.03, 0.685, 0.22)';
const logoShownStyleTransform = 'translate3d(0, 0, 0)';
const logoShowTransition = 'cubic-bezier(0.165, 0.84, 0.44, 1)';
const logoTransitionDuration = '750ms';
var mute = null;
let pauseCounter = null;
let pauseIndicator = null;
let pauseOverlay = null;
let scoreText = null;
let UIloaded = false;
Interface.ButtonSound = () => {
    Game.playRandomSfx(['Pop 1', 'Pop 3', 'Pop 5', 'Pop 7', 'Pop 9', 'Pop 2', 'Pop 4', 'Pop 6', 'Pop 8']);
};
Interface.ChooseCharacter = () => {
    AppStoreInterstitial.hide();
    Interface.CloseShowMore();
    Interface.HidePlay();
    Carousel.Show();
    Interface.characterSelect.visible = false;
    Interface.moveToPlay.visible = false;
    Interface.moveToPlayHitzone1.visible = false;
    Interface.moveToPlayHitzone2.visible = false;
    Interface.showMore.visible = false;
    Interface.topScore.visible = false;
};
let showInterstitialTween;
let hideInterstitialTween;
let showLogoTween;
let hideLogoTween;
var fingerTween = null;
var playingHint = false;
Interface.HideHint = force => {
    KeyboardHint.switch('full-movement-hint');
    if (!window.isMobile) {
        return;
    }
    playingHint = false;
    if (force) {
        finger.visible = false;
        hintLine.visible = false;
        arrowHint.visible = false;
    }
};
var isMainMenu = function isMainMenu() {
    return Interface.CurrentScreen === "main" && !Game.playing;
};
var hintScaleFactor = 2;
Interface.ShowHint = () => {
    if (!window.isMobile) {
        KeyboardHint.show('movement-hint');
        return;
    }
    playingHint = true;
    if (fingerTween != null) {
        return;
    }
    playHint();
};
Interface.doMute = () => {
    Interface.isSound = false;
    Storage.setItem('isSound', 'false');
    Game.audioManager.SetVolume(0);
    setMuteButton();
};
const btnTween = null;
Interface.ToggleShowMore = () => {
    Interface.ButtonSound();
    if (isShowingMore) {
        Interface.CloseShowMore();
    } else {
        Interface.OpenShowMore();
    }
};
Interface.OpenShowMore = () => {
    if (isShowingMore || !isMainMenu()) {
        return;
    }
    mute.visible = true;
    Interface.showUpsell.visible = true;
    isShowingMore = true;
    Interface.showMore.setAssetPath("arrow-up_toggle.png");
    Interface.showMore.defaultSprite = Interface.showMore.assetPath;
    Interface.showMore.blinkSprite = 'arrow-up_toggle-blink.png';
    KeyboardHint.switch('main-show-more');
};
Interface.CloseShowMore = () => {
    if (!isShowingMore) {
        return;
    }
    mute.visible = false;
    Interface.showUpsell.visible = false;
    isShowingMore = false;
    Interface.showMore.setAssetPath("arrow-up.png");
    Interface.showMore.defaultSprite = Interface.showMore.assetPath;
    Interface.showMore.blinkSprite = 'arrow-up-blink.png';
    KeyboardHint.switch('main');
};
Interface.showMain = () => {
    Interface.CurrentScreen = "main";
    GumballMachineScreen.hideUnlockedSpecialCharacter();
    AppStoreInterstitial.lastUpsellScreen = 'main_menu';
    Interface.buttonParent.visible = true;
    Interface.showMore.visible = true;
    Interface.characterSelect.visible = Carousel.HowManyUnlocked().number > 1;
    if (!Game.hasPlayedBefore) {
        Interface.showMore.visible = false;
        mute.visible = false;
        KeyboardHint.show('main-first-play', true);
    } else {
        Interface.playButton.navigateOnLeft = () => {
            KeyboardHint.switch('main-char-select');
            return Interface.characterSelect;
        };
        Interface.playButton.navigateOnRight = () => {
            if (!isShowingMore) {
                Interface.OpenShowMore();
            }
            return Interface.showMore;
        };
        Interface.ShowPlay();
        if (!window.isMobile) {
            KeyboardUIControls.setFocus(Interface.playButton);
        }
        if (!window.isMobile) {
            KeyboardHint.show('main', true);
        }
    }
    Interface.moveToPlay.visible = window.isMobile;
    Interface.moveToPlayHitzone1.visible = true;
    Interface.moveToPlayHitzone2.visible = true;
    Interface.coinText.visible = true;
    Interface.coinIcon.visible = true;
    Interface.hintContainer.visible = true;
    Interface.showLogo(true);
    Game.UI.MoveToFront(KeyboardUIControls.reticle);
};
Interface.ShowPlay = btnDelay => {
    Interface.playButton.disabled = false;
    if (Interface.CurrentScreen === 'death') {
        Interface.playButton.setAssetPath('play-wide.png');
        Interface.playButton.defaultSprite = 'play-wide.png';
        Interface.playButton.blinkSprite = 'play-wide-blink.png';
    } else {
        Interface.playButton.disabled = true;
        Interface.playButton.visible = false;
        return;
    }
    if (window.isMobile && Interface.CurrentScreen !== "death") {
        Interface.playButton.visible = false;
        return;
    }
    if (Interface.buttonParent.offset.bottom !== 0 && movingInUi === -1) {
        Interface.buttonParent.offset.bottom = 0;
    }
    if (Interface.playButton.visible) {
        return;
    }
    let hintShown = false;
    if (Interface.CurrentScreen === 'death' && Interface.activeButtons && Interface.activeButtons.length > 0) {
        KeyboardHint.show('death-buttons');
        hintShown = true;
    }
    if (typeof btnDelay === 'undefined') {
        Interface.playButton.disabled = false;
        Interface.playButton.y = 10;
        if (Interface.CurrentScreen === 'death' && !hintShown) {
            KeyboardHint.show('death');
        }
    } else {
        Interface.playButton.disabled = true;
        Interface.playButton.y = -200;
        window.setTimeout(() => {
            Interface.playButton.y = 10;
            Interface.playButton.disabled = false;
            if (Interface.CurrentScreen === 'death' && !hintShown) {
                KeyboardHint.show('death');
            }
        }, btnDelay);
    }
    Interface.playButton.visible = true;
};
Interface.HidePlay = () => {
    if (!Interface.playButton.visible) {
        return;
    }
    Interface.playButton.visible = false;
    canGo = false;
};
let unpauseTimer;
Interface.TogglePause = () => {
    if (!Game.paused) {
        Interface.Pause();
    } else {
        Interface.unPause();
    }
};
Interface.forceUnPause = () => {
    Game.clock.start();
    pauseCounter.innerText = '';
    pauseCounter.style.display = 'none';
    Game.paused = false;
    pauseOverlay.style.display = 'none';
    if (Game.playing && !Game.playerController.Dead) {
        Interface.pauseBtn.visible = true;
    }
    if (Interface.isSound) {
        Game.audioManager.SetVolume(.8);
    }
};
Interface.Pause = () => {
    Game.clock.stop();
    requestAnimationFrame(() => {
        if (!Game.paused) {
            return;
        }
        pauseOverlay.style.display = 'block';
        pauseIndicator.style.display = 'block';
        pauseCounter.style.display = 'none';
        Interface.pauseBtn.visible = false;
        Interface.updatePauseUI();
    });
    unpauseTimer = -1;
    Game.paused = true;
    Game.audioManager.SetVolume(0);
};
let unpauseInterval;
Interface.unPause = () => {
    if (unpauseTimer > 0 || RewardedHelper.adPlaying || InterstitialAdHelper.adPlaying) {
        return;
    }
    if (!Game.playerController.Dead && Game.playing) {
        unpauseTimer = 3;
        window.clearInterval(unpauseInterval);
        unpauseInterval = window.setInterval(() => {
            unpauseTimer--;
            if (unpauseTimer < 0) {
                window.clearInterval(unpauseInterval);
            }
        }, 1000);
    } else {
        unpauseTimer = 0.01;
    }
};
Interface.UpdatePause = () => {
    if (unpauseTimer >= 0) {
        pauseCounter.style.display = 'block';
        pauseIndicator.style.display = 'none';
        Interface.pauseBtn.visible = false;
        if (unpauseTimer > 2) {
            pauseCounter.innerText = '3';
        } else if (unpauseTimer > 1) {
            pauseCounter.innerText = '2';
        } else if (unpauseTimer > 0.01) {
            pauseCounter.innerText = '1';
        } else {
            Game.clock.start();
            pauseCounter.innerText = '';
            pauseCounter.style.display = 'none';
            Game.paused = false;
            pauseOverlay.style.display = 'none';
            if (Game.playing && !Game.playerController.Dead) {
                Interface.pauseBtn.visible = true;
            }
            if (Interface.isSound) {
                Game.audioManager.SetVolume(.8);
            }
        }
    }
};
Interface.tutorialLock = false;
Interface.deathUIShown = false;
Interface.focusFirstNotificationBar = () => {
    let setFocusOn = Interface.playButton._visible ? Interface.playButton : null;
    for (let idx = 0; idx < Interface.activeNotificationBars.length; idx++) {
        const bar = Interface.activeNotificationBars[idx];
        if (bar.button.visible) {
            setFocusOn = bar.button;
            break;
        }
    }
    if (setFocusOn) {
        KeyboardUIControls.setFocus(setFocusOn);
    }
};
let timeSinceLastTapBlink = 0;
Interface.CreateUI = () => {
    Game.UI = new ThreeUI(Game.canvas, 720, Game.renderUIOnQuad);
    if (Game.renderUIOnQuad) {
        Game.UI.texture.minFilter = THREE.NearestFilter;
        Game.UI.texture.magFilter = THREE.NearestFilter;
    } else {
        Game.UI.canvas.className = 'pixelated';
    }
};
Interface.ButtonScaleSet = () => {
    if (!Interface.playButton) {
        return;
    }
    const moveToPlayRatio = window.isMobile ? 13 / 19 : 26 / 18;
    const newScale = 3.5;
    Interface.characterSelect.width = 26 * newScale;
    Interface.characterSelect.height = 24 * newScale;
    Interface.showMore.width = 26 * newScale;
    Interface.showMore.height = 24 * newScale;
    Interface.playButton.width = 45 * newScale;
    Interface.playButton.height = 24 * newScale;
    mute.width = 26 * newScale;
    mute.height = 24 * newScale;
    mute.y = Interface.showMore.y + Interface.showMore.height + 10;
    Interface.showUpsell.width = 26 * newScale;
    Interface.showUpsell.height = 24 * newScale;
    Interface.showUpsell.y = mute.y + mute.height + 10;
    Interface.moveToPlay.height = 22 * newScale;
    Interface.moveToPlay.width = Interface.moveToPlay.height * moveToPlayRatio;
    Interface.moveToPlayHitzone2.offset.bottom = Interface.playButton.height + Interface.playButton.y;
    Interface.moveToPlayHitzone1.offset.left = Interface.characterSelect.x + Interface.characterSelect.width;
    Interface.moveToPlayHitzone1.offset.right = Interface.showMore.x + Interface.showMore.width;
    Interface.moveToPlayHitzone1.height = Interface.playButton.height + Interface.playButton.y;
};
Interface.removePauseOverlay = () => {
    pauseOverlay.style.display = 'none';
};
Interface.hideInterstitial = () => {
    hideInterstitialTween.start();
};
Interface.stopInterstitialTweens = () => {
    hideInterstitialTween.stop();
    showInterstitialTween.stop();
    showLogoTween.stop();
    hideLogoTween.stop();
};
Interface.setupButtonEventHandlers = () => {
    Interface.playButton.onClick(() => {
        Interface.playButtonCallback();
    });
    Interface.characterSelect.onClick(() => {
        Interface.ButtonSound();
        Interface.ChooseCharacter();
    });
    mute.onClick(() => {
        Interface.ToggleMute();
    });
    Interface.showUpsell.onClick(() => {
        Interface.ButtonSound();
        Interface.CloseShowMore();
        AppStoreInterstitial.toggle(true);
    });
    Interface.showMore.onClick(() => {
        Interface.ToggleShowMore();
    });
    Interface.pauseBtn.onClick(() => {
        Interface.ButtonSound();
        Interface.Pause();
    });
};
Interface.updatePauseUI = () => {
    const rect = Game.canvas.getBoundingClientRect();
    pauseOverlay.style.left = `${rect.left}px`;
    pauseOverlay.style.top = `${rect.top}px`;
    pauseOverlay.style.width = `${rect.width}px`;
    pauseOverlay.style.height = `${rect.height}px`;
    pauseCounter.style.fontSize = `${parseInt(64 / 720 * Game.canvas.height, 10)}px`;
    pauseCounter.style.width = `${parseInt(300 / 720 * Game.canvas.height, 10)}px`;
    pauseCounter.style.height = `${parseInt(100 / 720 * Game.canvas.height, 10)}px`;
    pauseCounter.style.lineHeight = `${parseInt(pauseCounter.style.height, 10)}px`;
    pauseCounter.style.marginLeft = `${-parseInt(pauseCounter.style.width, 10) / 2}px`;
    pauseCounter.style.marginTop = `${-parseInt(pauseCounter.style.height, 10) / 2}px`;
    const indicatorRect = pauseIndicator.getBoundingClientRect();
    pauseIndicator.style.marginTop = `${-(indicatorRect.height / 2)}px`;
    pauseIndicator.style.marginLeft = `${-(indicatorRect.width / 2)}px`;
};
Interface.showLogo = (instant, callback) => {
    if (instant) {
        logo.style.transform = logoShownStyleTransform;
        logo.style.transition = 'none';
        logo.style.display = 'block';
        if (typeof callback === 'function') {
            callback();
        }
        return;
    }
    if (typeof callback === 'function') {
        showLogoTween.onComplete(callback);
    } else {
        showLogoTween.onComplete(null);
    }
    showLogoTween.start();
};
Interface.hideInterstitial = () => {
    showInterstitialTween.stop();
    hideInterstitialTween.start();
};
Interface.determineLogoTransform = () => {
    logoHiddenTransform.x = Game.canvas.getBoundingClientRect().width;
    logoHiddenTransform.y = logoCot * logoHiddenTransform.x;
};
Interface.updateScale = deltaTime => {
    if (!UIloaded) {
        return;
    }
    Interface.determineLogoTransform();
    if (Interface.playButton.visible || Interface.characterSelect.visible || Interface.showMore.visible) {
        Interface.ButtonScaleSet();
    }
    if (Interface.CurrentScreen == "selectingCharacter") {
        Carousel.ButtonScaleSet();
    }
    if (Interface.activeNotificationBars.length > 0) {
        Interface.activeNotificationBars.forEach(bar => {
            scaleNotificationBar(bar);
        });
    }
};
let hiding = false;
Interface.hideLogo = instant => {
    if (hiding || hideLogoTween._isPlaying || showLogoTween._isPlaying) {
        return false;
    }
    if (instant) {
        logo.style.display = 'none';
        return;
    }
    hiding = true;
    hideLogoTween.start();
    window.setTimeout(() => {
        hiding = false;
    }, 750);
    return true;
};
const coinSize = 30;
const removeCoin = function removeCoin(coin) {
    const coords = {
        w: coinSize,
        coin
    };
    new TWEEN.Tween(coords).to({
        w: 0
    }, 150).easing(TWEEN.Easing.Sinusoidal.InOut).onUpdate(function () {
        this.coin.width = this.w;
    }).onComplete(function () {
        Game.UI.delete(this.coin);
    }).onStart(function () {
        this.coin.setAssetPath('coin-white.png');
    }).start();
};
const getDistance = function getDistance(x1, y1, x2, y2) {
    const a = x1 - x2;
    const b = y1 - y2;
    return Math.sqrt(a * a + b * b);
};
var movingInUi = -1;
let uiMoveTween = null;
Interface.moveInUI = timeOut => {
    if (movingInUi > -1) {
        const dt = (Date.now() - movingInUi) / (timeOut || 1000);
        window.setTimeout(() => {
            if (uiMoveTween._isPlaying != true) {
                if (Interface.buttonParent.offset.bottom !== 0) {
                    movingInUi = -1;
                    Interface.moveInUI();
                }
            }
        }, timeOut || 1000);
        return;
    }
    movingInUi = Date.now();
    Interface.buttonParent.offset.bottom = -180;
    const coords = {
        y: Interface.buttonParent.offset.bottom
    };
    uiMoveTween = new TWEEN.Tween(coords).to({
        y: 0
    }, 150).onUpdate(function () {
        Interface.buttonParent.offset.bottom = this.y;
        Game.UI.shouldReDraw = true;
    }).delay(1000).onStart(() => {
        uiMoveTween._isPlaying = true;
    }).onComplete(() => {
        if (Game.hasPlayedBefore && !Game.playing) {
            KeyboardHint.show('main');
        }
        movingInUi = -1;
        uiMoveTween._isPlaying = false;
    }).start();
};
Interface.barContainer = null;
Interface.upsellWasClicked = Storage.getItem('upsellWasClicked') || false;
Interface.activeNotificationBars = [];
const allNotificationBars = [];
let availableNotificationBars = [];
const notificationBarColors = {
    blue: '#56C7F9',
    orange: '#ff4c0a',
    yellow: '#ffc500',
    red: '#e9202b'
};
const notificationBarLandscapeHeight = 100;
const notificationBarPortraitHeight = 80;
const notificationBarMargin = 10;
const notificationBarPortraitWidth = 0.95;
const notificationBarLandscapeWidth = 0.5;
Interface.preCreateNotificationBars = () => {
    for (let i = 0; i < 3; i++) {
        createNotificationBar();
    }
};
var getNotificationBarContentDimensions = function getNotificationBarContentDimensions() {
    const aspectRatio = Game.canvas.width / Game.canvas.height;
    const percLandscape = Utils.inverseLerp(window.minAspect, window.maxAspect, aspectRatio);
    return {
        width: THREE.Math.lerp(notificationBarPortraitWidth, notificationBarLandscapeWidth, percLandscape),
        height: THREE.Math.lerp(notificationBarPortraitHeight, notificationBarLandscapeHeight, percLandscape)
    };
};
var createNotificationBar = function createNotificationBar() {
    if (!Interface.barContainer) {
        Interface.barContainer = Game.UI.createRectangle('rgba(0,0,0,0)');
        Interface.barContainer.stretch.x = true;
        Interface.barContainer.anchor.y = ThreeUI.anchors.center;
    }
    const background = Game.UI.createRectangle();
    background.anchor.x = ThreeUI.anchors.center;
    background.anchor.y = ThreeUI.anchors.center;
    background.alpha = 0.96;
    background.visible = false;
    background.parent = Interface.barContainer;
    const contentAnimator = Game.UI.createRectangle();
    contentAnimator.pivot = {
        x: 0,
        y: 0
    };
    contentAnimator.alpha = 0;
    contentAnimator.parent = background;
    const content = Game.UI.createRectangle();
    content.alpha = 0;
    content.parent = contentAnimator;
    content.stretch.x = true;
    content.stretch.y = true;
    const textContainer = Game.UI.createRectangle();
    textContainer.alpha = 0;
    textContainer.parent = content;
    textContainer.stretch.x = true;
    textContainer.stretch.y = true;
    const text = Game.UI.createText('TEXT', 40, 'EditUndoBrk', '#fff');
    text.parent = textContainer;
    text.anchor.x = ThreeUI.anchors.center;
    text.textAlign = 'center';
    text.textBaseline = 'middle';
    text.textVerticalAlign = 'center';
    text.visible = false;
    const button = Game.UI.createSpriteFromSheet('adToCoin.png', 'sprites/interface.png', 'sprites/interface.json');
    button.parent = content;
    button.anchor.y = ThreeUI.anchors.center;
    button.anchor.x = ThreeUI.anchors.right;
    button.visible = false;
    const buttonAttention = Game.UI.createSpriteFromSheet('attention.png', 'sprites/interface.png', 'sprites/interface.json');
    buttonAttention.parent = button;
    buttonAttention.anchor.x = ThreeUI.anchors.right;
    buttonAttention.anchor.y = ThreeUI.anchors.top;
    buttonAttention.x = 10;
    buttonAttention.y = 0;
    buttonAttention.visible = false;
    const button2 = Game.UI.createSpriteFromSheet('adToCoin.png', 'sprites/interface.png', 'sprites/interface.json');
    button2.parent = content;
    button2.anchor.y = ThreeUI.anchors.center;
    button2.anchor.x = ThreeUI.anchors.right;
    button2.visible = false;
    const button3 = Game.UI.createSpriteFromSheet('adToCoin.png', 'sprites/interface.png', 'sprites/interface.json');
    button3.parent = content;
    button3.anchor.y = ThreeUI.anchors.center;
    button3.anchor.x = ThreeUI.anchors.right;
    button3.visible = false;
    const buttonGraphic = Game.UI.createSprite('sprites/trex.png');
    buttonGraphic.anchor.x = ThreeUI.anchors.center;
    buttonGraphic.anchor.y = ThreeUI.anchors.top;
    buttonGraphic.visible = false;
    buttonGraphic.parent = content;
    buttonGraphic.smoothing = true;
    const button2Graphic = Game.UI.createSprite('sprites/duck.png');
    button2Graphic.anchor.x = ThreeUI.anchors.center;
    button2Graphic.anchor.y = ThreeUI.anchors.top;
    button2Graphic.visible = false;
    button2Graphic.parent = content;
    const button3Graphic = Game.UI.createSprite('sprites/robot.png');
    button3Graphic.anchor.x = ThreeUI.anchors.center;
    button3Graphic.anchor.y = ThreeUI.anchors.top;
    button3Graphic.visible = false;
    button3Graphic.parent = content;
    const sideGraphic = Game.UI.createSprite('sprites/trex.png');
    sideGraphic.anchor.x = ThreeUI.anchors.right;
    sideGraphic.anchor.y = ThreeUI.anchors.center;
    sideGraphic.pivot.x = 0;
    sideGraphic.x = 0;
    sideGraphic.parent = content;
    sideGraphic.visible = false;
    const bar = {
        background,
        contentAnimator,
        content,
        textContainer,
        text,
        button,
        buttonAttention,
        button2,
        button3,
        buttonGraphic,
        button2Graphic,
        button3Graphic,
        sideGraphic
    };
    allNotificationBars.push(bar);
    availableNotificationBars.push(bar);
    return bar;
};
var scaleNotificationBar = function scaleNotificationBar(bar) {
    const buttonAspect = 1.875;
    let maxButtonMargin = 14;
    const maxButtonHeight = 72;
    const maxTextSize = 40;
    const maxHeight = Math.max(notificationBarPortraitHeight, notificationBarLandscapeHeight);
    const dimensions = getNotificationBarContentDimensions();
    const percOfMax = dimensions.height / maxHeight;
    const contentOffset = (1 - dimensions.width) / 2 * 100;
    bar.content.offset.left = bar.content.offset.right = `${contentOffset}%`;
    bar.background.width = Game.UI.width * 1.05;
    bar.background.height = dimensions.height;
    if (bar.doubleHeight) {
        bar.background.height *= 2;
    } else if (bar.tripleHeight) {
        bar.background.height *= 3;
    }
    if (bar.position === 'top') {
        bar.background.y = -(bar.background.height + notificationBarMargin);
    } else if (bar.position === 'middle') {
        bar.background.y = 0;
    } else if (bar.position === 'bottom') {
        bar.background.y = bar.background.height + notificationBarMargin;
    }
    bar.contentAnimator.width = bar.background.width;
    bar.contentAnimator.height = bar.background.height;
    bar.button.height = maxButtonHeight * percOfMax;
    bar.button.width = bar.button.height * buttonAspect;
    const textSize = maxTextSize * percOfMax;
    bar.text.size = textSize;
    bar.text.y = dimensions.height / 2 + 4;
    bar.textContainer.offset.right = 0;
    if (typeof bar.buttonMargin !== 'undefined') {
        maxButtonMargin = bar.buttonMargin;
    }
    const buttonMargin = maxButtonMargin * percOfMax;
    bar.buttonGraphic.y = dimensions.height;
    bar.button2Graphic.y = dimensions.height;
    bar.button3Graphic.y = dimensions.height;
    if (bar.doubleHeight || bar.tripleHeight) {
        bar.button2.height = bar.button.height;
        bar.button2.width = bar.button.width;
        bar.button3.height = bar.button.height;
        bar.button3.width = bar.button.width;
        if (bar.doubleHeight) {
            bar.button.y = dimensions.height * 0.5;
            bar.button2.y = dimensions.height * 0.5;
            bar.button3.y = dimensions.height * 0.5;
        } else if (bar.tripleHeight) {
            bar.button.y = dimensions.height;
            bar.button2.y = dimensions.height;
            bar.button3.y = dimensions.height;
        }
        bar.button.anchor.x = ThreeUI.anchors.center;
        bar.button2.anchor.x = ThreeUI.anchors.center;
        bar.button3.anchor.x = ThreeUI.anchors.center;
        bar.button.x = -(bar.button2.width + buttonMargin * 2);
        bar.button3.x = bar.button2.width + buttonMargin * 2;
        bar.buttonGraphic.x = bar.button.x;
        bar.button3Graphic.x = bar.button3.x;
        if (bar.amountOfButtons === 1) {
            bar.button.x = 0;
        }
    } else if (bar.button._visible) {
        bar.button.x = buttonMargin + bar.button.width * 0.5;
        bar.textContainer.offset.right = bar.button.x * 2;
    }
    bar.background.startY = bar.background.y;
    if (bar.hasSideGraphic) {
        const aspectRatio = Game.canvas.width / Game.canvas.height;
        const percLandscape = Utils.inverseLerp(window.minAspect, window.maxAspect, aspectRatio);
        bar.sideGraphic.height = THREE.Math.lerp(100, 271, percLandscape);
        bar.sideGraphic.width = THREE.Math.lerp(110, 300, percLandscape);
        bar.content.offset.right = bar.sideGraphic.width + bar.sideGraphic.width * percLandscape;
    }
};
const getNotificationBar = function getNotificationBar() {
    if (availableNotificationBars.length <= 0) {
        createNotificationBar();
    }
    const bar = availableNotificationBars.shift();
    Interface.activeNotificationBars.push(bar);
    return bar;
};
Interface.freeNotificationBars = () => {
    allNotificationBars.forEach(bar => {
        bar.hasSideGraphic = false;
        bar.background.visible = false;
        bar.text.visible = false;
        bar.text.textVerticalAlign = 'center';
        bar.text.lineHeight = 1;
        bar.button.visible = false;
        bar.buttonAttention.visible = false;
        bar.button2.visible = false;
        bar.button3.visible = false;
        bar.buttonGraphic.visible = false;
        bar.sideGraphic.visible = false;
        bar.buttonGraphic.pivot.x = 0.5;
        bar.buttonGraphic.anchor.x = ThreeUI.anchors.center;
        bar.button2Graphic.visible = false;
        bar.button3Graphic.visible = false;
        bar.doubleHeight = false;
        bar.tripleHeight = false;
        bar.buttonMargin = undefined;
        bar.button.x = 0;
        bar.button.y = 0;
        bar.button.pivot.x = 0.5;
        bar.button.anchor.x = ThreeUI.anchors.right;
        bar.button2.y = 0;
        bar.button2.pivot.x = 0.5;
        bar.button3.y = 0;
        bar.button3.pivot.x = 0.5;
        bar.amountOfButtons = 0;
        bar.button.removeEventListeners('click');
        bar.button2.removeEventListeners('click');
        bar.button3.removeEventListeners('click');
    });
    availableNotificationBars = allNotificationBars.slice();
    Interface.activeNotificationBars = [];
    Interface.playButton.navigateOnTop = null;
};
Interface.notificationBar = (text, type, callback, skipDelay) => {
    const bar = getNotificationBar();
    bar.background.visible = false;
    bar.type = type;
    if (type === 'rewarded') {
        bar.position = 'top';
        bar.background.color = notificationBarColors.yellow;
        bar.button.setAssetPath('adToCoin.png');
        bar.button.defaultSprite = bar.button.assetPath;
        bar.button.blinkSprite = 'adToCoinBlink.png';
        bar.button.visible = true;
        bar.amountOfButtons = 1;
    } else if (type === 'coinstogo') {
        bar.position = 'bottom';
        bar.background.color = notificationBarColors.red;
    } else if (type === 'unlock') {
        bar.position = 'bottom';
        bar.background.color = notificationBarColors.red;
        bar.button.setAssetPath('CoinToChicken.png');
        bar.button.defaultSprite = bar.button.assetPath;
        bar.button.blinkSprite = 'coinToChickenBlink.png';
        bar.button.visible = true;
        bar.amountOfButtons = 1;
    } else if (type === 'upsell-notification') {
        bar.position = 'middle';
        bar.background.color = notificationBarColors.blue;
        bar.doubleHeight = true;
        bar.button.setAssetPath('button-info.png');
        bar.button.defaultSprite = bar.button.assetPath;
        bar.button.blinkSprite = 'button-info-blink.png';
        bar.button.visible = true;
        bar.hasSideGraphic = true;
        bar.sideGraphic.setAssetPath('sprites/trex.png');
        bar.sideGraphic.visible = true;
        bar.button.onClick(() => {
            bar.background.visible = false;
            analytics.track('promotion', 'notification_click');
            Interface.upsellWasClicked = true;
            Storage.setItem('upsellWasClicked', true);
            AppStoreInterstitial.lastUpsellScreen = 'game_over_notification';
            AppStoreInterstitial.show();
            Interface.ButtonSound();
            Interface.setupEndScreenKeyboardNavigation();
        });
        bar.buttonAttention.visible = true;
        bar.amountOfButtons = 1;
    } else if (type === 'tryout-characters') {
        bar.background.color = notificationBarColors.blue;
        bar.tripleHeight = true;
        bar.button.visible = true;
        bar.button2.visible = true;
        bar.button3.visible = true;
        bar.buttonMargin = 30;
        bar.button.setAssetPath('button-tryout.png');
        bar.button2.setAssetPath('button-tryout.png');
        bar.button3.setAssetPath('button-tryout.png');
        bar.buttonGraphic.visible = true;
        bar.button2Graphic.visible = true;
        bar.button3Graphic.visible = true;
        bar.buttonGraphic.setAssetPath('sprites/cat.png');
        bar.button2Graphic.setAssetPath('sprites/duck.png');
        bar.button3Graphic.setAssetPath('sprites/robot.png');
        bar.button.onClick(() => {
            Interface.ButtonSound();
            CharacterTryouts.startTryout('cat', 2);
            Game.wipeAndRestart();
        });
        bar.button2.onClick(() => {
            Interface.ButtonSound();
            CharacterTryouts.startTryout('duck', 2);
            Game.wipeAndRestart();
        });
        bar.button3.onClick(() => {
            Interface.ButtonSound();
            CharacterTryouts.startTryout('robot', 2);
            Game.wipeAndRestart();
        });
        bar.amountOfButtons = 3;
    } else if (type === 'tryout-buy') {
        const characterIndex = Object.keys(Game.characters).indexOf(CharacterTryouts.isTryingOut);
        const character = Carousel.characters[Game.currentWorld][characterIndex];
        text = character.fullName;
        bar.background.color = notificationBarColors.blue;
        bar.doubleHeight = true;
        bar.amountOfButtons = 1;
        bar.button.visible = true;
        bar.buttonGraphic.visible = true;
        bar.buttonGraphic.setAssetPath(`sprites/${character.charName}.png`);
        if (Carousel.hasEnoughCoinsForCharacter()) {
            bar.button.setAssetPath('purchase-wide.png');
            bar.button.onClick(() => {
                Interface.ButtonSound();
                Carousel.roundsSinceBuyingCharacter = 0;
                GameSave.ModifyCoins(-Carousel.charactCost);
                GameSave.UnlockCharacter(characterIndex);
                CharacterTryouts.characterPreTryouts = character.charName;
                CharacterTryouts.resetTryout();
                Game.wipeAndRestart();
            });
        } else {
            bar.button.setAssetPath('purchase-wide-gray.png');
        }
    } else if (type === 'tryout-rounds-left') {
        bar.background.color = notificationBarColors.red;
    } else if (type === 'tryout-app-store') {
        bar.background.color = notificationBarColors.blue;
        bar.doubleHeight = true;
        bar.button.visible = true;
        bar.button.setAssetPath('button-tryout.png');
        bar.buttonGraphic.visible = true;
        bar.buttonGraphic.setAssetPath('sprites/trex.png');
        bar.button.onClick(() => {
            Interface.ButtonSound();
            CharacterTryouts.startTryout('trex', 2, true);
            Game.wipeAndRestart();
        });
        bar.amountOfButtons = 1;
        text = 't-rex';
    } else if (type === 'tryout-app-store-promo') {
        bar.background.color = notificationBarColors.blue;
        bar.doubleHeight = true;
        bar.button.setAssetPath('upsell-android.png');
        bar.button2.setAssetPath('upsell-ios.png');
        bar.button3.setAssetPath('upsell-windows.png');
        bar.button.visible = true;
        bar.button2.visible = true;
        bar.button3.visible = true;
        bar.button.onClick(() => {
            Interface.ButtonSound();
            Interface.SellUp(googleUrl);
        });
        bar.button2.onClick(() => {
            Interface.ButtonSound();
            Interface.SellUp(appleUrl);
        });
        bar.button3.onClick(() => {
            Interface.ButtonSound();
            Interface.SellUp(windowsUrl);
        });
        bar.amountOfButtons = 3;
        bar.buttonGraphic.visible = true;
        bar.buttonGraphic.setAssetPath('sprites/trex.png');
        text = 'play more in the app';
    } else if (type === 'free-gift') {
        bar.position = 'middle';
        bar.background.color = notificationBarColors.orange;
        bar.button.setAssetPath('free-gift.png');
        bar.button.defaultSprite = bar.button.assetPath;
        bar.button.blinkSprite = 'free-gift-orange.png';
        if (callback) {
            bar.button.visible = true;
        }
    }
    bar.type = type;
    if (text) {
        bar.text.visible = true;
        bar.text.text = text;
    }
    if (typeof callback === 'function') {
        bar.button.onClick(() => {
            Interface.ButtonSound();
            callback();
        });
    }
    scaleNotificationBar(bar);
    slideIn(bar, skipDelay);
    return bar;
};
Interface.setupEndScreenKeyboardNavigation = () => {
    Game.UI.MoveToFront(KeyboardUIControls.reticle);
    Interface.playButton.navigateOnTop = null;
    Interface.activeButtons = [];
    Interface.activeNotificationBars.forEach(({ button, buttonAttention }, idx) => {
        if (button.visible) {
            Interface.activeButtons.push(button);
        }
        if (buttonAttention._visible) {
            Game.UI.MoveToFront(buttonAttention);
        }
    });
    Interface.activeButtons.forEach((button, idx) => {
        if (idx > 0) {
            button.navigateOnTop = Interface.activeButtons[idx - 1];
        } else {
            button.navigateOnTop = null;
        }
        if (idx < Interface.activeButtons.length - 1) {
            button.navigateOnBottom = Interface.activeButtons[idx + 1];
        } else {
            button.navigateOnBottom = () => {
                if (Interface.playButton.y > 0 && Interface.playButton.visible) {
                    return Interface.playButton;
                }
                return null;
            };
            Interface.playButton.navigateOnTop = button;
        }
    });
};
Interface.coinsWereModified = () => {
    Interface.activeNotificationBars.forEach(({ type, background }) => {
        if (type === 'coinstogo') {
            background.visible = false;
        }
    });
};
Interface.slideNewText = (bar, newText) => {
    bar.shakeMe = false;
    new TWEEN.Tween(bar.contentAnimator).to({
        x: bar.background.width
    }, 250).easing(TWEEN.Easing.Sinusoidal.InOut).onComplete(() => {
        bar.contentAnimator.x = -bar.background.width;
        bar.button.visible = false;
        bar.text.text = newText;
        scaleNotificationBar(bar);
        new TWEEN.Tween(bar.contentAnimator).to({
            x: 0
        }, 250).easing(TWEEN.Easing.Sinusoidal.InOut).start();
        Interface.focusFirstNotificationBar();
        Interface.setupEndScreenKeyboardNavigation();
    }).start();
};
export default Interface;