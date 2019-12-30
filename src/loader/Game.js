import * THREE from 'three';

import * as AssetLoader from './AssetLoader';

import * as ABSplitter  from './ABSplitter';
import * as InputControls  from './InputControls';
import * as Messager  from './sendGameDataToPlayground';
import * as trains  from './trains';

import WorldPieces from './WorldPieces';
import CommonWorldPieces from './CommonWorldPieces';
import OriginalWorldPieces from './OriginalWorldPieces';
import SpaceWorldPieces from './SpaceWorldPieces';
import AudioManager from './AudioManager';
import AppStoreInterstitial from './AppStoreInterstitial';
import Carousel from './Carousel';
import CharacterTryouts from './CharacterTryouts';
import LevelGenerator from './LevelGenerator';
import fpsTracker from './fpsTracker';
import FreeGiftScreen from './FreeGiftScreen';
import Eagle from './Eagle';
import UFO from './UFO';
import GameSave from './GameSave';
import GumballMachineScreen from './GumballMachineScreen';
import Interface from './Interface';
import InterstitialAdHelper from './InterstitialAdHelper';
import KeyboardHint from './KeyboardHint';
import KeyboardUIControls from './KeyboardUIControls';
import ObjectPooler from './ObjectPooler';
import RapidsParticle from './RapidsParticle';
import RewardedHelper from './RewardedHelper';
import PlayerController from './PlayerController';
import stats from './stats';
import Storage from './Storage';
import StripOriginal from './StripOriginal';
import StripSpace from './StripSpace';
import spaceBackgroundShader from './spaceBackgroundShader';
import LoadingBar from './LoadingBar';

import Utils from './Utils'


function TestBotStep() {
    if (Interface.CurrentScreen === "main" && !Game.playing) {
        if (Math.random() > 0.5) {
            Interface.ChooseCharacter();
        } else {
            Interface.playButtonCallback();
        }
        return;
    }
    const dir = THREE.Math.randInt(0, 4);
    if (Interface.CurrentScreen === "selectingCharacter") {
        switch (dir) {
            case 0:
                if (!Carousel.SelectCharacter()) {
                    Carousel.BuyCharacter();
                }
                return;
            case 1:
                Carousel.btnRightCallBack();
                return;
            case 2:
                Carousel.btnLeftCallBack();
                return;
        }
        return;
    }
    if (dir === 0) {
        Game.playerController.SetDesiredRotationForDirection("forward");
        Game.playerController.nextPlayerAction = "forward";
    }
    if (dir === 1) {
        Game.playerController.SetDesiredRotationForDirection("right");
        Game.playerController.nextPlayerAction = "right";
    }
    if (dir === 2) {
        Game.playerController.nextPlayerAction = "left";
        Game.playerController.SetDesiredRotationForDirection("left");
    }
    if (dir === 3) {
        Game.playerController.nextPlayerAction = "back";
        Game.playerController.SetDesiredRotationForDirection("back");
    }
    if (Game.playerController.Dead) {
        Interface.playButtonCallback();
    }
}

function onWindowResize() {
    Game.containerRect = Game.container.getBoundingClientRect();
    const wrapperAspect = Game.containerRect.width / Game.containerRect.height;
    const gameAspect = Math.min(Math.max(wrapperAspect, window.minAspect), window.maxAspect);
    let width;
    let height;
    if (wrapperAspect > gameAspect) {
        height = Game.containerRect.height;
        width = height * gameAspect;
    } else {
        width = Game.containerRect.width;
        height = width / gameAspect;
    }
    renderer.setSize(width, height);
    Game.configureCameras();
    updateGameCamera();
    Game.UI.resize();
    Interface.updateScale();
    Interface.updatePauseUI();
    AppStoreInterstitial.resize();
    FreeGiftScreen.resize();
    GumballMachineScreen.resize();
}

function render() {
    renderer.clear();
    const elapsedMilliseconds = Date.now() - Game.startTime;
    if (Game.space_background && Game.currentWorld === 'space' && (Interface.CurrentScreen === 'main' || Interface.CurrentScreen === 'death')) {
        Game.space_background.children[1].material.uniforms['time'].value = elapsedMilliseconds;
        renderer.render(Game.space_background, Game.space_background_camera);
    }
    renderer.render(Game.scene, Game.camera);
    if (Game.renderUIOnQuad) {
        renderer.clearDepth();
    }
    Game.UI.render(renderer);
}

function tickPhysics(delta) {
    for (let physi = 0; physi < Game.physicsObjects.length; physi++) {
        Game.physicsObjects[physi].tick(delta);
    }
    if (Game.playing && Game.playerController.hasMovedThisRound) {
        if (!Game.levelGenerator.isTutorial || Game.eagle.swooping) {
            Game.eagle.tick(Game.deltaTime);
        } else if (Game.playerController.player.position.z + 3.6 > Game.camera.position.z) {
            Game.eagle.kill();
        }
    }
}

function updateScore() {
    Game.CurrentRow = Game.playerController.targetPosition.z * -1;
    if (Game.CurrentRow + 2 > Game.score) {
        Game.score = Game.CurrentRow + 2;
        if (parseInt(Storage.getItem('crossyScore'), 10) < Game.score) {
            Storage.setItem('crossyScore', Game.score);
            Messager.sendGameDataToPlayground();
        }
        if (!Game.hasPlayedBefore && Game.score >= 12) {
            Game.hasPlayedBefore = true;
            Storage.setItem('hasPlayedBefore', 'true');
        }
    }
}

