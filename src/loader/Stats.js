import * THREE from 'three';

function Stats() {
    function k(a) {
        for (let d = 0; d < c.children.length; d++) {
            c.children[d].style.display = d === a ? "block" : "none";
        }
        l = a;
    }

    function h(a) {
        c.appendChild(a.dom);
        return a;
    }
    var l = 0;
    var c = document.createElement("div");
    c.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";
    c.addEventListener("click", a => {
        a.preventDefault();
        k(++l % c.children.length);
    }, !1);
    let g = (performance || Date).now();
    let e = g;
    let a = 0;
    const r = h(new Stats.Panel("FPS", "#0ff", "#002"));
    const f = h(new Stats.Panel("MS", "#0f0", "#020"));
    if (self.performance && self.performance.memory) {
        var t = h(new Stats.Panel("MB", "#f08", "#201"));
    }
    k(0);
    return {
        REVISION: 16,
        dom: c,
        addPanel: h,
        showPanel: k,
        begin: function begin() {
            g = (performance || Date).now();
        },
        end: function end() {
            a++;
            const c = (performance || Date).now();
            f.update(c - g, 200);
            if (c > e + 1E3 && (r.update(1E3 * a / (c - e), 100), e = c, a = 0, t)) {
                const d = performance.memory;
                t.update(d.usedJSHeapSize / 1048576, d.jsHeapSizeLimit / 1048576);
            }
            return c;
        },
        update: function update() {
            g = this.end();
        },
        domElement: c,
        setMode: k
    };
};

Stats.Panel = (h, k, l) => {
    let c = Infinity;
    let g = 0;
    const e = Math.round;
    const a = e(window.devicePixelRatio || 1);
    const r = 80 * a;
    const f = 48 * a;
    const t = 3 * a;
    const u = 2 * a;
    const d = 3 * a;
    const m = 15 * a;
    const n = 74 * a;
    const p = 30 * a;
    const q = document.createElement("canvas");
    q.width = r;
    q.height = f;
    q.style.cssText = "width:80px;height:48px";
    const b = q.getContext("2d");
    b.font = `bold ${9 * a}px Helvetica,Arial,sans-serif`;
    b.textBaseline = "top";
    b.fillStyle = l;
    b.fillRect(0, 0, r, f);
    b.fillStyle = k;
    b.fillText(h, t, u);
    b.fillRect(d, m, n, p);
    b.fillStyle = l;
    b.globalAlpha = .9;
    b.fillRect(d, m, n, p);
    return {
        dom: q,
        update: function update(f, v) {
            c = Math.min(c, f);
            g = Math.max(g, f);
            b.fillStyle = l;
            b.globalAlpha = 1;
            b.fillRect(0, 0, r, m);
            b.fillStyle = k;
            b.fillText(`${e(f)} ${h} (${e(c)}-${e(g)})`, t, u);
            b.drawImage(q, d + a, m, n - a, p, d, m, n - a, p);
            b.fillRect(d + n - a, m, a, p);
            b.fillStyle = l;
            b.globalAlpha = .9;
            b.fillRect(d + n - a, m, a, e((1 - f / v) * p));
        }
    };
};

export default Stats;