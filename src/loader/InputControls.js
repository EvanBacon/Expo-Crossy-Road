import * THREE from 'three';

import * as AudioManager from './AudioManager';
import Carousel from './Carousel';
import Game from './Game';
import Interface from './Interface';
import KeyboardHint from './KeyboardHint';
import KeyboardUIControls from './KeyboardUIControls';


function onDocumentTouchEnd({ changedTouches, clientX, clientY }) {
    prevXMove = null;
    if (window.isMobile) {
        var xUp = changedTouches[0].clientX;
        var yUp = changedTouches[0].clientY;
    } else {
        var xUp = clientX;
        var yUp = clientY;
    }
    if (Game.takesUserInput && Game.paused) {
        Game.playerController.nextPlayerAction = '';
        Interface.unPause();
        return;
    }
    if (Interface.CurrentScreen === 'selectingCharacter') {
        Carousel.ProcessTouchEnd();
        return;
    }
    if (Game.playerController.nextPlayerAction == 'none') {
        return;
    }
    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;
    if (Math.abs(xDiff) < 10 && Math.abs(yDiff) < 10) {
        InputControls.forward(true);
        return;
    }
    if (Math.abs(xDiff) > Math.abs(yDiff) * 1.1) {
        if (xDiff > 0) {
            left(true);
        } else {
            right(true);
        }
    } else {
        if (yDiff > 0) {
            InputControls.forward(true);
        } else {
            back(true);
        }
    }
    xDown = null;
    yDown = null;
}

function onDocumentTouchMove(event) {
    if (isMobile) {
        event.preventDefault();
    }
    const xUp = event.touches[0].clientX;
    const yUp = event.touches[0].clientY;
    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;
    if (Interface.CurrentScreen == "selectingCharacter") {
        const xMove = event.touches[0].clientX;
        if (prevXMove === null) {
            prevXMove = xMove;
        }
        const xMovement = xMove - prevXMove;
        Carousel.ProcessTouchMove(xMovement, event.touches[0].clientY);
        prevXMove = xMove;
        return;
    }
    if (!xDown || !yDown || !Game.playing) {
        return;
    }
    if (Math.abs(xDiff) > Math.abs(yDiff) * 1.1) {
        if (xDiff > 0) {
            left(false);
        } else {
            right(false);
        }
    } else {
        if (yDiff > 0) {
            InputControls.forward(false);
        } else {
            back(false);
        }
    }
}

function onDocumentTouchStart({ touches, clientX, clientY }) {
    if (window.isMobile) {
        xDown = touches[0].clientX;
        yDown = touches[0].clientY;
    } else {
        xDown = clientX;
        yDown = clientY;
    }
    if (Game.playing) {
        InputControls.forward(false);
    }
    if (Interface.CurrentScreen === 'selectingCharacter') {
        Carousel.ProcessTouchStart();
    }
}

function onDocumentKeyDown(event) {
    event.preventDefault();
    AudioManager.enableAudio();
    if (!Game.takesUserInput) {
        return;
    }
    if (keyMustWaitUntilUp[event.keyCode]) {
        return;
    }
    keyMustWaitUntilUp[event.keyCode] = true;
    let keySpacebar = false;
    let keyEnter = false;
    let keyLeft = false;
    let keyRight = false;
    let keyTop = false;
    let keyBottom = false;
    let keyExit = false;
    switch (event.keyCode) {
        case 32:
            keySpacebar = true;
            break;
        case 13:
            keyEnter = true;
            break;
        case 87:
        case 38:
            keyTop = true;
            break;
        case 65:
        case 37:
            keyLeft = true;
            break;
        case 83:
        case 40:
            keyBottom = true;
            break;
        case 68:
        case 39:
            keyRight = true;
            break;
        case 27:
            keyExit = true;
            break;
    }
    KeyboardHint.keyPressed(keySpacebar, keyLeft, keyTop, keyRight, keyBottom);
    if (Game.paused || event.keyCode === 80) {
        return;
    }
    if (!Game.playing || Game.playerController.Dead) {
        KeyboardUIControls.handleKeyEvent(event);
        return;
    }
    keyMustWaitUntilUp[event.keyCode] = false;
    if (event.keyCode === 32) {
        InputControls.forward(false);
    }
    switch (event.keyCode) {
        case 87:
        case 38:
            InputControls.forward(false);
            return;
            break;
        case 65:
        case 37:
            left(false);
            return;
            break;
        case 83:
        case 40:
            back(false);
            return;
            break;
        case 68:
        case 39:
            right(false);
            return;
            break;
    }
}

function back(finished) {
    if (finished) {
        Game.playerController.checkBump = true;
        Game.playerController.nextPlayerAction = "back";
        Game.playerController.moved = true;
        if (isMobile) {
            Game.playerController.SetDesiredRotationForDirection("back");
        }
    } else {
        if (!isMobile) {
            Game.playerController.SetDesiredRotationForDirection("back");
        }
        Game.playerController.nextPlayerAction = "Down";
    }
}

function right(finished) {
    if (finished) {
        Game.playerController.checkBump = true;
        Game.playerController.nextPlayerAction = "right";
        Game.playerController.moved = true;
        if (isMobile) {
            Game.playerController.SetDesiredRotationForDirection("right");
        }
    } else {
        if (!isMobile) {
            Game.playerController.SetDesiredRotationForDirection("right");
        }
        Game.playerController.nextPlayerAction = "Down";
    }
}

function left(finished) {
    if (finished) {
        Game.playerController.checkBump = true;
        Game.playerController.nextPlayerAction = "left";
        Game.playerController.moved = true;
        if (isMobile) {
            Game.playerController.SetDesiredRotationForDirection("left");
        }
    } else {
        if (!isMobile) {
            Game.playerController.SetDesiredRotationForDirection("left");
        }
        Game.playerController.nextPlayerAction = "Down";
    }
}

function onDocumentKeyUp(event) {
    event.preventDefault();
     AudioManager.enableAudio();
    keyMustWaitUntilUp[event.keyCode] = false;
    if (!Game.takesUserInput) {
        return;
    }
    if (event.keyCode == 80 || Game.paused) {
        Interface.TogglePause();
        return;
    }
    if (!Game.playing) {
        return;
    }
    if (event.keyCode === 32) {
        InputControls.forward(true);
    }
    if (Interface.CurrentScreen === 'selectingCharacter') {
        return;
    }
    switch (event.keyCode) {
        case 87:
        case 38:
            InputControls.forward(true);
            break;
        case 65:
        case 37:
            left(true);
            break;
        case 83:
        case 40:
            back(true);
            break;
        case 68:
        case 39:
            right(true);
            break;
    }
}

module.exports.onDocumentKeyUp = onDocumentKeyUp;
module.exports.onDocumentKeyDown = onDocumentKeyDown;
module.exports.onDocumentTouchStart = onDocumentTouchStart;
module.exports.onDocumentTouchMove = onDocumentTouchMove;
module.exports.onDocumentTouchEnd = onDocumentTouchEnd;

var InputControls = {};
var keyMustWaitUntilUp = {};

InputControls.forward = finished => {
    if (finished) {
        Game.playerController.checkBump = true;
        Game.playerController.nextPlayerAction = "forward";
        Game.playerController.moved = true;
        if (isMobile) {
            Game.playerController.SetDesiredRotationForDirection("forward");
        }
    } else {
        if (!isMobile) {
            Game.playerController.SetDesiredRotationForDirection("forward");
        }
        Game.playerController.nextPlayerAction = "Down";
    }
};
var xDown = null;
var yDown = null;;
var prevXMove = null;;
export default InputControls;