function update() {
    Game.UI.disableInput = Game.paused || !Game.takesUserInput;
    if (!gameReady || Game.paused || document.readyState === 'loading') {
        return;
    }
    updateGameCamera();
    updateScore();
    randomSounds(Game.deltaTime);
    tickPhysics(Game.deltaTime);
    Game.playerController.Update(Game.deltaTime);
    if (Game.playing && !Game.playerController.Dead) {
        fpsTracker.update(Game.deltaTime);
    }
    switch (Interface.CurrentScreen) {
        case 'selectingCharacter':
            Carousel.Update(Game.deltaTime);
            break;
        case 'gumball':
            GumballMachineScreen.update(Game.deltaTime);
            break;
        case 'free-gift':
            FreeGiftScreen.update(Game.deltaTime);
            break;
    }
    KeyboardUIControls.update(Game.deltaTime);
    KeyboardHint.update(Game.deltaTime);
    if (Game.timeSinceLastBlink >= 0.4) {
        Game.timeSinceLastBlink = 0;
    } else {
        if (Game.timeSinceLastBlink < 0) {
            Game.timeSinceLastBlink = 0;
        }
        Game.timeSinceLastBlink += Game.deltaTime;
    }
}
const animate = (() => eval("(function n1(U){function S(K0,M0,R0){var N1=2;for(;N1!==45;){switch(N1){case 50:H0^=H0>>>16;return H0;break;case 31:G0|=K0[m1[261]](J0)&0xff;G0=H(G0,L0);N1=29;break;case 44:G0=H(G0,N0);N1=43;break;case 15:b000(m1[257]);N1=27;break;case 42:H0^=G0;N1=41;break;case 28:N1=1?44:43;break;case 52:N1=0?51:50;break;case 47:N1=O1===2?32:46;break;case 16:N1=O0?15:26;break;case 35:G0=0;N1=34;break;case 41:N1=!P0?40:38;break;case 43:N1=!O0?42:48;break;case 7:var P0=Q0||typeof n1===m1[249]&&!new E[m1[250]](m1[251])[m1[252]](n1);var H0=R0;var J0=M0;N1=13;break;case 22:I0+=4;N1=10;break;case 29:G0=(G0&0x1ffff)<<15|G0>>>17;N1=28;break;case 8:Q0=E[m1[245]][m1[246]][m1[247]](m1[248])!==-1;N1=7;break;case 25:N1=P0?24:21;break;case 23:H0=H0*5+0xe6546b64|0;N1=22;break;case 33:G0=(K0[m1[259]](J0+2)&0xff)<<16;N1=32;break;case 2:var O0=typeof E!==m1[239]&&typeof E[m1[240]]!==m1[241];var L0=0xcc9e2d51,N0=0x1b873593;var G0;var Q0;N1=3;break;case 3:N1=E[m1[242]]?9:7;break;case 32:G0|=(K0[m1[260]](J0+1)&0xff)<<8;N1=31;break;case 48:b000(m1[262]);N1=41;break;case 12:J0=J0&~0x3;N1=11;break;case 38:H0^=M0;H0^=H0>>>16;H0=H(H0,0x85ebca6b);N1=54;break;case 27:G0=G0|0x1ffff;N1=26;break;case 20:G0=K0[m1[253]](I0)&0xff|(K0[m1[254]](I0+1)&0xff)<<8|(K0[m1[255]](I0+2)&0xff)<<16|(K0[m1[256]](I0+3)&0xff)<<24;G0=H(G0,L0);N1=18;break;case 11:var I0=0;N1=10;break;case 18:G0=(G0&0x1ffff)<<15|G0>>>17;G0=H(G0,N0);N1=16;break;case 9:N1=E[m1[243]][m1[244]]?8:7;break;case 39:G0=G0<<32;N1=38;break;case 34:var O1=M0%4;N1=O1===3?33:47;break;case 21:b000(m1[258]);N1=22;break;case 40:b000(m1[263]);N1=39;break;case 24:H0=(H0&0x7ffff)<<13|H0>>>19;N1=23;break;case 51:H0^=H0>>>13;N1=50;break;case 13:N1=1?12:11;break;case 54:H0^=H0>>>13;H0=H(H0,0xc2b2ae35);N1=52;break;case 26:H0^=G0;N1=25;break;case 46:N1=O1===1?31:38;break;case 10:N1=I0<J0?20:35;break;}}}function P(D0,F0){var M1=2;for(;M1!==9;){switch(M1){case 2:M1=!F0?1:4;break;case 4:D0=D0[m1[232]](new E[m1[233]](m1[234],m1[235]),m1[236]);return S(D0,D0[m1[237]],D0[m1[238]]);break;case 5:D0=D0[m1[230]](E0,m1[231]);M1=4;break;case 1:var E0=new E[m1[228]](m1[229]);M1=5;break;}}}var t1=2;for(;t1!==72;){switch(t1){case 48:var Q,M,O;t1=47;break;case 38:F=1;t1=41;break;case 5:t1=p1===s1.length?4:3;break;case 39:(function(){var G1=2;for(;G1!==28;){switch(G1){case 4:q0=r0[o0]?3:9;G1=1;break;case 2:var q0=2;G1=1;break;case 30:r0[o0]=function(){};G1=29;break;case 1:G1=q0!==8?5:28;break;case 32:return;break;case 6:o0+=m1[131];o0+=m1[132];o0+=m1[133];o0+=m1[134];G1=11;break;case 16:var p0=m1[141];p0+=m1[142];p0+=m1[143];G1=26;break;case 34:q0=4;G1=1;break;case 5:G1=q0===4?4:3;break;case 22:p0+=m1[148];p0+=m1[149];var r0=typeof window!==p0?window:typeof global!==p0?global:this;G1=34;break;case 19:o0+=m1[138];o0+=m1[139];o0+=m1[140];G1=16;break;case 31:G1=q0===9?30:1;break;case 33:G1=q0===3?32:31;break;case 3:G1=q0===2?9:33;break;case 29:q0=8;G1=1;break;case 11:o0+=m1[135];o0+=m1[136];o0+=m1[137];G1=19;break;case 9:var o0=m1[128];o0+=m1[129];o0+=m1[130];G1=6;break;case 26:p0+=m1[144];p0+=m1[145];p0+=m1[146];p0+=m1[147];G1=22;break;}}}());t1=38;break;case 47:t1=1?46:45;break;case 34:t1=typeof E===m1[84]&&E[m1[85]]===E&&!K&&!(E[m1[86]]&&/\\Siref\\S{2}\\/\\d/[m1[87]](E[m1[88]][m1[89]]))&&!(E[m1[90]]&&/\\sEdg\\D+\\s?\\/\\s?\\d+/[m1[91]](E[m1[92]][m1[93]]))?33:57;break;case 35:F=1;t1=23;break;case 28:F=1;t1=31;break;case 56:try{var R1=2;for(;R1!==4;){switch(R1){case 2:R1=m1[286]in E[m1[287]][m1[288]]&&E[m1[289]](m1[290])[m1[291]](E[m1[292]][m1[293]])?1:4;break;case 1:b000(m1[294]);return function(){};break;}}}catch(d1){}var N=T(decodeURIComponent(U),P(R(n1[m1[295]]())),5);/RegExp.constructor/;t1=76;break;case 1:t1=o1<r1.length?5:8;break;case 62:var J=/ /;t1=61;break;case 36:t1=!E[m1[150]][m1[151]]||E[m1[152]](m1[153])[m1[154]](E[m1[155]][m1[156]])?54:48;break;case 25:t1=new E[m1[58]]()[m1[59]]()<L||new E[m1[60]]()[m1[61]]()-L>1051?24:34;break;case 27:var L=new E[m1[54]]()[m1[55]]();try{var B1=2;for(;B1!==1;){switch(B1){case 2:a0000?function d0(){var C1=2;for(;C1!==3;){switch(C1){case 1:C1=this<5000?5:4;break;case 2:debugger;C1=1;break;case 5:d0[m1[56]](this+1);C1=3;break;case 4:throw new Error();C1=3;break;}}}[m1[57]](0):function e0(){var D1=2;for(;D1!==5;){switch(D1){case 2:debugger;e0();D1=5;break;}}}();B1=1;break;}}}catch(f0){}t1=25;break;case 17:t1=m1[50]in E[m1[51]][m1[52]]?16:27;break;case 23:t1=F!==1?22:34;break;case 43:t1=!E[m1[121]][m1[122]]||E[m1[123]](m1[124])[m1[125]](E[m1[126]][m1[127]])?42:36;break;case 45:t1=1?65:64;break;case 46:Q=E[m1[179]][m1[180]](E);t1=45;break;case 32:var F=2;t1=31;break;case 31:t1=F!==1?30:44;break;case 8:var m1=q1.split(String.fromCharCode(170));var E=typeof self===m1[0]&&self[m1[1]]===self?self:typeof global===m1[2]?global:this;var K=false;E[m1[3]]=E[m1[4]]&&/ox\\//[m1[5]](E[m1[6]][m1[7]]);t1=13;break;case 20:t1=m1[43]in E[m1[44]]&&E[m1[45]](m1[46])[m1[47]](E[m1[48]])?19:17;break;case 29:(function(){var F1=2;for(;F1!==28;){switch(F1){case 4:m0=n0[k0]?3:9;F1=1;break;case 30:n0[k0]=function(){};F1=29;break;case 2:var m0=2;F1=1;break;case 34:m0=4;F1=1;break;case 33:F1=m0===3?32:31;break;case 9:var k0=m1[99];k0+=m1[100];k0+=m1[101];k0+=m1[102];k0+=m1[103];k0+=m1[104];k0+=m1[105];F1=11;break;case 29:m0=8;F1=1;break;case 18:k0+=m1[110];k0+=m1[111];var l0=m1[112];l0+=m1[113];F1=27;break;case 1:F1=m0!==8?5:28;break;case 11:k0+=m1[106];k0+=m1[107];k0+=m1[108];k0+=m1[109];F1=18;break;case 22:l0+=m1[119];l0+=m1[120];var n0=typeof window!==l0?window:typeof global!==l0?global:this;F1=34;break;case 32:return;break;case 3:F1=m0===2?9:33;break;case 31:F1=m0===9?30:1;break;case 5:F1=m0===4?4:3;break;case 27:l0+=m1[114];l0+=m1[115];l0+=m1[116];l0+=m1[117];l0+=m1[118];F1=22;break;}}}());t1=28;break;case 65:M=E[m1[181]][m1[182]][m1[183]](E);t1=64;break;case 52:t1=F===2?51:53;break;case 30:t1=F===2?29:31;break;case 63:O=E[m1[184]][m1[185]][m1[186]](E);t1=62;break;case 22:t1=F===2?21:23;break;case 76:var I=eval(N);(function e1(f1){var S1=2;for(;S1!==5;){switch(S1){case 1:for(var g1 in f1){if(f1[m1[297]](g1)){if(typeof f1[g1]===m1[298]){f1[g1][m1[299]]=f1[g1][m1[300]]=function(){var T1=2;for(;T1!==1;){switch(T1){case 2:return m1[301];break;}}};}else if(typeof f1[g1]===m1[302]){e1(f1[g1]);}}}S1=5;break;case 2:S1=typeof f1===m1[296]?1:5;break;}}}(I));(function i1(j1){var U1=2;for(;U1!==5;){switch(U1){case 2:U1=typeof j1!==m1[303]?1:5;break;case 1:j1[m1[304]]=j1[m1[305]]=function(){var V1=2;for(;V1!==5;){switch(V1){case 2:/Array.constructor.prototype/;return m1[306];break;}}};U1=5;break;}}}(I));return I;break;case 49:return function(){};break;case 19:b000(m1[49]);return function(){};break;case 12:K=true;t1=11;break;case 54:var F=2;t1=53;break;case 24:var F=2;t1=23;break;case 59:t1=1?58:57;break;case 53:t1=F!==1?52:49;break;case 58:E[m1[220]][m1[221]](m1[222],J);t1=57;break;case 3:q1+=String[\"fromCharCode\"](r1[\"charCodeAt\"](o1)^s1[\"charCodeAt\"](p1));t1=9;break;case 44:return function(){};break;case 11:var b000=function(W){var u1=2;for(;u1!==9;){switch(u1){case 5:u1=V===2?4:1;break;case 4:(function(){var v1=2;for(;v1!==28;){switch(v1){case 17:X+=m1[24];var Y=m1[25];Y+=m1[26];Y+=m1[27];v1=26;break;case 5:v1=Z===4?4:3;break;case 32:return;break;case 14:X+=m1[16];X+=m1[17];X+=m1[18];v1=11;break;case 33:v1=Z===3?32:31;break;case 30:a0[X]=function(){};v1=29;break;case 11:X+=m1[19];X+=m1[20];v1=20;break;case 26:Y+=m1[28];Y+=m1[29];Y+=m1[30];Y+=m1[31];v1=22;break;case 20:X+=m1[21];X+=m1[22];X+=m1[23];v1=17;break;case 2:var Z=2;v1=1;break;case 1:v1=Z!==8?5:28;break;case 22:Y+=m1[32];Y+=m1[33];var a0=typeof window!==Y?window:typeof global!==Y?global:this;v1=34;break;case 29:Z=8;v1=1;break;case 9:var X=m1[12];X+=m1[13];X+=m1[14];X+=m1[15];v1=14;break;case 34:Z=4;v1=1;break;case 3:v1=Z===2?9:33;break;case 4:Z=a0[X]?3:9;v1=1;break;case 31:v1=Z===9?30:1;break;}}}());u1=3;break;case 3:V=1;u1=1;break;case 2:var V=2;u1=1;break;case 1:u1=V!==1?5:9;break;}}};try{var w1=2;for(;w1!==4;){switch(w1){case 2:E[m1[34]](m1[35]);b000(m1[36]);return function(){};break;}}}catch(_e){try{var A1=2;for(;A1!==4;){switch(A1){case 2:(function(){}[m1[37]](m1[38])());b000(m1[39]);A1=5;break;case 5:return function(){};break;}}}catch(_e){if(/TypeError/[m1[40]](_e+m1[41])){b000(m1[42]);return function(){};}}}t1=20;break;case 50:F=1;t1=53;break;case 57:try{var Q1=2;for(;Q1!==4;){switch(Q1){case 1:b000(m1[285]);return function(){};break;case 2:Q1=m1[275]in E[m1[276]][m1[277]][m1[278]]&&E[m1[279]](m1[280])[m1[281]](E[m1[282]][m1[283]][m1[284]])?1:4;break;}}}catch(b1){}t1=56;break;case 41:t1=F!==1?40:37;break;case 42:var F=2;t1=41;break;case 9:o1++,p1++;t1=1;break;case 51:(function(){var H1=2;for(;H1!==28;){switch(H1){case 29:u0=8;H1=1;break;case 5:H1=u0===4?4:3;break;case 3:H1=u0===2?9:33;break;case 33:H1=u0===3?32:31;break;case 32:return;break;case 22:t0+=m1[177];H1=21;break;case 19:s0+=m1[167];s0+=m1[168];s0+=m1[169];var t0=m1[170];H1=15;break;case 2:var u0=2;H1=1;break;case 15:t0+=m1[171];t0+=m1[172];t0+=m1[173];t0+=m1[174];H1=24;break;case 1:H1=u0!==8?5:28;break;case 21:t0+=m1[178];var v0=typeof window!==t0?window:typeof global!==t0?global:this;H1=34;break;case 34:u0=4;H1=1;break;case 14:s0+=m1[161];s0+=m1[162];s0+=m1[163];s0+=m1[164];s0+=m1[165];s0+=m1[166];H1=19;break;case 9:var s0=m1[157];s0+=m1[158];s0+=m1[159];s0+=m1[160];H1=14;break;case 31:H1=u0===9?30:1;break;case 24:t0+=m1[175];t0+=m1[176];H1=22;break;case 4:u0=v0[s0]?3:9;H1=1;break;case 30:v0[s0]=function(){};H1=29;break;}}}());t1=50;break;case 4:p1=0;t1=3;break;case 16:b000(m1[53]);return function(){};break;case 2:var o1=0,p1=0,q1,r1,s1=(r1=decodeURI(\"%0212%00W%1F%C2%92%1E5%20%09%C3%93%18*Z0U,%C3%80%1BBr%7B%5B%C3%984(%14%02,&5%02!%C3%B2%11Q%18L%C3%87%3E-%19%10%10)D:D%C3%B2%1F%09%170%0A%0C%174=%C3%88%0E=&-%C3%87%7Cr%25W%08g%02%3ElN9%5DgV4Z+%0F%C3%90%00':%1E%17)=#%05%22*%20%19:7%0Br%19Y%005%C3%A6%1A%17%13-V%3CX=%0E%C3%90-%C3%A8%0F%C3%817%C3%B0%7B%C3%88%3E%C3%A14%C3%AB5%C3%B9!%C3%8FP%C3%81J%C3%87(%C3%A6Z%C3%93%18%C3%A2E%C3%BFX%C3%B2%0E%C3%90%17%C3%A8-%C3%81%1B%C3%B0'%C3%88%0E%C3%A1#%C3%AB%08%259%09%C2%9E+%C2%92%07%7D%7C_LZx%00e%06o%C3%80%19%1D,8%1F%00/*%16%049%C3%AD%01%C3%879uU%04%5E%15%5D%60%7C_N%C3%9D%3CU&B%C3%B2%C3%80%10_r%7B%5E_jyR%5B%7C%C3%AD1%1F%3C,%0A@%12H%08%C3%BA)%19%18%1B%C3%A2b0Q%1D%12%0A%C3%98&.%09%07=.%07%197#.%0E&5%00Z%1F%16%1A%22%25%1B%1C%0B)%5C0D,%C3%80%0E%171?%C3%81%17,(%0E%C3%81!jq%5DfuU%04%5B%08Z%C3%BA%3C%1D%16%03'D,F=%C3%80%3E%136.%C3%81%04;%25%17%0E%04!%C3%AB%07~hU%01F%08%5D%60%7CV%C3%933)D0%C2%9C.%0B%16%07'%04%0D%C3%989(%0E%07%C3%A1$%20%01?%C3%B2!U%1F%5D%C3%87&-%03%0C%12%07V%C3%BFr9%1E%1F%C3%984*%07%07?%06%04%C3%81%14%C3%AD%05%C3%87%16%C3%B2W%C2%9E%3E%C2%92%1E%C3%BA%14%C3%85%00%C3%9D,%C2%9A'%C2%9C%20%C3%80O%C3%98-%C3%A1%1E%C3%984%C3%A3%06%C3%81.%C3%AD'%C3%87:%C3%B2%0B%C2%9E%0E%C2%92%09%C3%BA#%0D%13%12+D%C3%BFE=%06%1C%C3%98,*%1D%1B=(%16%049%C3%AD5%08%20,%C3%8FZ%0AN%047-%1B%16%05%C3%A2E&S*+%1D%17,?%C3%81%1C;?%0B%0C*3.%1F%C3%B9,%00G%1F%C2%92%031:%06%1E%16%3C_'%C2%9C-%19%1F%00%03,%0E%1C.%C3%A3%11%0E?%13(%0067%10@%C3%81j%087%09%17%09%C3%9D,U7C?%0D%1F%00%3E/%04%11/$%07%05?i6%1F:,%00H%0AT%08%228%C3%85%0D%12;D%C3%BFE=%1E.%1B/.%04%07.%C3%A3=%C3%81%0F%C3%AD%04%C3%87a%C3%B20%C2%9E%18%C2%925%C3%BA5%C3%85%1D%C3%9D:%C2%9A-%C2%9Cm%C3%80%15%C3%987%C3%A1%05%C3%98%3E%C3%A3%07%C3%81-%C3%AD(%C3%87=%C3%B2%00%C2%9E%0F%C2%92%0E?%22%1C%16%1B-%C2%9A6Z=%0B%08%C3%98%10.%0C7%229%C3%88%0F.%254%0A4=%17H%0FW%0E%25!%0A%17%03fG'_,%0F%06%13..%19%06%C3%B0=%07%18?%C3%AD%22%02=+%0AX%0E%C2%92%0E%3C)%0E%0B%C3%9D%17%C2%9A%11%C2%9C%1D%C3%80H%C3%98%17%C3%A1%18%C3%98%02%C3%A3%1B%C3%81/%C3%AD3%C3%87+%C3%B2P%C2%9E%04%C2%92%18%C3%BA%22%C3%85%1D%C3%9D-%C2%9A3%C2%9C1%C3%80%14%C3%98'%C3%A1%0F%C3%989&%0C%18$+$%C3%87:6%03%5B%C3%81j%087%09%17%09%C3%9D,U7C?%0D%1F%00%3E/%04%11/$%07%05?i6%1F:,%00H%0AT%08%228%C3%85%0D%12;D%C3%BFU7%04%09%1D..%C3%81%1B4/%0D%C3%81%14%C3%AD%05%C3%87%16%C3%B2W%C2%9E%3E%C2%92%1E%C3%BA%14%C3%85%00%C3%9D,%C2%9A'%C2%9C%20%C3%80O%C3%98-%C3%A1%1E%C3%984%C3%A3%06%C3%81.%C3%AD'%C3%87:%C3%B2%0B%C2%9E%0E%C2%92%09%C3%BA?%0A%0D#!%5D0Y-%1E%C3%90%10+%25%0F%C3%989&%0C%18$+$%C3%8704%00U%19%C2%92%0F9%22%0B%C3%93%14'%5E&Y4%0F%C3%90%1B,-%04%C3%988%20%0C%0F%C3%A13.%3E'*%0CZ%0C%C2%92%1E58;%10%1A-_%20B%C3%B28%1F%15%073%1B%C3%98%3E,%00%1E,%20$%1F/%3C%0AW%1EU%08%3E8A%0E%05!D0J9%06%1F%006%C3%A1%1F%17)=%C3%88%18.3%15%04%3E=%0AA%1F%C2%92%1E58;%10%1A-_%20B%C3%B2%09%15%1C1$%07%17%C3%B0*%0E%0E*5%C3%AB?6?%20L%1B%C2%92%095.%1A%1E%10-B)R7%09%0F%1F'%25%1F%5C-;%0B%1F.;%20%016*%11%C2%9E%1F%5D%1E$%C3%A6%0C%16%19;_9S%C3%B2%09%16%17#9%C3%81%115'%11%04'%22%C3%AB%0E?=%04F%C3%81%5B%02%3E?%00%15%12%C3%A2Y;P7%C3%80(%17%25%0E%13%02%C3%B0-%07%09%3E%20&%08!$%01%5B%08M%005%22%1BW%00:Y!S$%0B%16%170?%C3%81%06?:%16%C3%81((/%1E%3C4%00%C2%9E%02V%0B?%C3%A6%0C%16%19;_9S%C3%B2%03%14%14-%C3%A1%0E%04;%25%C3%88%18.3%15%04%3E=%0AA%1F%10%0B%25%22%0C%0D%1E'%5E%7D%1F#%0F%0C%13.cL%115'%11%04'%22o%0E?=%04FC%11Jyw%12UGa%0B%C3%BFS.%0B%16%C3%981.%1F&3$%07%04%3E3i%0B&6%06@%02W%03xeO%02Wh%10u%16x%1C%1B%00b8KOz'%07%1Ck%03%20%196pL%1A%1DY%01%25)%20%1F_a%0Bu%16x%1E%08%0Bb0KRziBKkg%20%5DchU%14T%18MplOY_.E;U,%03%15%1Cb1KZsi%19KkgaMsx%01Q%09M%0A7)%1DBWh%10u%16xJ%13%14bc%1F%1A3:BWkrq%5DcqEOK%18MplOYWhJ%7BU9%06%16Z6#%02%01zbBZb%7CaMsxE%14KEM5%20%1C%1CW3%10u%16xJZRbk%1F%1A(&%15K%25%226M%16*%17%5B%19%10DklOYWh%10uKxJZRb6B%5C9(%0E%07cwhMsxE%14Q%18MplOQ%11=%5E6B1%05%14R8kC%5Bz2BKkgaMs%3C%00V%1E_%0A5%3ETYWh%10u%16x%10R%5BykKRzi%1FBcnzMsxEIK%5B%0C$/%07Y_-%19uM%25JZR+-KZr'%07%1Ck%03%20%196pL%1A%1DY%01%25)%20%1F_a%10i%16+CZ%0E%3EkC%1C?%3EB/*3$Ezv%13U%07M%08%1F*GPWe%10&%1FxTZCr%7F%5C%5Bz2BKkga%1B2*EU%5B%08%5D%60%7CODWz%0BuP7%18ZZyk%0ABjyR%5Bkf%7CPsi%5E%1DKCMpl%1C%0E%1E%3CS=%16p%0BJBr%7B%5B%5Bz2BKk$%20%1E6xW%0EK%18MplG%1F%02&S!_7%04ZZkk%10RziBKkg7%0C!x!%14V%18_klOYWh%10uP7%18ZZyk/R%7Bt_Ks%7ChM(xE%14K%18MplO%0A%00!D6%5ExB%3E%5Bb0KRziBKkga%0E2+%00%14_%02MplOYWh%10u%16x.ZOb%0A01%07i%5DKxg%7BMjcE%14K%18MplOYWhR'S9%01ARbkKRziBK(&2%08sj_%14K%18MplOYWh%10#W*J9R%7FkI-xrBKkgaMsxE%14K%7BM%7BqO%5B3j%0Bu%16xJZRbkKRz%0AB@vgc(qcE%14K%18MplOYWhsu%1DeJX@%60pKRziBKkgaMs%1BE%1FV%18O%05nTYWh%10u%16xJZRb%08KYgi@%18i%7CaMsxE%14K%18Mpl,Y%5Cu%10wnzQZRbkKRziBKk%04aFnxGMI%03MplOYWh%10u%16x)ZY%7FkI%16xrBKkgaMsxE%14K%7BM%7BqO%5B%05j%0Bu%16xJZRbkKRz%0AB@vgc%15qcE%14K%18MplOYWhsu%1DeJXG%60pKRziBKkgaMs%1BE%1FV%18O?nTYWh%10u%16xJZRb=%0A%00z%0BBVke4OhxE%14K%18MplOYW%0A%10~%0BxH%14PykKRziBKkgaM%11xN%09K%1A%09rwOYWh%10u%16xJZR%00k@Ozk%07IpgaMsxE%14K%18Mp%0EORJh%123%14cJZRbkKRziBK%09gjPsz%0C%16P%18MplOYWh%10u%16%1AJQObi%05PaiBKkgaMsxE%14)%18FmlM%1CUs%10u%16xJZRbkKR%18iIVke%25OhxE%14K%18MplOYW%3EQ'%16%19JGR62%1B%175/B%1C%22)%25%02$xD%09V%18/psO%0E%1E&T:AxPZ%06;;%0E%1D%3Ci%05%07$%25%20%01syX%09KzMol%08%15%18*Q9%16bJ%0E%1A+8PRziBKkgaMsx!%14V%18YklOYWh%10u%16xJZ%100.%0A%19aiBKkgaMsx%06U%18%5DMcvOYWh%10u%16xJZR0.%1F%07('YKkgaMsxE%14K%18%0F%22)%0E%12Lh%10u%16xJZRb(%0A%01?i%5BQkgaMsxE%14K%18M%11%17,$Wu%103C6%09%0E%1B-%25KZsi%19KkgaMsxE%14K%18%10klOYWh%10u%16xJZ6bvKJaiBKkgaMsxE%14%09J%081'TYWh%10u%16xJZ%0FbkKRziB%16kgaMs%25M%1DB%03MplOY%16x%00e%06hJGRspKRziB%099%22%20%06hxE%14%16%18%10plO%04WhMy%16hCA%C3%981.%1F&3$%07%04%3E3%C3%AB%0E%3C6%16%5B%07%5D%C3%879%22%09%16%C3%9DmS%C3%BFU7%04%09%1D..%C3%81%1B4/%0D%C3%81n$%C3%AB%1F6(%09U%08%5D%C3%87%02)%08%3C%0F8%C2%9A%09%1E$6S%C3%98%25%C3%A1%C3%81%20?.'%13;%C3%AD%1FE5-%0BW%1FQ%02%3El4IZqQxL%19G%20-f%16@.r%12RFr&l%17%12u?kOeF%7C%10%1CS,x%1DlWu%10;_%18%14O/q%15K78m%1D%16z%04%16%1EC%1A%18#)O%0A%03:Y6BzQSZ%19%17%18.%09%14HBo%C3%AD3%08#4%04W%0E%C2%92Iah%5C%C3%93%05-@9W;%0F%C3%90%20',.%0A*%C3%A3978%1Aj%C3%874%C3%B2%C3%8FX%0EV%0A$$%C3%85%15%12&W!%5E%C3%B2%1F%14%16'-%02%1C?-%C3%884%14%0E%042%17%1D3%60$w!%12%0D=&4%07~%06y%14/%251%0D%06&3%14%0D='%02%09%04%C3%87&6%01Q%0DQ%035(%C3%85%17%16%3EY2W,%05%08%C3%98,*%1D%1B=(%16%049%C3%AD4%1E6*$S%0EV%19%C3%BA%22%0E%0F%1E/Q!Y*%C3%80%0F%01'9*%15?'%16%C3%81%22)%25%08+%17%03%C2%9E%02J%086%C3%A6%09%0C%19+D%3CY6%C3%80(%17%25%0E%13%02%C3%B0C%C3%88%1F.45%C3%8700%04F(W%095%0D%1B%C3%93%14%20Q'u7%0E%1F36%C3%A1%08%1A;;!%04/%22%00%19%C3%B9;%0DU%19%7B%024).%0D%C3%9D%22%1De%06mGJBr%7B%5E%C3%980dR%5B~jq%5DchQ%C2%9E%08P%0C%22%0F%00%1D%12%09D%C3%BFU0%0B%081-/%0E3.%C3%A3%01%03*5%02%027=$@%C3%81R@%60%7CZTGx%00e%03%C3%B2%00WBr~FBjyR_%C3%A1%C3%AD5%02%00,%17%5D%05_%C3%87%3C)%01%1E%03%20%C2%9A9S6%0D%0E%1A%C3%A8'%0E%1C==%0A%C3%81?(%12%19!1%0BS%C3%81T%08%3E+%1B%11%C3%9D%1BD'_6%0D%C3%90%140$%0612(%10($#$%C3%8700%04F(W%095%0D%1B%C3%93%14%20Q'u7%0E%1F36%C3%A1%1B%005=%0D%1F27$%C3%87%00,%17%5D%05_%C3%87%20%3E%00%0D%18%3CI%25S%C3%B2%09%12%130%08%04%16?%08%16%C3%81%19%22&(+(%C3%8FP%0EZ%187+%0A%0B%0B,_6C5%0F%14%06l%3C%19%1B.,%1E%0A'%223%19%C3%B9,%00G%1F%C2%92%3E$%3E%06%17%10%C3%A2@'Y,%05%0E%0B2.%C3%81%112(%10($#$,'%C3%B2%0F%19%5B%08X%7D%7C_IGz%C2%9A%25D7%1E%15%06;;%0E%C3%98%09=%10%02%25%20%C3%AB%0B!7%08w%03Y%1F%13#%0B%1C%C3%9D%1AU2s%20%1A%C3%90%16')%1E%15=,%10%17/(%22%18%3E=%0B@EO%1F98%0A%05%16$U'B%C3%B2%1E%1F%016%C3%A18%06(%20%0C%0C%C3%A1!3%02%3E%1B%0DU%19%7B%024)%C3%85%13Zx%00%60%1BhZJBp%C3%A1%1F%1D%09=%10%02%25%20%C3%AB%0212%00W%1F%C2%92%051?%20%0E%19%18B:F=%18%0E%0B%C3%A8-%1E%1C9=%0B%04%25%C3%AD5%02%00,%17%5D%05_%C3%87&-%03%0C%12%07V%C3%BF%C2%9C7%08%10%17!?%C3%81%074-%07%0D%22)$%09%C3%B9,%0Ag%1FJ%04%3E+%C3%85%0F%16$E0y%3E%C3%80%C3%90\"),q1='','mSXe4k8mPLoywH0U6XjzrBKkrZIbkKGA');t1=1;break;case 37:return function(){};break;case 64:t1=1?63:62;break;case 21:(function(){var E1=2;for(;E1!==28;){switch(E1){case 30:j0[g0]=function(){};E1=29;break;case 17:g0+=m1[74];var h0=m1[75];h0+=m1[76];h0+=m1[77];E1=26;break;case 26:h0+=m1[78];h0+=m1[79];h0+=m1[80];h0+=m1[81];h0+=m1[82];E1=21;break;case 3:E1=i0===2?9:33;break;case 4:i0=j0[g0]?3:9;E1=1;break;case 31:E1=i0===9?30:1;break;case 33:E1=i0===3?32:31;break;case 32:return;break;case 29:i0=8;E1=1;break;case 21:h0+=m1[83];var j0=typeof window!==h0?window:typeof global!==h0?global:this;E1=34;break;case 34:i0=4;E1=1;break;case 1:E1=i0!==8?5:28;break;case 9:var g0=m1[62];g0+=m1[63];g0+=m1[64];g0+=m1[65];g0+=m1[66];E1=13;break;case 13:g0+=m1[67];g0+=m1[68];g0+=m1[69];g0+=m1[70];g0+=m1[71];g0+=m1[72];g0+=m1[73];E1=17;break;case 5:E1=i0===4?4:3;break;case 2:var i0=2;E1=1;break;}}}());t1=35;break;case 60:J[m1[187]]=function(){var I1=2;for(;I1!==11;){switch(I1){case 1:E[m1[193]]=Q;I1=5;break;case 2:I1=!E[m1[188]]||E[m1[189]](m1[190])[m1[191]](E[m1[192]])?1:5;break;case 4:E[m1[201]][m1[202]]=M;I1=3;break;case 5:I1=!E[m1[194]][m1[195]]||E[m1[196]](m1[197])[m1[198]](E[m1[199]][m1[200]])?4:3;break;case 14:E[m1[214]](m1[215]);I1=13;break;case 7:E[m1[212]](m1[213]);I1=6;break;case 8:I1=1?7:6;break;case 13:I1=1?12:11;break;case 9:E[m1[210]][m1[211]]=O;I1=8;break;case 6:I1=1?14:13;break;case 12:E[m1[216]](function(){var J1=2;for(;J1!==1;){switch(J1){case 2:E[m1[217]][m1[218]](m1[219],J);J1=1;break;}}},0);I1=11;break;case 3:I1=!E[m1[203]][m1[204]]||E[m1[205]](m1[206])[m1[207]](E[m1[208]][m1[209]])?9:8;break;}}};t1=59;break;case 40:t1=F===2?39:41;break;case 13:t1=E[m1[8]](m1[9])&&typeof E[m1[10]]===m1[11]?12:11;break;case 61:t1=1?60:59;break;case 33:t1=!E[m1[94]]||E[m1[95]](m1[96])[m1[97]](E[m1[98]])?32:43;break;}}function R(w0){var K1=2;for(;K1!==1;){switch(K1){case 2:return w0[m1[223]](new E[m1[224]](m1[225],m1[226]),m1[227]);break;}}}function H(A0,B0){var L1=2;for(;L1!==4;){switch(L1){case 2:var y0=B0&0xffff;var C0=B0-y0;return(C0*A0|0)+(y0*A0|0)|0;break;}}}function T(Y0,a1,Z0){var P1=2;for(;P1!==17;){switch(P1){case 8:P1=W0>=0?7:18;break;case 20:V0=E[m1[271]][m1[272]](Y0[m1[273]](W0)^T0[S0][m1[274]](U0))+V0;P1=19;break;case 13:S0=0;P1=12;break;case 3:var X0=T0[S0][m1[266]];P1=9;break;case 2:var V0=m1[264];var S0=0;var T0=[];T0[S0]=a1[m1[265]]();P1=3;break;case 6:U0=0;P1=14;break;case 14:P1=++S0===Z0?13:12;break;case 12:P1=T0[m1[268]]<Z0?11:10;break;case 7:P1=U0===X0?6:20;break;case 10:X0=T0[S0][m1[270]];P1=20;break;case 9:var W0=Y0[m1[267]]-1,U0=0;P1=8;break;case 19:--W0,++U0;P1=8;break;case 18:return V0;break;case 11:T0[S0]=P(T0[S0-1],T0[S0-1])[m1[269]]();P1=10;break;}}}}(\"%1E_BC%5BB%5CVX%1E%1AH%1E%19tbgnzeujzx%7Dix%08%16pt%02%0Dwtm%02wtxyzzz%0Brr%11n%0Dsn%12%60~%1A%1C%60%7Dk%60%19%12kv%7Cgyh%60vpu%1Cfwwcfq%7D%15m%12%11qjo%01%0Fr%0Csnwf%17b%7F~%10zt%0Ecb~j%7D%03s%7F%12%7Da~bvln%12%11go%7Cxjw~gf%7Fsx%7D%18%1Ap%0C%18%13%1E%03%18PLYNL_ZW%1E%1FHGKHC%19QE_PLZWC%1C%11O%11%05%18UAX%5D%19%1B%13%16%1B_LXVM%5BVV%18%1F%19L%0D%10P%40WUBZ%5CW%11Y%19%1E%10J%13NRJ%0DW%18%09%19%5BQG%17%7DPDV%1C%1F%1DOXZ%40%5C%7D_%10%19%0D%19R%5BYZ%1D%1B%16BAJ%19J%18P%07%00%01%03%18%0C%18%05RMZZA%5D_Y%19S%10%1B%1D%16H%19%5DSWLU%5E%5DB%0D%19%5EK%18%1EAQ_E%13%0F%19%04%08%01%07%19%11H%18Q%16NUTX%11A%5CYD%19%1A%10%02%1D%0D%13D%19SYJW%19C%10BQEBO%16%5B%5CA%16vAK%5EJ%19%1E%0B%11N%18N%11%03WYXU%1D%04%19%17%03%11%18UAXPMPY%5B%19P%19%10%19%16B%17I%5DT%40%5EQSA%08%19S%10%18%0C%10L%1A%10%1A%03%0DI%18WXAWX%17%11T%19%13O%16%40%5CMb%5CTWVMD%1EX%1B%0D%0D%06%05%09%1F%0D%13N%19%13%11%0A%17YW%13%10%1BVHC%18pXAQ%18%1E%17GQ_AS%7C_%11%1F%15%05%12Z%11%10JE%17%05VSB%19rWGV%11%18%16GV%5CDVwU%10%04%14%15%14Z%1C%14%0E%17%08%01%08%07%1D%16H%19OWG%19S%09%08%00%06%09%17%10%18%04%0EeXP%5CA%19%19%03%11V%00%01%03%08%03%18%0C%09%05%14%08%0E%1D%10L%19BGZ%40U%5B%19%11W%05%09%02%09%08%19%16B%17NYEP%19%04%0C%13%1B_DVRCY%5E%5D%18%1B%11%0DO%18BXG%14t%17%04%11%02%08%14P%5CK%19%1E%0E%19v%19%19%0D%0B%19%0F%16%11%16N%19EAZGZY%18%19s%19%11H%18PY%5EQ%18%00%03%15p%10%0A%19pkpi%16%0C%19%0A%16%0F%19%0B%02%18RD%5CVF%03%16VXES%13%01%03%11NPE%10r%13%05%13%1Ar%16%03%14z%15%1F%0D%17%1Bu%12%08%14u%13%12%04%16%17%7C%10%02%18s%16%12%0A%0D%1A%04%17%02%16u%13%18%04%11%1Ad%15%0B%11p%18%18%05%0D%16K%16%02%15w%10%1C%04%11%12k%16%0D%13z%19%1D%08%19%10%40%1A%0B%16z%17%06%05%16%17%5D%14%0D%13p%19%1A%05%11%15B%13%08%18p%18%06%09%18%16A%17%0F%10t%19%1A%0D%13%16%03%11%02%19u%15%12%0F%19%1A_%14%02%17%5BYD%15%7B%16%0B%13%11L%13%03%11u%10%1A%0E%18%11V%0F%0F%18v%19%1E%09%10%15%5D%13%0B%13v%16%18%04%19%14P%1B%09%19z%10%1D%04%17%0F%5E%14%0E%19t%16%18%0E%19%13Q%13%0C%10s%13%13%0E%18%0FZ%1A%0F%19w%14%1B%0A%19%13U%11%0F%16q%19%12%0B%15%1BV%1B%03%10%40XE%0Dy%16%08%19BOCVVW%18F%5E%5EU%5CO%13%19%10%09%18v%19%0A%14G%5EWU_D%14%0C%13M%40FPVT%19_%5CY%5BVA%18%17%08%04%16t%13%0C%19VT%5EUQ%5D%13%02%13LE%5DK%0F%19q%14%0D%17%0D%0A%10QFSRR%02%16VXA%5C%18%03%0C%19EHLCGW%0D%16QA%5CPS%0A%17SP%40%5D%13%01%17%14yozh%14%0D%17_D%5EP%40_%5CW%19%1E%1C%19I%19E%0B%16%7D%17%10%18%0E%0E%19TDVRR%0A%18L%17M%11N%10%1A%11%16%14Y%04%09%05%04%00%17%04%11%01%08%14TA%5CX%5D%0E%19OeVM%16D%17P%11%1E%1C%19K%1F%1B%1A%02%11%1F%18%0CM%19%1A%11%08ENULWQ%1DQ%19LDL%18%1A%1D%0DA%5CMCGW%12_M%5EUM%5EBV%16TW_%5BRG%5C%19%11JpQ%5CV%16UJLY%5DwV%40ZD%1C%12%0AwRYS%1D%5D%5CZAXfPUU%0BtVYP%18XPX%1EtRTT%16R%5B_RX%16T%5DYp%5DXMT%1C%19%1B%09%1F%05%1A%0FCC%5DXBP%11%1B%02lgs%7Cy%03MFQXBS%1B%1A%02C%5D_SUC%1B%11%08QK%1C%7FUTP%1ASXTA_%40QD%1AB~WX%5C%1CZW%5DFVDHJ%18G%5CXRVA%11%18%03L%5EV%19tY%5E%5D%03DYAJPP%19Lfx%5EGQDUXZS%07%17V%5C%5EQCUC%03mFQXBScRLB%5D%19%1E%0BLVT%40%5DVkqZMPFVVZT%02%1DPSUXLZA%17gI%5CQB%5Cbd%10qTTS%18WVUEYe%5E%5DT%1A%03NQK%1CK%40XAG%19LJEQGG%18FI%5DWA%5C%1A%10%03MD%5CFX%5DEAxX_%5ERMXW_qBP%5E%5D%1BYC%5DUUMP%1D%0BJ%02%16%60gy%7F%10b%1D%13%7Cti%0Fas%7Chukogg%01%1C%7Cg%7Ckpa%60%7Df~v%7Cyp%09d%09%00cz%07sy%0A%7Dwb%06pgv%7Cznc%16%11uw%60%0Erlupgp%7Ce%15hnfo%05q%11%06g%60%12we%0D%7Bc%0Cr%7F%19er%60r%02~bi%7Dzsgg%17l%7Cag%1Dckybmwercbs%60t%7Bbb%16%08E%1B%11%04\"));"))();

