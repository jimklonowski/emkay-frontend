import { interpolateViridis as defaultColorFunction } from 'd3-scale-chromatic'

function calculatePoint (i, intervalSize, colorRangeInfo) {
  const { colorStart, colorEnd, useEndAsStart } = colorRangeInfo
  return useEndAsStart ? (colorEnd - (i * intervalSize)) : (colorStart + (i * intervalSize))
}

/**
 * Generate and return an array of colors using D3's chromatic interpolation library
 */
export function interpolateColors (dataLength, colorScale = defaultColorFunction, colorRangeInfo = { colorStart: 0, colorEnd: 1, useEndAsStart: true }) {
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
