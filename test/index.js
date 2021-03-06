// @flow

import { it } from 'mocha'
import { expect, assert } from 'chai'
import strict, { loose, type Point } from '../src'

it('returns NaN for zero points', () => {
  expect(loose([])).to.deep.equal([NaN, NaN, NaN, NaN])
})

it('returns zero radius for one point', () => {
  expect(loose([[1, 1, 1]])).to.deep.equal([1, 1, 1, 0])
})

it('uses two points as diameter', () => {
  expect(loose([[0, 0, 0], [1, 1, 1]])).to.deep.equal([0.5, 0.5, 0.5, 0.75])
})

it('writes to output argument if given', () => {
  const sphere = [0, 0, 0, 0]
  loose([[0, 0, 0], [1, 1, 1]], sphere)
  expect(sphere).to.deep.equal([0.5, 0.5, 0.5, 0.75])
})

it("third point obviously inside sphere doesn't expand it", () => {
  expect(loose([[0, 0, 0], [1, 1, 1], [0.6, 0.4, 0.3]])).to.deep.equal([
    0.5,
    0.5,
    0.5,
    0.75,
  ])
})

function test(points: Iterable<Point>) {
  const sphere = loose(points)
  let farthestDist = -1
  let farthestPoint
  for (let point of points) {
    const dx = sphere[0] - point[0]
    const dy = sphere[1] - point[1]
    const dz = sphere[2] - point[2]
    const d = dx * dx + dy * dy + dz * dz
    if (d > farthestDist) {
      farthestDist = d
      farthestPoint = point
    }
    assert(
      d <= sphere[3] + 1e-12,
      `expected sphere ${String(sphere)} to contain point ${String(point)} ${d -
        sphere[3]}}`
    )
  }
  assert(
    farthestDist > sphere[3] * 0.99 * 0.99,
    `expected farthest point ${String(
      farthestPoint
    )} distance squared ${farthestDist} to be closer to radius of sphere ${String(
      sphere
    )}`
  )
  const strictSphere = strict(points)
  expect(strictSphere.slice(0, 3)).to.deep.equal(sphere.slice(0, 3))
  expect(strictSphere[3] / sphere[3]).to.be.below(1 + 1e-12)
  assert(
    farthestDist <= strictSphere[3],
    `expected farthest point ${String(
      farthestPoint
    )} distance squared ${farthestDist} to be within to radius squared of strict sphere ${String(
      sphere
    )}`
  )
}

it('tetrahedron', () => {
  test([[0, 0, 0], [1, 1, 0], [1, 0, 1], [0, 1, 1]])
})

it('random', () => {
  for (let i = 0; i < 100; i++) {
    const points = []
    for (let j = 0; j < 100; j++) {
      points.push([Math.random(), Math.random(), Math.random()])
    }
    test(points)
  }
})
