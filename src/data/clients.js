/* Only these logo numbers exist in public/logos/clients — do not assume a contiguous range */
const LOGO_NUMBERS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29,
  31, 32, 34, 36, 37,
]

export const clients = LOGO_NUMBERS.map((n) => {
  const number = String(n).padStart(2, '0')

  return {
    name: `HEWAR Client ${number}`,
    logo: `/hewar-website/logos/clients/Hewar P logos (1)-${number}.svg`,
  }
})