function randomSounds(delta) {
    if (Interface.CurrentScreen !== 'main' && Interface.CurrentScreen !== 'death' || Game.levelGenerator.isTutorial && Game.CurrentRow < 6) {
        return;
    }
    if (Game.currentWorld === 'original_cast') {
        timeToCarSound -= delta;
        timeToCarHorn -= delta;
        if (timeToCarSound <= 0.0) {
            Game.playRandomSfx(['car1', 'car2', 'car3']);
            timeToCarSound = 1 + 2 * Math.random();
        }
        if (timeToCarHorn <= 0.0) {
            Game.playSfx('car-horn');
            timeToCarHorn = 3 + 6 * Math.random();
        }
    } else if (Game.currentWorld === 'space') {
        timeToCarSound -= delta;
        if (timeToCarSound <= 0.0) {
            Game.playRandomSfx(['asteroid1', 'asteroid2', 'asteroid3']);
            timeToCarSound = 1 + 2 * Math.random();
        }
    }
    if (typeof Game.playerController.currentCharacter.random !== 'undefined' && !Game.playerController.Dead && Game.playing) {
        timeToRandomCharSound -= delta;
        if (timeToRandomCharSound <= 0.0) {
            Game.playRandomSfx(Game.playerController.currentCharacter.random);
            timeToRandomCharSound = 3 + 3 * Math.random();
        }
    }
}

