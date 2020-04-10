// See: https://medium.com/code-nebula/automatically-generate-chart-colors-with-chart-js-d3s-color-scales-f62e282b2b41

// import { interpolateViridis as defaultColorFunction } from 'd3-scale-chromatic'
import { interpolatePurples, interpolatePlasma as defaultColorFunction } from 'd3-scale-chromatic'

function calculatePoint (i, intervalSize, colorRangeInfo) {
  const { colorStart, colorEnd, useEndAsStart } = colorRangeInfo
  return useEndAsStart ? (colorEnd - (i * intervalSize)) : (colorStart + (i * intervalSize))
}

export function interpolateSingleColor (value, max, colorRangeInfo = { colorStart: 0.2, colorEnd: 1.0, useEndAsStart: false }, colorScale = interpolatePurples) {
  const { colorStart, colorEnd } = colorRangeInfo
  const colorRange = colorEnd - colorStart
  const intervalSize = colorRange / max
  const point = calculatePoint(value, intervalSize, colorRangeInfo)
  return colorScale(point)
}

/**
 * Generate and return an array of colors using D3's chromatic interpolation library
 */
export function interpolateColors (dataLength, colorRangeInfo = { colorStart: 0, colorEnd: 0.9, useEndAsStart: true }, colorScale = defaultColorFunction) {
  const { colorStart, colorEnd } = colorRangeInfo
  const colorRange = colorEnd - colorStart
  const intervalSize = colorRange / dataLength
  const colorArray = []

  for (let i = 0; i < dataLength; i++) {
    const colorPoint = calculatePoint(i, intervalSize, colorRangeInfo)
    colorArray.push(colorScale(colorPoint))
  }
  return colorArray
}
