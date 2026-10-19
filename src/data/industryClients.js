/*
  Client logos per sector, in the same order as workPage.industries.
  `logo` is the file number. The files in public/logos/industries/ are copies of
  public/logos/clients/ with the viewBox trimmed to the artwork, so every logo
  can be sized by its real shape. `ratio` = trimmed width / height.
  Not placed yet (couldn't confirm the client): 10 (calligraphy mark), 24 (Acrofit), 26 (saei).
*/
const RATIO = {"01": 4.662, "02": 3.683, "03": 3.671, "04": 3.056, "05": 4.575, "06": 0.917, "07": 3.136, "08": 2.215, "09": 5.312, "11": 0.732, "12": 2.616, "13": 1.001, "14": 4.474, "15": 4.575, "16": 2.62, "17": 2.01, "18": 3.513, "19": 3.012, "20": 5.322, "21": 2.433, "22": 1.36, "23": 1.934, "25": 2.999, "27": 0.821, "28": 0.748, "29": 2.319, "31": 1.006, "32": 1.684, "34": 0.847, "36": 4.88, "37": 3.244}

export const industryClients = [
  /* Telecommunications & Technology */
  [{ logo: '31', name: 'Zain' }, { logo: '25', name: 'intigral' }, { logo: '12', name: 'Tabadul' }],
  /* Government & Public Services */
  [
    { logo: '02', name: 'Riyadh Region Municipality' },
    { logo: '05', name: 'Zakat, Tax and Customs Authority' },
    { logo: '15', name: 'National Competitiveness Center' },
    { logo: '18', name: 'Ministry of Investment' },
    { logo: '36', name: 'Saudi Customs' },
    { logo: '37', name: 'Local Content & Government Procurement Authority' },
  ],
  /* Financial & Economic Development */
  [
    { logo: '17', name: 'Invest Saudi' },
    { logo: '14', name: 'Saudi Payments' },
    { logo: '23', name: 'Saudi Industrial Development Fund' },
    { logo: '20', name: 'Saudi Exports Development Authority' },
    { logo: '19', name: 'Saudi Made' },
    { logo: '13', name: 'Najm' },
  ],
  /* Transportation & Logistics */
  [{ logo: '28', name: 'Mawani' }, { logo: '29', name: 'flynas' }, { logo: '04', name: 'King Fahd Causeway Authority' }],
  /* Tourism, Culture & Hospitality */
  [
    { logo: '09', name: 'Royal Commission for AlUla' },
    { logo: '27', name: 'General Entertainment Authority' },
    { logo: '22', name: 'Makarem' },
    { logo: '16', name: 'Taiba Investments' },
  ],
  /* Energy & Environmental Sustainability */
  [
    { logo: '06', name: 'NEOM' },
    { logo: '01', name: 'King Abdulaziz Royal Reserve Development Authority' },
    { logo: '32', name: 'Saudi Geological Survey' },
  ],
  /* Research & Education */
  [{ logo: '03', name: 'King Salman Global Academy for Arabic Language' }, { logo: '34', name: 'Scholarship Services Center' }],
  /* Health & Medical Sector */
  [{ logo: '07', name: 'King Faisal Specialist Hospital & Research Centre' }],
  /* Real Estate & Infrastructure */
  [{ logo: '08', name: 'Real Estate Registry' }, { logo: '11', name: 'Kingdom Centre' }, { logo: '21', name: 'Shomoul' }],
].map((list) => list.map((c) => ({ ...c, ratio: RATIO[c.logo], src: `/hewar-website/logos/industries/${c.logo}.svg` })))

/* optical sizing: wide marks shorter, square marks taller, solid marks a touch smaller */
const TRIM = { 13: 0.78, 19: 0.9 }
export const logoHeight = (c) => Math.round(74 * Math.pow(c.ratio, -0.44) * (TRIM[c.logo] || 1))