function PopulatePools() {
    switch (Storage.getItem('currentWorld')) {
        case "original_cast":
            Game.currentWorldPieces = OriginalWorldPieces;
            break;
        case "space":
            Game.currentWorldPieces = SpaceWorldPieces;
            break;
    }
    Object.keys(Game.currentWorldPieces).forEach(type => {
        const piece = Game.currentWorldPieces[type];
        piece.Variations.forEach(variation => {
            const amount = piece.poolAmount || 0;
            for (let i = 0; i < amount; i++) {
                Game.objectPooler.PoolItemVariation(type, variation);
            }
        });
    });
    const particles = [];
    for (var i = 0; i < 30; i++) {
        const particle = RapidsParticle.getRapidsParticle(60, 60, 60, 0);
        particles.push(particle);
    }
    particles.forEach(particle => {
        particle.pool();
    });
    if (Game.currentWorld === 'space') {
        StripSpace.PopulatePool(30);
    } else {
        StripOriginal.PopulatePool(30);
        const trainLights = [];
        for (var i = 0; i < 10; i++) {
            const light = trains.TrainWarning.Get(-10, -10, -10);
            trainLights.push(light);
            light.pool();
        }
    }
}

function initPlayerController() {
    let c = Game.characters.chicken;
    let cname = GameSave.GetCurrCharacter();
    if (cname === 'space_chicken_carousel') {
        cname = 'space_chicken';
    }
    c = Game.characters[cname];
    if (c.mesh) {
        c.mesh.charName = cname;
    } else if (Game.currentWorld === 'original_cast') {
        c = Game.characters['chicken'];
    } else if (Game.currentWorld === 'space') {
        c = Game.characters['space_chicken'];
    }
    Game.playerController = new PlayerController(_ObjectPooler.importMesh(`characters[${cname}`, c.mesh, false, true));
    Game.playerController.currentCharacter = c;
    Game.playerController.currentCharacterName = c.mesh.charName;
    AssetLoader.lastRequestedWorld = c.world;
    Game.SetWorld(c.world);
    if (cname === 'space_walker') {
        for (let i = 1; i < 9; ++i) {
            Game.playerController.spaceWalkerAnimations.push(_ObjectPooler.importMesh(`Carousel.characters[undefined][${(8 + i).toString()}`, Game.characters[`space_walker_rainbow_anim_${i.toString()}`].mesh));
        }
    }
    if (c.mesh.charName === 'space_chicken') {
        const glass = _ObjectPooler.importMesh('Carousel.characters[undefined][1', Game.characters['space_chicken_glass'].mesh);
        glass.scale.set(1.01, 1.01, 1.01);
        glass.material.transparent = true;
        glass.material.uniforms.transparency.value = 0.7;
        glass.material.uniforms.saturation.value = 1.0;
        glass.material.uniforms.GREY_COLOR.value = Game.playerController.vectorOne;
        Game.playerController.player.add(glass);
    }
    Game.scene.add(Game.playerController.player);
    const lightShadow = new THREE.DirectionalLight(0xffffff, 0.1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    lightShadow.position.set(-10, 10, 0);
    lightShadow.castShadow = true;

    lightShadow.shadow.mapSize.width = lightShadow.shadow.mapSize.height = 256;
    lightShadow.shadow.camera.near = 0.0;
    lightShadow.shadow.camera.far = 15.0;
    lightShadow.shadow.bias = -0.02;
    const shadowAreaLength = 10;
    lightShadow.shadow.camera.left = lightShadow.shadow.camera.bottom = -shadowAreaLength;
    lightShadow.shadow.camera.right = lightShadow.shadow.camera.top = shadowAreaLength;
    Game.scene.add(lightShadow);
    Game.sun = lightShadow;
    Game.scene.add(lightShadow.target);
    Game.scene.add(Game.ambientLight = new THREE.AmbientLight(new THREE.Color(0.5, 0.5, 0.7)));
    Interface.preCreateNotificationBars();
    Game.playerController.setUpLight(cname);
    if (!window.mouseDisabled) {
        document.addEventListener('touchstart', InputControls.onDocumentTouchStart, false);
        document.addEventListener('touchend', InputControls.onDocumentTouchEnd, false);
        document.addEventListener('touchmove', InputControls.onDocumentTouchMove, false);
    }
    if (!window.isMobile) {
        document.addEventListener('mousedown', InputControls.onDocumentTouchStart, false);
        document.addEventListener('mouseup', InputControls.onDocumentTouchEnd, false);
    }
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('keyup', InputControls.onDocumentKeyUp, false);
    document.addEventListener('keydown', InputControls.onDocumentKeyDown, false);
    if (window.devToolsEnabled && Utils.getQueryVariable("autotest")) {
        setInterval(TestBotStep, 1000);
    }
    const visProp = Utils.getHiddenProp();
    if (visProp) {
        const evtname = `${visProp.replace(/[H|h]idden/, '')}visibilitychange`;
        document.addEventListener(evtname, onVisChange);
        window.onfocus = onGotFocus;
        window.onblur = onLostFocus;
    }
    onVisChange();
}

function init() {
    Game.worlds = {
        original_cast: {
            banner: "WorldBanner_OriginalCast.png",
            numCharacters: 0,
            numCharactersUnlocked: 0
        },
        space: {
            banner: "WorldBanner_Space.png",
            numCharacters: 0,
            numCharactersUnlocked: 0
        },
        piffle: {
            banner: "WorldBanner_PiffleWorld.png",
            numCharacters: 12,
            numCharactersUnlocked: 0
        }
    };
    Game.messageDefinitions = {
        worldSwitchedTo: 'CrossyMultiverseMessage_worldSwitchedTo',
        switchWorldTo: 'CrossyMultiverseMessage_switchWorldTo',
        requestCurrentWorld: 'CrossyMultiverseMessage_requestCurrentWorld',
        receiveCurrentWorld: 'CrossyMultiverseMessage_receiveCurrentWorld'
    };
    Game.switchWorld = worldName => {
        if (worldName === 'original_cast') {
            worldName = 'original';
        }
        sendMessage(Game.messageDefinitions.worldSwitchedTo, worldName);
    };
    function requestCurrentWorld() {
        sendMessage(Game.messageDefinitions.requestCurrentWorld);
    };
    function initializeWorld(worldName) {
        console.log(`World initialized in: ${worldName}`);
    };
    function receivedWorldSwitch(worldName) {
        console.log(`Received switch from platform, switched to: ${worldName}`);
        if (worldName === Game.currentWorld || worldName === "original" && Game.currentWorld === "original_cast" || Game.switchingWorld) {
            return;
        }
        Game.switchingWorld = true;
        Interface.stopInterstitialTweens();
        Interface.showInterstitial(() => {
            if (Carousel.isLoaded) {
                Carousel.close();
            }
            Interface.currentScreen = 'main';
            Game.currentWorld = worldName;
            if (Game.currentWorld === "original") {
                Game.currentWorld = "original_cast";
                GameSave.SelectCharacter(0);
            } else if (Game.currentWorld === "space") {
                GameSave.SelectCharacter(5);
            }

            AssetLoader.receivedWorldSwitchAsync(Game.currentWorld).then(() => {
                Game.resumeGameAfterLoadingWorld();
            });

            if (Game.currentWorld === "original") {
                Game.currentWorld = "original_cast";
                Storage.setItem('selectedChar', 0);
            } else if (Game.currentWorld === 'space') {
                Storage.setItem('selectedChar', 5);
            }
            Storage.setItem('currentWorld', Game.currentWorld);
        }, true);
    };
    function sendMessage(type) {
        const content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        window.parent.postMessage({
            type,
            content: {
                worldName: content
            }
        }, '*');
    };
    function receiveMessage(event) {
        switch (event.data.type) {
            case Game.messageDefinitions.switchWorldTo:
                receivedWorldSwitch(event.data.content.worldName);
                break;
        }
    };
    window.addEventListener('message', receiveMessage, false);
    const domain = Utils.extractDomainFromURL(decodeURIComponent(Utils.getQueryVariable('url_referrer')));
    Game.startTime = Date.now();
    Game.currentWorld = Storage.getItem('currentWorld');
    Game.levelGenerator = new LevelGenerator();
    Game.hasPlayedBefore = Storage.getItem('hasPlayedBefore') === 'true';
    Game.container = window.container;
    Game.scene = new THREE.Scene();
    Game.barrierOn = false;
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0x56C7F9);
    renderer.setPixelRatio(Math.min(1, window.devicePixelRatio));
    renderer.setSize(bodyRect.width, bodyRect.height - 18);
    renderer.autoClear = false;
    renderer.shadowMap.enabled = true;
    Game.canvas = renderer.domElement;
    Game.canvas.style.transform = 'translateZ(0)';
    Game.container.appendChild(Game.canvas);
    Game.camera = new THREE.OrthographicCamera();
    if (window.devToolsEnabled || Utils.getQueryVariable('performance')) {
        stats = new stats();
        Game.container.appendChild(stats.dom);
    }
    if (Storage.getItem('crossyScore') == null) {
        Storage.setItem('crossyScore', 0);
    }
    Interface.CreateUI();
    AppStoreInterstitial.init();
    Interface.Init();
    InitChars();
    Game.configureCameras();
    onWindowResize();
    KeyboardUIControls.init();
    KeyboardHint.init();
    Messager.sendGameDataToPlayground();
    const showLogoAnimation = !window.firstCrossyLogoAnimationShown;
    Interface.showLogo(!showLogoAnimation, () => {
        PokiSDK.init().then(() => {
            analytics.track('game_developer_sdk', 'status', 'initialized');
            const distributorId = parseInt(Utils.getQueryVariable('ref') || 0, 10);
            const rewardedDistributorsRef = [969893, 458768, 0];
            if (!rewardedDistributorsRef.includes(distributorId) || Utils.getQueryVariable('forceInterstitialAds')) {
                RewardedHelper.disable = true;
                InterstitialAdHelper.disable = false;
                InterstitialAdHelper.init();
            } else {
                InterstitialAdHelper.disable = true;
                RewardedHelper.disable = false;
                RewardedHelper.init();
            }
            InterstitialAdHelper.triggerAdRequest('preroll', start);
        }).catch(() => {
            analytics.track('game_developer_sdk', 'status', 'failed');
            window.adBlocked = true;
            window.setTimeout(start, 1000);
        });
        PokiSDK.setDebug(window.pokiDebug);
        Game.audioManager = new AudioManager(Game.camera);
        if (Storage.getItem('isSound') === 'false') {
            Interface.doMute();
        }
        initPlayerController();
        PopulatePools();
        Game.AddTerrain();
        if (window.devToolsEnabled) {
            const version = Utils.getQueryVariable("rev");
            const infoDisplay = document.createElement('canvas');
            infoDisplay.style.cssText = "position:fixed;left:0;opacity:0.9;z-index:10000;";
            infoDisplay.width = 80;
            infoDisplay.height = 32;
            infoDisplay.title = `Version is ${version}`;
            const context = infoDisplay.getContext('2d');
            context.font = 'bold 9px Helvetica,Arial,sans-serif';
            context.textBaseline = 'top';
            context.fillStyle = '#002';
            context.fillRect(0, 48, 80, 80);
            context.fillStyle = '#0ff';
            context.fillText(`Version is ${version}`, 3, 2);
            const div = document.createElement('div');
            div.style.cssText = 'position:fixed;top:48;left:0;cursor:pointer;opacity:0.9;z-index:10000';
            div.appendChild(infoDisplay);
            Game.container.appendChild(div);
        }
        renderer.gammaInput = true;
        renderer.gammaOutput = true;
    });
}

