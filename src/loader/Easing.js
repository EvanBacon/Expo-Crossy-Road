const Easing = {};
Easing.easeInQuad = t => t * t;
Easing.easeOutQuad = t => -1 * t * (t - 2);
Easing.easeInOutSin = t => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
Easing.easeInCubic = t => 1 * t * t * t;
Easing.easeInOutCubic = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
Easing.easeOutQuart = t => 1 - --t * t * t * t;
Easing.easeInQuint = t => 1 * t * t * t * t * t;
Easing.easeOutQuint = t => 1 * (t * t * t * t * t + 1);
Easing.easeOutBounce = t => {
    if ((t /= 1) < 1 / 2.75) {
        return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
        return 7.5625 * (t -= 1.5 / 2.75) * t + .75;
    } else if (t < 2.5 / 2.75) {
        return 7.5625 * (t -= 2.25 / 2.75) * t + .9375;
    } else {
        return 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
    }
};
export default Easing;