class PasrTimer {
    stage = 4;
    stageTime;
    timer;
    value;
    queriedSustain = false;
    queriedRelease = false;
    queriedFinished = true;

    constructor(pause, attack, sustain, release) {
        this.stageTime = [pause, attack, sustain, release];
    }

    getPauseTime() {
        return this.stageTime[0];
    }

    setPauseTime(value) {
        this.stageTime[0] = value;
    }

    getAttackTime() {
        return this.stageTime[1];
    }

    setAttackTime(value) {
        this.stageTime[1] = value;
    }

    getSustainTime() {
        return this.stageTime[2];
    }

    setSustainTime(value) {
        this.stageTime[2] = value;
    }

    getReleaseTime() {
        return this.stageTime[3];
    }

    setReleaseTime(value) {
        this.stageTime[3] = value;
    }

    GetPauseTime() {
        return this.stageTime[0];
    }

    GetAttackTime() {
        return this.stageTime[1];
    }

    GetSustainTime() {
        return this.stageTime[2];
    }

    GetReleaseTime() {
        return this.stageTime[3];
    }

    GetDuration() {
        return this.stageTime[0] + this.stageTime[1] + this.stageTime[2] + this.stageTime[3];
    }

    Tick(deltaTime) {
        
        if (this.stage == 4) {
            this.value = 0;
            return 0;
        }
        while (this.stage < 4 && (this.timer >= 1 || this.stageTime[this.stage] == 0)) {
            this.timer = 0;
            this.stage++;
        }
        if (this.stage < 4) {
            this.timer += deltaTime / this.stageTime[this.stage];
            if (this.timer > 1) {
                this.timer = 1;
            }
        }
        if (this.stage == 0) {
            this.value = 0;
        } else if (this.stage == 1) {
            this.value = this.timer;
        } else if (this.stage == 2) {
            this.value = 1;
        } else if (this.stage == 3) {
            this.value = 1 - this.timer;
        } else {
            this.value = 0;
        }
        return this.value;
    }

    GetValue() {
        return this.value;
    }

    reachedSustain() {
        if (this.queriedSustain) {
            return false;
        }
        if (this.stage >= 2) {
            this.queriedSustain = true;
            return true;
        }
        return false;
    }

    reachedRelease() {
        if (this.queriedRelease) {
            return false;
        }
        if (this.stage >= 3) {
            this.queriedRelease = true;
            return true;
        }
        return false;
    }

    isFinished() {
        return this.stage == 4;
    }

    reachedFinished() {
        if (this.stage == 4 && !this.queriedFinished) {
            this.queriedFinished = true;
            return true;
        } else {
            return false;
        }
    }

    Reset() {
        this.stage = 0;
        this.timer = 0;
        this.value = 0;
        this.queriedSustain = false;
        this.queriedFinished = false;
    }

    Complete() {
        this.Reset();
        this.stage = 4;
    }

    Stop() {
        this.stage = 4;
    }

    GetStage() {
        return this.stage;
    }

    SetStage(stage) {
        this.stage = stage;
        this.timer = 0;
    }

    TotalTime() {
        return this.stageTime[0] + this.stageTime[1] + this.stageTime[2] + this.stageTime[3];
    }
}

export default PasrTimer;