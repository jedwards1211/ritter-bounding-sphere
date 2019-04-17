# ritter-bounding-sphere

[![CircleCI](https://circleci.com/gh/jedwards1211/ritter-bounding-sphere.svg?style=svg)](https://circleci.com/gh/jedwards1211/ritter-bounding-sphere)
[![Coverage Status](https://codecov.io/gh/jedwards1211/ritter-bounding-sphere/branch/master/graph/badge.svg)](https://codecov.io/gh/jedwards1211/ritter-bounding-sphere)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/ritter-bounding-sphere.svg)](https://badge.fury.io/js/ritter-bounding-sphere)

Compute bounding sphere for a set of points using Jack Ritter's algorithm

## `require('ritter-bounding-sphere')(points, [output])`

Computes a bounding sphere for `points`, which must be an
`Iterable<[x, y, z]>`. The iterator can mutate and return the
same array instance if desired.

Returns the bounding sphere as an array of the form `[x, y, z, radiusSquared]`
where `x, y, z` is the center. You can pass the `output` array to store the
result in if you want to avoid the array allocation.

## Adapting other point formats

`ritter-bounding-sphere` accepts point data in arrays so that you can optionally
use `Float32Array`/`Float64Array`s for speed. But if your points are in a
different format you can easily adapt them to this library.

Let's say your points are in `{x: number, y: number, z: number}` format instead,
and you want to output a bounding sphere of the form
`{center: {x: number, y: number, z: number}, radius: number}`.
Here's how your adapter could work:

```js
const boundingSphere = require('ritter-bounding-sphere')

export function myBoundingSphere(points) {
  const point = [0, 0, 0]
  function* adapter() {
    for (let { x, y, z } of points) {
      point[0] = x
      point[1] = y
      point[2] = z
      yield point
    }
  }
  const [x, y, z, r2] = boundingSphere(adapter())
  return {
    center: { x, y, z },
    radius: Math.sqrt(r2),
  }
}
```
