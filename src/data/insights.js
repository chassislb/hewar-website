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
    id: 'hewar-group-launches-thinkmate',
    title: {
      en: 'Hewar Group Launches ThinkMate',
      ar: 'مجموعة حوار تطلق ThinkMate',
    },
    author: 'Hewar Group',
    role: { en: 'Press release', ar: 'بيان صحفي' },
    category: { en: 'AI & Digital', ar: 'الذكاء الاصطناعي والرقمنة' },
    year: '2026',
    publication: 'Hewar Group',
    excerpt: {
      en: 'Hewar Group today launched ThinkMate, a digital and AI framework for its integrated MarCom operations, supporting structured AI adoption and digital capability development.',
      ar: 'أطلقت مجموعة حوار ThinkMate، إطارًا رقميًا قائمًا على الذكاء الاصطناعي لعملياتها المتكاملة في التسويق والاتصال، لدعم التبنّي المنظّم للذكاء الاصطناعي وتنمية القدرات الرقمية.',
    },
    externalUrl: 'https://hewargroup.com/news/9',
    featured: true,
    body: {
      en: [
        'Hewar Group today launched ThinkMate, a digital and AI framework for its integrated MarCom operations, supporting structured AI adoption and digital capability development.',
        "Hewar Group, a Saudi Arabia-based integrated marketing and communications agency, has launched ThinkMate, its new digital strategy developed to support AI-driven solutions across its operations. The initiative advances Hewar's operating model, establishing a more agile, human-centric framework for digital MarCom.",
        "ThinkMate's launch aligns with Saudi Arabia's declaration of 2026 as the “Year of AI” and contributes to the Kingdom's broader digital transformation under Saudi Vision 2030.",
        "Despite the rapid uptake of AI tools, translating adoption into tangible business impact remains a challenge for the industry. ThinkMate strategy demonstrates Hewar's governance-first approach to digital innovation and value-driven AI use, positioning the agency at the forefront of governed AI adoption within the MENA region's MarCom sector.",
        { quote: '“As innovation adoption accelerates, the absence of clear frameworks and structured approaches has limited how effectively these technologies are supporting business outcomes.”' },
        "“At Hewar Group, we saw an opportunity to rethink how technologies, particularly generative AI, are embedded in day-to-day work to create value across our operations. As a result, we've built a more structured way of working that drives systematic transformation and contributes to raising the standard of MarCom across Saudi Arabia.” Abdulaziz Alghshayan, General Manager, Hewar Group.",
        "Anchored in Hewar's pillars (Think, Create, Communicate), ThinkMate brings all core functions, including strategy, content creation, communications delivery, and performance tracking, onto one shared digital framework. Across departments, structured digital practices are now embedded into daily workflows, strengthening coordination and reinforcing the quality standards that define the agency's delivery.",
        { quote: '“The pace and complexity of today\'s communications landscape and the speed of AI integration in Saudi Arabia require a more connected, disciplined digital approach. ThinkMate represents a natural progression in how we work, reflecting our early move from fragmented productivity tools to a unified digital ecosystem that supports our teams and the work they deliver.”' },
        "“Our priority has been to balance our digital policy with value and efficiency while maintaining empathy and cultural awareness. In parallel, we continue to invest in team upskilling to strengthen our work culture and amplify people-led creativity in line with national priorities.” Loma Jaber, Managing Director, Hewar Group.",
        "ThinkMate also provides a controlled testing environment for AI-enabled MarCom solutions. Every use case undergoes rigorous vetting and formal internal approval, with deployment tracked to maintain alignment with Hewar's quality standards and workplace culture.",
        "Through ThinkMate, Hewar adopts a more disciplined model for technology integration within the sector, combining governance and human capability development. Hewar Group has reaffirmed its commitment to continuously refining and expanding this framework to advance digital maturity across the industry and link it to business impact, while equipping talent to navigate the future of communications with clarity and confidence.",
      ],
    },
  },
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
