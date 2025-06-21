// https://github.com/lukeed/kleur/blob/master/colors.mjs

// The MIT License (MIT)

// Copyright (c) Luke Edwards <luke.edwards05@gmail.com> (lukeed.com)

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

function init(x, y) {
  const rgx = new RegExp(`\\x1b\\[${y}m`, 'g')
  const open = `\x1b[${x}m`
  const close = `\x1b[${y}m`

  return (e, txt) => {
    if (!e || txt == null) return txt
    // biome-ignore lint/style/noParameterAssign: explanation
    txt = txt.toString()
    return `${open}${
      txt.includes(close) ? txt.replace(rgx, close + open) : txt
    }${close}`
  }
}

// modifiers
export const reset = init(0, 0)
export const bold = init(1, 22)
export const dim = init(2, 22)
export const italic = init(3, 23)
export const underline = init(4, 24)
export const inverse = init(7, 27)
export const hidden = init(8, 28)
export const strikethrough = init(9, 29)

// colors
export const black = init(30, 39)
export const red = init(31, 39)
export const green = init(32, 39)
export const yellow = init(33, 39)
export const blue = init(34, 39)
export const magenta = init(35, 39)
export const cyan = init(36, 39)
export const white = init(37, 39)
export const gray = init(90, 39)

// bright colors
export const blackBright = init(90, 39)
export const redBright = init(91, 39)
export const greenBright = init(92, 39)
export const yellowBright = init(93, 39)
export const blueBright = init(94, 39)
export const magentaBright = init(95, 39)
export const cyanBright = init(96, 39)
export const whiteBright = init(97, 39)

// background colors
export const bgBlack = init(40, 49)
export const bgRed = init(41, 49)
export const bgGreen = init(42, 49)
export const bgYellow = init(43, 49)
export const bgBlue = init(44, 49)
export const bgMagenta = init(45, 49)
export const bgCyan = init(46, 49)
export const bgWhite = init(47, 49)

// bright background colors
export const bgBlackBright = init(100, 49)
export const bgRedBright = init(101, 49)
export const bgGreenBright = init(102, 49)
export const bgYellowBright = init(103, 49)
export const bgBlueBright = init(104, 49)
export const bgMagentaBright = init(105, 49)
export const bgCyanBright = init(106, 49)
export const bgWhiteBright = init(107, 49)
