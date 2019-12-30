import * THREE from 'three';

const Storage = {
    noStorage: null,
    data: {},
    detectLocalStorage: function detectLocalStorage() {
        this.noStorage = false;
        try {
            localStorage.setItem('test', 0);
        } catch (e) {
            this.noStorage = true;
        }
    },
    getItem: function getItem(key) {
        if (this.noStorage === null) {
            this.detectLocalStorage();
        }
        if (this.noStorage) {
            if (typeof this.data[key] === 'undefined') {
                return null;
            }
            return this.data[key];
        }
        if (typeof this.data[key] !== 'undefined') {
            return this.data[key];
        }
        const value = localStorage.getItem(key);
        this.data[key] = value;
        return value;
    },
    setItem: function setItem(key, value) {
        if (this.noStorage === null) {
            this.detectLocalStorage();
        }
        this.data[key] = value;
        if (this.noStorage) {
            return;
        }
        localStorage.setItem(key, value);
    }
};
export default Storage;