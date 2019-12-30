import * THREE from 'three';

const dimensions = {
    lowest_average_fps: 'dimension1',
    lowest_percentage_below_half_of_average_of_fps: 'dimension2'
};
const dataPoints = 250;
const samples = 10;
const fpsTracker = {
    fps: [],
    tracked: 0,
    highestPercBelowHalfOfAverage: -1,
    lowestAverage: Infinity,
    update(deltaTime) {
        if (this.tracked >= samples) {
            return;
        }
        const currentRate = 1000 / deltaTime / 1000;
        this.fps.push(currentRate);
        this.lowPoint = Math.min(this.lowPoint, currentRate);
        this.highPoint = Math.max(this.highPoint, currentRate);
        if (this.fps.length === dataPoints) {
            const rates = [];
            let total = 0;
            while (this.fps.length > 0) {
                var rate = this.fps.pop();
                total += rate;
                rates.push(rate);
            }
            const avgFps = Math.round(total / dataPoints);
            let amountBelowHalfOfAverage = 0;
            for (let idx = 0; idx < rates.length; idx++) {
                var rate = rates[idx];
                if (rate <= avgFps / 2) {
                    amountBelowHalfOfAverage++;
                }
            }
            const percBelowHalfOfAverage = Math.max(amountBelowHalfOfAverage / dataPoints, 0);
            analytics.track('technical_performance', 'fps', 'perc_below_half_of_average', percBelowHalfOfAverage, true);
            analytics.track('technical_performance', 'fps', 'avg', avgFps, true);
            if (avgFps < this.lowestAverage) {
                analytics.setDimension(dimensions.lowest_average_fps, avgFps);
                this.lowestAverage = avgFps;
            }
            if (percBelowHalfOfAverage > this.highestPercBelowHalfOfAverage) {
                analytics.setDimension(dimensions.lowest_percentage_below_half_of_average_of_fps, percBelowHalfOfAverage);
                this.highestPercBelowHalfOfAverage = percBelowHalfOfAverage;
            }
            this.tracked++;
        }
    }
};
export default fpsTracker;