// @flow

import assert from 'assert'

export type Point = [number, number, number]
export type Sphere = [number, number, number, number]

module.exports = function ritterBoundingSphere(
  points: Iterable<Point>,
  sphere?: Sphere
): Sphere {
  function result(x: number, y: number, z: number, r2: number): Sphere {
    if (!sphere) return [x, y, z, r2]
    sphere[0] = x
    sphere[1] = y
    sphere[2] = z
    sphere[3] = r2
    return sphere
  }

  let x0 = NaN
  let y0 = NaN
  let z0 = NaN

  let x1 = NaN
  let y1 = NaN
  let z1 = NaN
  let d1 = 0

  let x2 = NaN
  let y2 = NaN
  let z2 = NaN
  let d2 = 0

  // get first point, x0
  // $FlowFixMe
  let iterator = points[Symbol.iterator]()
  let { value: point, done } = iterator.next()
  if (done) return result(NaN, NaN, NaN, NaN)
  ;[x0, y0, z0] = point

  // find point x1 farthest from x0
  while ((({ value: point, done } = iterator.next()), !done)) {
    const dx = point[0] - x0
    const dy = point[1] - y0
    const dz = point[2] - z0
    const d = dx * dx + dy * dy + dz * dz
    if (d > d1) {
      x1 = point[0]
      y1 = point[1]
      z1 = point[2]
      d1 = d
    }
  }
  if (d1 === 0) return result(x0, y0, z0, 0)

  // find point x2 farthest from x1
  for (let point of points) {
    const dx = point[0] - x1
    const dy = point[1] - y1
    const dz = point[2] - z1
    const d = dx * dx + dy * dy + dz * dz
    if (d > d2) {
      x2 = point[0]
      y2 = point[1]
      z2 = point[2]
      d2 = d
    }
  }

  // start with a sphere with diameter x1 to x2
  let x = (x1 + x2) / 2
  let y = (y1 + y2) / 2
  let z = (z1 + z2) / 2
  let rsq = d2 / 4
  let r = Math.sqrt(rsq)

  // check if each point is inside sphere
  // if a point is outside, enlarge sphere to contain it
  for (let point of points) {
    const dx = point[0] - x
    const dy = point[1] - y
    const dz = point[2] - z
    const dsq = dx * dx + dy * dy + dz * dz
    if (dsq > rsq) {
      const d = Math.sqrt(dsq)
      r = (r + d) / 2
      const factor = r / d
      x = point[0] - dx * factor
      y = point[1] - dy * factor
      z = point[2] - dz * factor
      // make the radius just a tad bigger to ensure that prior points are still
      // inside sphere despite floating point error
      r *= 1.0000000001
      rsq = r * r
    }
  }

  return result(x, y, z, rsq)
}