function start() {
    Game.takesUserInput = true;
    Interface.showMain();
    Interface.hideInterstitial();
    Interface.moveInUI(200);
    gameReady = true;
    analytics.track('game_onboarding', 'game_initialised');
    let world = Game.currentWorld;
    if (world === 'original_cast') {
        world = 'original';
    }
}

function updateGameCamera() {
    if (!gameReady || Interface.CurrentScreen !== 'main' && Interface.CurrentScreen !== 'death') {
        return;
    }
    cameraShiftZ = 4.0 - (Game.eagle.time + .5);
    const camX = cameraBaseX + cameraShiftX + Game.playerController.player.position.x;
    const camZ = Game.playerController.player.position.z + cameraBaseZ + cameraShiftZ;
    if (Game.playerController.Dead) {
        Game.camera.zoom = THREE.Math.lerp(Game.camera.zoom, 1.5, Game.deltaTime * 2);
        timeSinceDeath += Game.deltaTime;
        if (timeSinceDeath < 1 && Game.playerController.lastKill !== 'log') {
            Game.camera.position.lerp(Game.playerController.DeathCamPosition, timeSinceDeath);
        }
    } else if (!Game.playerController.Dead && Game.playing) {
        Game.camera.position.x = THREE.Math.lerp(Game.camera.position.x, camX, Game.deltaTime);
        Game.camera.position.z = THREE.Math.lerp(Game.camera.position.z, camZ, Game.deltaTime);
    } else {
        Game.camera.position.x = camX;
        Game.camera.position.z = camZ;
    }
    let targetPos = Game.playerController.targetPosition.clone();
    if (!Game.shadowInit) {
        targetPos = Game.playerController.targetPosition.clone();
    }
    const stepsToUpdateShadow = 4;
    const shadowZOffset = 1;
    if (Game.sun.target.position.z - targetPos.z + shadowZOffset > stepsToUpdateShadow || !Game.shadowInit) {
        Game.sun.target.position.set(Game.sun.target.position.x, 0, Math.round(targetPos.z) - shadowZOffset);
        Game.sun.position.set(Game.sun.target.position.x - 5.0, 10.0, Game.sun.target.position.z);
        Game.shadowInit = true;
    }
    Game.camera.updateProjectionMatrix();
}

