// ISO 3166-1 alpha-2 codes with English names from the browser (Intl.DisplayNames), so the checkout
// does not ship a large country/state dataset. Australia first; the rest alphabetical.
const CODES = 'AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ');

let names;
try {
  names = new Intl.DisplayNames(['en'], { type: 'region' });
} catch {
  names = null;
}
const nameOf = (code) => {
  try {
    return (names && names.of(code)) || code;
  } catch {
    return code;
  }
};

export const COUNTRIES = [
  { code: 'AU', name: 'Australia' },
  ...CODES.filter((c) => c !== 'AU').map((code) => ({ code, name: nameOf(code) })).sort((a, b) => a.name.localeCompare(b.name)),
];

export const countryName = (code) => (code === 'AU' ? 'Australia' : nameOf(code));

export const AU_STATES = [
  { code: 'ACT', name: 'Australian Capital Territory' },
  { code: 'NSW', name: 'New South Wales' },
  { code: 'NT', name: 'Northern Territory' },
  { code: 'QLD', name: 'Queensland' },
  { code: 'SA', name: 'South Australia' },
  { code: 'TAS', name: 'Tasmania' },
  { code: 'VIC', name: 'Victoria' },
  { code: 'WA', name: 'Western Australia' },
];
