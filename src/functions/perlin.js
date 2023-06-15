// From https://en.wikipedia.org/wiki/Perlin_noise

/* Function to linearly interpolate between a0 and a1
 * Weight w should be in the range [0.0, 1.0]
 */
function interpolate(a0, a1, w) {
    /* // You may want clamping by inserting:
     * if (0.0 > w) return a0;
     * if (1.0 < w) return a1;
     */

    return (a1 - a0) * w + a0;
    /* // Use this cubic interpolation [[Smoothstep]] instead, for a smooth appearance:
     * return (a1 - a0) * (3.0 - w * 2.0) * w * w + a0;
     *
     * // Use [[Smootherstep]] for an even smoother result with a second derivative equal to zero on boundaries:
     * return (a1 - a0) * ((w * (w * 6.0 - 15.0) + 10.0) * w * w * w) + a0;
     */
}

/* Create pseudorandom direction vector
 */
function randomGradient() {
    let random = Math.random() * 2 * Math.PI;
    const v = {
        x: Math.cos(random),
        y: Math.sin(random),
    };

    return v;
}

const memory = {};

// Computes the dot product of the distance and gradient vectors.
function dotGridGradient(ix, iy, x, y) {
    // Get gradient from integer coordinates
    const key = ix + '-' + iy;
    let gradient = memory[key];
    if(!gradient) {
        memory[key] = randomGradient(ix, iy);
        gradient = memory[key];
    }

    // Compute the distance vector
    const dx = x - ix;
    const dy = y - iy;

    // Compute the dot-product
    return (dx*gradient.x + dy*gradient.y);
}

// Compute Perlin noise at coordinates x, y
export default function perlin(realX, realY, gridPixelSize) {
    const x = realX / gridPixelSize;
    const y = realY / gridPixelSize;

    // Determine grid cell coordinates
    const x0 = Math.floor(x);
    const x1 = x0 + 1;
    const y0 = Math.floor(y);
    const y1 = y0 + 1;

    // Determine interpolation weights
    // Could also use higher order polynomial/s-curve here
    const sx = x - x0;
    const sy = y - y0;

    // Interpolate between grid point gradients
    let n0 = dotGridGradient(x0, y0, x, y);
    let n1 = dotGridGradient(x1, y0, x, y);
    const ix0 = interpolate(n0, n1, sx);

    n0 = dotGridGradient(x0, y1, x, y);
    n1 = dotGridGradient(x1, y1, x, y);
    const ix1 = interpolate(n0, n1, sx);

    return interpolate(ix0, ix1, sy); 
}