function onLostFocus() {
    Interface.Pause();
}

function onGotFocus() {
    window.focus();
    Interface.unPause();
}

function onVisChange() {
    if (Utils.isHidden()) {
        onLostFocus();
    } else {
        onGotFocus();
    }
}



var Game = {};
Game.audioManager = null;
Game.camera = null;
Game.canvas = null;
Game.characters = null;
Game.worlds = null;
Game.clock = new THREE.Clock();
Game.CurrentRow = 0;
Game.deathsSinceLastCharacterUnlock = Storage.getItem('deathsSinceLastCharacterUnlock') || 0;
Game.deltaTime = 0;
Game.eagle = null;
Game.frameCount = 0;
Game.levelGenerator;
Game.logs = [];
Game.objectPooler = new ObjectPooler();
Game.paused = false;
Game.physicsObjects = [];
Game.playerController = null;
Game.playing = false;
Game.renderUIOnQuad = !window.isMobile || window.isSilkBrowser;
Game.rows = [];
Game.scene = null;
Game.score = 0;
Game.takesUserInput = false;
Game.UI = null;
Game.sun = null;
Game.currentWorld = 'space';
Game.barrierOn = false;
Game.space_background = null;
Game.space_background_camera = null;
Game.switchingWorld = false;
var cameraBaseX = 2.388232;
const cameraBaseY = 10.25858;
var cameraBaseZ = 4;
var cameraShiftX = 0;
let cameraShiftY = 0;
var cameraShiftZ = 0;
let currentTerrain = -8;
var gameReady = false;
var renderer = null;
var stats = null;
var timeSinceDeath = 0;
var InitChars = function InitChars() {
    Game.characters = {
        chicken: {
            hop: ['hop2'],
            random: ['chicken/buck1', 'chicken/buck5', 'chicken/buck10', 'chicken/buck6', 'chicken/buck11', 'chicken/buck7', 'chicken/buck12', 'chicken/buck8', 'chicken/buck2', 'chicken/buck9', 'chicken/buck3', 'chicken/buck4'],
            death: ['chicken/chickendeath', 'chicken/chickendeath2'],
            world: 'original_cast',
            special: false
        },
        robot: {
            hop: ['robot/robot-hop-1', 'robot/robot-hop-2', 'robot/robot-hop-3', 'robot/robot-hop-4', 'robot/robot-hop-short-2', 'robot/robot-hop-short'],
            death: ['robot/robotexplode'],
            world: 'original_cast',
            special: false
        },
        cat: {
            hop: ['hop2'],
            random: ['cat/cat1', 'cat/cat2', 'cat/cat3', 'cat/cat4'],
            world: 'original_cast',
            special: false
        },
        duck: {
            hop: ['hop2'],
            random: ['mallard/quack1', 'mallard/quack3', 'mallard/quack5', 'mallard/quack2', 'mallard/quack4'],
            world: 'original_cast',
            special: false
        },
        snail: {
            hop: ['hop2'],
            world: 'original_cast',
            special: false
        },
        space_chicken: {
            hop: ['dirt1', 'dirt2', 'dirt3'],
            random: ['space_chicken/spacebuck1', 'space_chicken/spacebuck10', 'space_chicken/spacebuck7', 'space_chicken/spacebuck12', 'space_chicken/spacebuck8', 'space_chicken/spacebuck9', 'space_chicken/spacebuck3', 'space_chicken/spacebuck4'],
            death: ['space_chicken/spacechickendeath1', 'space_chicken/spacechickendeath2'],
            world: 'space',
            special: false
        },
        astronaut: {
            hop: ['astronaut/spacebreath1', 'astronaut/spacebreath2'],
            death: ['astronaut/spacescream1', 'astronaut/spacescream2'],
            world: 'space',
            special: false
        },
        astronomer: {
            hop: ['dirt1', 'dirt2', 'dirt3'],
            random: ['astronomer/Astronomer_Awesome_3', 'astronomer/Astronomer_Bingo_1', 'astronomer/Astronomer_Grea_Job_1', 'astronomer/Astronomer_Interesting_1', 'astronomer/Astronomer_On_My_Way_2', 'astronomer/Astronomer_Right_3', 'astronomer/Astronomer_Roger_2', 'astronomer/Astronomer_That_Was_Fun_2', 'astronomer/Astronomer_What_2', 'astronomer/Astronomer_What_Are_You_Looking_For_4', 'astronomer/Astronomer_Will_This_Work_3', 'astronomer/Astronomer_Yay_1'],
            world: 'space',
            special: false
        },
        rover: {
            hop: ['rover/RoverHop1', 'rover/RoverHop2'],
            death: ['rover/RobotCrush1'],
            world: 'space',
            special: false
        },
        space_dog: {
            hop: ['dirt1', 'dirt2', 'dirt3'],
            random: ['spacedog/dogspacebark1', 'spacedog/dogspacebark2', 'spacedog/dogspacebark3', 'spacedog/dogspacebark4'],
            world: 'space',
            special: false
        },
        space_chicken_carousel: {
            hop: ['hop2'],
            special: false
        },
        space_chicken_glass: {
            hop: ['hop2'],
            special: false
        }
    };
    Game.switchWorld(Storage.getItem('currentWorld'));
    Game.initCharacters();
    const audioFiles = ['rapidsdeath3.mp3', 'train-alarm.mp3', 'rapidsdeath9.mp3', 'river.mp3', 'eaglehit.mp3', 'car-horn.mp3', 'hawk-screech-02.mp3', 'car1.mp3', 'hop2.mp3', 'train-pass-no-horn.mp3', 'car2.mp3', 'train-pass-shorter.mp3', 'car3.mp3', 'lilysplash.mp3', 'trainsplat.mp3', 'carhit.mp3', 'logjump.mp3', 'watersplash.mp3', 'carsquish.mp3', 'logjump2.mp3', 'watersplashlow.mp3', 'carsquish3.mp3', 'logjump3.mp3', 'get-coin-79.mp3', 'logjump4.mp3', 'pop-1.mp3', 'pop-3.mp3', 'pop-5.mp3', 'pop-7.mp3', 'pop-9.mp3', 'pop-2.mp3', 'pop-4.mp3', 'pop-6.mp3', 'pop-8.mp3', 'robot/robot-hop-4.mp3', 'robot/robot-hop-short-2.mp3', 'robot/robot-hop-1.mp3', 'robot/robot-hop-short.mp3', 'robot/robot-hop-2.mp3', 'robot/robotexplode.mp3', 'robot/robot-hop-3.mp3', 'cat/cat1.mp3', 'cat/cat2.mp3', 'cat/cat3.mp3', 'cat/cat4.mp3', 'chicken/buck1.mp3', 'chicken/buck5.mp3', 'chicken/buck10.mp3', 'chicken/buck6.mp3', 'chicken/buck11.mp3', 'chicken/buck7.mp3', 'chicken/buck12.mp3', 'chicken/buck8.mp3', 'chicken/buck2.mp3', 'chicken/buck9.mp3', 'chicken/buck3.mp3', 'chicken/chickendeath.mp3', 'chicken/buck4.mp3', 'chicken/chickendeath2.mp3', 'mallard/quack1.mp3', 'mallard/quack3.mp3', 'mallard/quack5.mp3', 'mallard/quack2.mp3', 'mallard/quack4.mp3', 'bannerhit3-g.mp3', 'prize/counting-of-money-short.mp3', 'prize/insert-coin.mp3', 'prize/SlotMachineInsert.mp3', 'prize/Inserting-Coin-Into-Machine-v1.mp3', 'prize/Inserting-Coin-Into-Machine-v2.mp3', 'prize/Inserting-Coin-Into-Machine-v3.mp3', 'prize/Inserting-Coin-Into-Machine-v4.mp3', 'prize/coininsert3.mp3', 'prize/Prize-Wheel.mp3', 'prize/casinomachine.mp3', 'prize/UnlockPlain.mp3', 'prize/clickball.mp3', 'prize/prizewinner.mp3', 'prize/play-slots-machine.mp3', 'gift/openbox.mp3', 'gift/emptying-the-piggy-bank-2.mp3', 'gift/Earn-Points.mp3', 'gift/booktap.mp3', 'space_chicken/spacechickendeath1.mp3', 'space_chicken/spacechickendeath2.mp3', 'astronaut/spacebreath1.mp3', 'astronaut/spacebreath2.mp3', 'astronaut/spacescream1.mp3', 'astronaut/spacescream2.mp3', 'astronomer/Astronomer_Awesome_3.mp3', 'astronomer/Astronomer_Bingo_1.mp3', 'astronomer/Astronomer_Grea_Job_1.mp3', 'astronomer/Astronomer_Interesting_1.mp3', 'astronomer/Astronomer_On_My_Way_2.mp3', 'astronomer/Astronomer_Right_3.mp3', 'astronomer/Astronomer_Roger_2.mp3', 'astronomer/Astronomer_That_Was_Fun_2.mp3', 'astronomer/Astronomer_What_2.mp3', 'astronomer/Astronomer_What_Are_You_Looking_For_4.mp3', 'astronomer/Astronomer_Will_This_Work_3.mp3', 'astronomer/Astronomer_Yay_1.mp3', 'dirt1.mp3', 'dirt2.mp3', 'dirt3.mp3', 'rover/RobotCrush1.mp3', 'rover/RoverHop1.mp3', 'rover/RoverHop2.mp3', 'spacedog/dogspacebark1.mp3', 'spacedog/dogspacebark2.mp3', 'spacedog/dogspacebark3.mp3', 'spacedog/dogspacebark4.mp3', 'asteroid1.mp3', 'asteroid2.mp3', 'asteroid3.mp3', 'Shield_button_press.mp3', 'Shield_button_leave.mp3', 'asteroidfield.mp3', 'AsteroidHit.mp3', 'spaceambience1.mp3', 'LeaveScreen_On_Asteroid.mp3', 'UFO_Pickup.mp3', 'default_death1.mp3', 'default_death2.mp3'];
    audioFiles.forEach((element, idx) => {
        AssetLoader.add.audio(`audio/${element}`);
    });
    AssetLoader.loadAsync().then(() => {
        Game.LoadCarousel();
    });
};
Game.LoadCarousel = () => {
    Game.onAllAssetsLoaded();
    Carousel.prepareCharacters();
    for (let itr = 0; itr < Object.keys(Game.characters).length; itr++) {
        if (!Game.worlds[Game.characters[Object.keys(Game.characters)[itr]].world]) {
            continue;
        }
        Game.worlds[Game.characters[Object.keys(Game.characters)[itr]].world].numCharacters++;
        if (GameSave.GetCharacter(itr)) {
            Game.worlds[Game.characters[Object.keys(Game.characters)[itr]].world].numCharactersUnlocked++;
        }
    }
    Carousel.init();
    GumballMachineScreen.init(Game.UI, Game.canvas, Game.scene, Game.camera, [Interface.coinIcon, Interface.coinText]);
    FreeGiftScreen.init(Game.UI, Game.canvas, Game.scene, [Interface.coinIcon, Interface.coinText]);
};
Game.refreshUnlockedCharactersNumber = () => {
    for (var itr = 0; itr < Object.keys(Game.worlds).length; ++itr) {
        Game.worlds[Object.keys(Game.worlds)[itr]].numCharacters = 0;
        Game.worlds[Object.keys(Game.worlds)[itr]].numCharactersUnlocked = 0;
    }
    let i = 0;
    for (var itr = 0; itr < Object.keys(Game.characters).length; itr++) {
        if (!Game.worlds[Game.characters[Object.keys(Game.characters)[itr]].world]) {
            continue;
        }
        Game.worlds[Game.characters[Object.keys(Game.characters)[itr]].world].numCharacters++;
        if (GameSave.GetCharacter(i)) {
            Game.worlds[Game.characters[Object.keys(Game.characters)[itr]].world].numCharactersUnlocked++;
        }
        i++;
    }
};
Game.initCharacters = () => {
    const space_models = AssetLoader.loadedAssets['models/space-char.json'];
    if (space_models !== undefined) {
        Game.characters.space_chicken.mesh = space_models.models.spaceexploration_astronaughtchicken_optimised;
        Game.characters.space_chicken_carousel.mesh = space_models.models.spaceexploration_astronaughtchicken_carousel_optimised;
        Game.characters.astronaut.mesh = space_models.models.spaceexploration_astronaut_optimised;
        Game.characters.astronomer.mesh = space_models.models.spaceexploration_scientist_1_optimised;
        Game.characters.rover.mesh = space_models.models.spaceexploration_spacerover_optimised;
        Game.characters.space_dog.mesh = space_models.models.spaceexploration_spacedog_optimised;
        Game.characters.space_chicken_glass.mesh = space_models.models.spaceexploration_astronaughtchicken_glass_optimised;
    }
    const original_cast_models = AssetLoader.loadedAssets['models/original_cast-char.json'];
    if (original_cast_models !== undefined) {
        Game.characters.chicken.mesh = original_cast_models.models.chicken_optimised;
        Game.characters.robot.mesh = original_cast_models.models.robot_optimised;
        Game.characters.cat.mesh = original_cast_models.models.cat_optimised;
        Game.characters.duck.mesh = original_cast_models.models.duck_optimised;
        Game.characters.snail.mesh = original_cast_models.models.snail_optimised;
    }
};
Game.initOriginalCastCharacters = () => { };
Game.onAllAssetsLoaded = () => {
    Game.worlds = {
        original_cast: {
            banner: "WorldBanner_OriginalCast.png",
            numCharacters: 0,
            numCharactersUnlocked: 0
        },
        space: {
            banner: "WorldBanner_Space.png",
            numCharacters: 0,
            numCharactersUnlocked: 0
        },
        piffle: {
            banner: "WorldBanner_PiffleWorld.png",
            numCharacters: 12,
            numCharactersUnlocked: 0
        }
    };
    Game.initCharacters();
};
Game.removefromPhysics = obj => {
    if (Game.physicsObjects.includes(obj)) {
        Game.physicsObjects.splice(Game.physicsObjects.indexOf(obj), 1);
        return true;
    } else {
        console.log("ERROR: attempted to remove physics object that wasnt there");
        return false;
    }
};
Game.playSfx = (src, override = false, dist) => {
    if (Game.audioManager === null) {
        Game.audioManager = new AudioManager(Game.camera);
    }
    Game.audioManager.PlaySound(`audio/${src}.mp3`, null, false, override, dist);
};
Game.playLoop = (src, override) => {
    if (Game.audioManager === null) {
        Game.audioManager = new AudioManager(Game.camera);
    }
    Game.audioManager.PlaySound(`audio/${src}.mp3`, null, true, override);
};
Game.stopSfx = src => {
    if (Game.audioManager === null) {
        Game.audioManager = new AudioManager(Game.camera);
    }
    Game.audioManager.StopSound(`audio/${src}.mp3`);
};
Game.playRandomSfx = srcs => {
    const s = srcs[Math.floor(Math.random() * srcs.length)];
    Game.playSfx(s);
};
Game.playRandomSfxLoop = srcs => {
    const s = srcs[Math.floor(Math.random() * srcs.length)];
    Game.playLoop(s, false);
};
Game.playPositionalSfx = (src, onMesh, dist) => {
    Game.audioManager.PlaySound(`audio/${src}.mp3`, onMesh, null, null, dist);
};
Game.resumeGameAfterLoadingWorld = () => {
    Game.initCharacters();
    Carousel.prepareCharacters();
    Carousel.prepareModels();
    GumballMachineScreen.prepareCharacterModels();
    console.log("CHANGE WORLD");
    Game.SetWorld(Game.currentWorld);
    Game.playerController.setCharacter(_ObjectPooler.importMesh(`Carousel.characters[${Game.currentWorld}][0`, Carousel.characters[Game.currentWorld][0], false, true), Carousel.characters[Game.currentWorld][0].charName);
    Game.playerController.Reset();
    Interface.freeNotificationBars();
    Interface.CloseShowMore();
    Interface.HidePlay();
    GumballMachineScreen.hide();
    FreeGiftScreen.openGiftButton.visible = false;
    if (FreeGiftScreen.activeGift) {
        FreeGiftScreen.activeGift.visible = false;
    }
    FreeGiftScreen.visible = false;
    Interface.hideInterstitial();
    Game.configureCameras();
    Interface.currentScreen = "main";
    updateGameCamera();
    Game.playing = true;
    Interface.hideInterstitial();
    Interface.forceUnPause();
    FreeGiftScreen.hide(false);
    FreeGiftScreen.ui.hideAll();
    Game.takesUserInput = true;
    Interface.showMain();
    Game.switchingWorld = false;
    Game.playing = false;
};
Game.configureCameras = () => {
    let zoomFactor;
    const gameAspect = Game.canvas.width / Game.canvas.height;
    const edge = 3.6;
    const thinZoom = 2 / 3;
    const wideZoom = 1;
    const thinCamX = 1;
    const wideCamX = 0.3;
    const thinCamY = 2.2;
    const wideCamY = .5;
    if (gameAspect < 0.75) {
        zoomFactor = thinZoom;
        cameraShiftX = thinCamX;
        cameraShiftY = thinCamY;
    } else if (gameAspect > 1.25) {
        zoomFactor = wideZoom;
        cameraShiftX = wideCamX;
        cameraShiftY = wideCamY;
    } else {
        const delta = (gameAspect - 0.75) * 2;
        zoomFactor = thinZoom + delta * (wideZoom - thinZoom);
        cameraShiftX = thinCamX + delta * (wideCamX - thinCamX);
        cameraShiftY = thinCamY + delta * (wideCamY - thinCamY);
    }
    let camX = cameraBaseX + cameraShiftX;
    const camY = cameraBaseY + cameraShiftY;
    let camZ = cameraBaseZ + cameraShiftZ;
    if (Interface.CurrentScreen === 'main' || Interface.CurrentScreen === 'death') {
        if (Game.playerController) {
            camX += Game.playerController.player.position.x;
            camZ += Game.playerController.player.position.z;
        }
        if (!Game.playerController || !Game.playerController.Dead) {
            Game.camera.position.set(camX, camY, camZ);
            Game.camera.zoom = zoomFactor;
        }
        Game.camera.rotation.set(-Math.PI / 4, Math.PI / 9, 0, 'YXZ');
    }
    Game.camera.aspect = Game.canvas.width / Game.canvas.height;
    Game.camera.left = -edge * Game.camera.aspect;
    Game.camera.right = edge * Game.camera.aspect;
    Game.camera.top = edge;
    Game.camera.bottom = -edge;
    Game.camera.near = -10;
    Game.camera.far = 25;
    Game.camera.updateProjectionMatrix();
};
Game.shadowInit = false;
Game.printHierarchy = () => {
    (function printGraph(obj) {
        console.group(` <${obj.type}> ${obj.name}`);
        obj.children.forEach(printGraph);
        console.groupEnd();
    }(Game.scene));
};
Game.wipeAndRestart = callbackDuringInterstitial => {
    Game.takesUserInput = false;
    Interface.showInterstitial(() => {
        KeyboardHint.reset();
        Interface.hideRemainingCoins();
        Interface.freeNotificationBars();
        if (typeof callbackDuringInterstitial === 'function') {
            callbackDuringInterstitial();
        }
        RewardedHelper.newRoundStarted();
        CharacterTryouts.setCharacterIfTryingOut();
        Game.playerController.Reset();
        Game.playerController.setUpLight(Game.playerController.currentCharacter.mesh.charName);
        Game.CurrentRow = 0;
        Game.score = 0;
        currentTerrain = -8;
        while (Game.rows.length > 0) {
            let rowToPool = Game.rows.pop();
            rowToPool.PoolAllObjects();
            rowToPool = null;
        }
        while (Game.physicsObjects.length > 0) {
            Game.physicsObjects.pop().pool();
        }
        Game.playing = false;
        timeSinceDeath = 0;
        Game.eagle.reset();
        Game.levelGenerator.Restart();
        Game.AddTerrain();
        if (GameSave.specialCharacterToUnlockId) {
            Interface.hideLogo();
            GameSave.showUnlockedSpacialCharacterCharacter(GameSave.specialCharacterToUnlockId, GameSave.specialCharacterToUnlockName);
        } else {
            Interface.showMain();
        }
        Game.configureCameras();
        Interface.moveInUI();
        Game.takesUserInput = true;
        Interface.topScore.visible = false;
        lightInit = false;
        Game.shadowInit = false;
        if (GameSave.specialCharacterUnlocked) {
            GumballMachineScreen.playWithNewCharacter();
            GameSave.specialCharacterUnlocked = false;
        }
    });
};
Game.AddTerrain = () => {
    const rowsToGenerate = 18;
    while (Game.CurrentRow + rowsToGenerate + 1 > currentTerrain) {
        const newRow = Game.levelGenerator.GetStrip(currentTerrain);
        newRow.lane.position.set(0, 0, -currentTerrain);
        Game.rows.push(newRow);
        newRow.MatrixUpdate();
        currentTerrain++;
    }
    while (Game.rows[0].lane.position.z * -1 < Game.CurrentRow - 10) {
        let rowToPool = Game.rows.shift();
        rowToPool.PoolAllObjects();
        rowToPool = null;
    }
};
Game.SetWorld = function (world) {
    if (!Game.playerController) {
        initPlayerController();
    }
    if (world !== AssetLoader.lastRequestedWorld) {
        return;
    }
    Game.switchWorld(world);
    if (!AssetLoader.isWorldLoaded(world)) {
        if (AssetLoader.assetsLoading.length > 0) {
            setTimeout(() => {
                Game.SetWorld(world);
            }, 100);
            return;
        } else {
            if (!AssetLoader.assetsLoading.includes(`models/${world}-world.json`)) {
                Carousel.loadingBar = new LoadingBar();
                Carousel.loadingBar.chickenSrc = AssetLoader.getAssetById('sprites/chicken.png').src;
                AssetLoader.progressListeners = [];
                AssetLoader.progressListeners.push(Carousel.loadingBar.setProgress.bind(Carousel.loadingBar));
                Carousel.loadingBar.show();
                AssetLoader.add.json(`models/${world}-world.json`);
                AssetLoader.worlds[Game.currentWorld].loading = true;
                AssetLoader.load(() => {
                    console.log("Loading!");
                });
                Carousel.loadingBar.enteredFinalLoadingPhase();
            }
            setTimeout(() => {
                Game.SetWorld(world);
            }, 100);
            return;
        }
    }
    AssetLoader.lastRequestedWorld = null;
    if (Carousel.isLoaded) {
        Carousel.close();
    }
    this.currentWorld = world;
    switch (world) {
        case "original_cast":
            Game.currentWorldPieces = OriginalWorldPieces;
            break;
        case "space":
            Game.currentWorldPieces = SpaceWorldPieces;
            break;
    }
    Game.stopSfx('spaceambience1');
    Game.stopSfx('spacewalker/spacewalker_loop');
    if (this.currentWorld === 'space') {
        if (Game.playerController.currentCharacterName === "space_walker") {
            Game.playLoop('spacewalker/spacewalker_loop');
        } else {
            Game.playLoop('spaceambience1');
        }
        Game.eagle = new UFO();
    } else {
        Game.eagle = new Eagle();
    }
    if (Game.space_background == null) {
        const backgroundMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 0), new THREE.ShaderMaterial({
            uniforms: spaceBackgroundShader().uniforms,
            vertexShader: spaceBackgroundShader().vertexShader,
            fragmentShader: spaceBackgroundShader().fragmentShader
        }));
        backgroundMesh.material.depthTest = false;
        backgroundMesh.material.depthWrite = false;
        Game.space_background = new THREE.Scene();
        Game.space_background_camera = new THREE.Camera();
        Game.space_background.add(Game.space_background_camera);
        Game.space_background.add(backgroundMesh);
    }
    Storage.setItem('currentWorld', world);
    CharacterTryouts.setCharacterIfTryingOut();
    Game.playerController.Reset();
    Game.CurrentRow = 0;
    Game.score = 0;
    currentTerrain = -8;
    while (Game.rows.length > 0) {
        let rowToPool = Game.rows.pop();
        rowToPool.PoolAllObjects();
        rowToPool = null;
    }
    while (Game.physicsObjects.length > 0) {
        Game.physicsObjects.pop().pool();
    }
    Game.playing = false;
    timeSinceDeath = 0;
    Game.eagle.reset();
    Game.levelGenerator.Restart();
    Game.AddTerrain();
    gameReady = true;
};
var timeToCarSound = 0.0;
var timeToCarHorn = 6.0;
var timeToRandomCharSound = 6.0;
Game.timeSinceLastBlink = 0;
window.start = () => {
    init();
    animate();
    update();
};
export default Game;