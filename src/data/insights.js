/*
 * Only include entries here that are confirmed, publicly verifiable HEWAR/Loma Jaber
 * thought leadership. Do not add unverified external citations.
 *
 * Required: id, title{en,ar}, author, role{en,ar}, category{en,ar}, year,
 *           publication, excerpt{en,ar}, externalUrl
 * Optional: image        cover picture (path under /hewar-website/...). Without it
 *                        a generated brand cover is used.
 *           featured     true to pin this one as the big feature (default: newest)
 *           body         { en: [...], ar: [...] } to host the full text on this site.
 *                        Each item is a paragraph string, { h: 'Heading' } or
 *                        { quote: 'Pull quote' }.
 */
export const insights = [
  {
    id: 'saudi-arabia-dream-for-every-marketer',
    title: {
      en: 'Saudi Arabia Is the Dream for Every Marketer',
      ar: 'السعودية هي حلم كل مسوّق',
    },
    author: 'Loma Jaber',
    role: {
      en: 'Managing Director, HEWAR Group',
      ar: 'المدير التنفيذي، مجموعة حوار',
    },
    category: { en: 'Saudi Market', ar: 'السوق السعودي' },
    year: '2024',
    publication: 'Campaign Middle East',
    excerpt: {
      en: 'A perspective on Saudi consumers, authenticity, digital transformation and the changing agency model in the Kingdom.',
      ar: 'رؤية حول المستهلك السعودي، والأصالة، والتحول الرقمي، وتغيّر نموذج عمل الوكالات في المملكة.',
    },
    externalUrl: 'https://campaignme.com/saudi-arabia-is-the-dream-for-every-marketer/',
  },
]
