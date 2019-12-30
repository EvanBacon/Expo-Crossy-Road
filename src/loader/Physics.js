const Physics = {
    Distance2dSq(a, b) {
        return (a.x - b.x) * (a.x - b.x) + (a.z - b.z) * (a.z - b.z);
    },
    IsPointInRect(px, pz, rx, rz, rwidth, rdepth) {
        const rw = rwidth / 2;
        const rd = rdepth / 2;
        return px >= rx - rw && px <= rx + rw && pz >= rz - rd && pz <= rz + rd;
    },
    DoLinesIntersect(ax, aWidth, bx, bWidth) {
        return Math.abs(ax - bx) < (aWidth + bWidth) / 2;
    },
    DoBoxesIntersect(ax, az, aWidth, aDepth, bx, bz, bWidth, bDepth) {
        return Math.abs(ax - bx) < (aWidth + bWidth) / 2 && Math.abs(az - bz) < (aDepth + bDepth) / 2;
    },
    DoesLineSegmentIntersectBox(x0, z0, x1, z1, rectMinX, rectMinZ, rectMaxX, rectMaxZ) {
        let minX = x0;
        let maxX = x1;
        if (x0 > x1) {
            minX = x1;
            maxX = x0;
        }
        if (maxX > rectMaxX) {
            maxX = rectMaxX;
        }
        if (minX < rectMinX) {
            minX = rectMinX;
        }
        if (minX > maxX) {
            return false;
        }
        let minY = z0;
        let maxY = z1;
        const dx = x1 - x0;
        if (Math.abs(dx) > 0.0000001) {
            const a = (z1 - z0) / dx;
            const b = z0 - a * x0;
            minY = a * minX + b;
            maxY = a * maxX + b;
        }
        if (minY > maxY) {
            const tmp = maxY;
            maxY = minY;
            minY = tmp;
        }
        if (maxY > rectMaxZ) {
            maxY = rectMaxZ;
        }
        if (minY < rectMinZ) {
            minY = rectMinZ;
        }
        if (minY > maxY) {
            return false;
        }
        return true;
    }
};

export default Physics;