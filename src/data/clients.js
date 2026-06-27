export const clients = Array.from({ length: 36 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0')

  return {
    name: `HEWAR Client ${number}`,
    logo: `/hewar-website/logos/clients/Hewar P logos (1)-${number}.svg`,
  }
})