export interface KiswahiliTerm {
  sw: string;
  en: string;
  def: string; // plain-Kiswahili explanation
}

export const kiswahiliTerms: KiswahiliTerm[] = [
  {
    sw: "Kituo cha Data",
    en: "Data Centre",
    def: "Jengo maalum lililoandaliwa kuhifadhi seva, vifaa vya mtandao na takwimu za shirika. Kituo hiki kinatoa umeme tulivu, ubaridi, na usalama wa kimwili siku zote — ndiyo 'nyumba' ambapo mtandao unaishi.",
  },
  {
    sw: "Seva",
    en: "Server",
    def: "Kompyuta imara iliyoundwa kufanya kazi bila kuwaka zaidi ya kufanya kazi yake — kuhifadhi tovuti, programu na takwimu. Seva nyingi hufungwa kwenye raki ndani ya kituo cha data.",
  },
  {
    sw: "Huduma za Wingu",
    en: "Cloud Services",
    def: "Njia ya kukodia rasilimali za kompyuta (seva, hifadhi, programu) kupitia mtandao badala ya kununua vifaa wako mwenyewe. Malipo huwa kwa matumizi — kama umeme wa KPLC, lakini kwa kompyuta.",
  },
  {
    sw: "Kolokesheni",
    en: "Colocation",
    def: "Kumiliki seva zako lakini kuweka zake kwenye kituo cha data cha mwingine — unalipa nafasi, umeme, ubaridi na usalama. Ni njia ya bei nafuu kwa biashara ndogo kufurahia miundombinu ya daraja la juu.",
  },
  {
    sw: "Utando wa Mtandao Bila Upendeleo",
    en: "Carrier-Neutral Facility",
    def: "Kituo cha data ambacho haukulazimshwi kununua intaneti kutoka kwa mtoa huduma mmoja — unaweza kuchagua mtandao wowote uliopo kwenye jengo hilo. Hii huokoa pesa na huongaza ushindani.",
  },
  {
    sw: "Uwezo",
    en: "Capacity (MW)",
    def: "Kiasi cha umeme ambacho kituo cha data kinaweza kutumia — kipimo cha ukubwa wake. Inapimwa kwa megawati (MW); MW 1 inatosha takriban nyumba 800 za kawaida.",
  },
  {
    sw: "Raki",
    en: "Rack",
    def: "Fremu ya chuma ya kushikilia seva zilizopishana, kwa kawaida ya urefu wa vitengo 42U. Raki moja inaweza kubeba seva 20–40 kulingana na ukubwa wao.",
  },
  {
    sw: "Umeme wa Dharura",
    en: "Backup Power (UPS & Generators)",
    def: "Mfumo wa betri (UPS) unaoendelea kuipa seva umeme papo hapo mtandao ukikatika, na jenereta inayochukua baadaye. Bila hii, kukatika kwa umeme dakika chache kunaweza kufuta takwimu nyingi.",
  },
  {
    sw: "Mfumo wa Ubaridi",
    en: "Cooling System",
    def: "Seva zina joto sana — ubaridi unazuia vifaa kujikausha. Nairobi ina hali ya hewa ya kupenda, hivyo baadhi ya vituo hutumia hewa huria (free cooling) kuokoa umeme.",
  },
  {
    sw: "Ufanisi wa Nishati (PUE)",
    en: "Power Usage Effectiveness",
    def: "Kipimo cha ufanisi: umeme wote wa kituo gani unakwenda kwenye seva halisi. PUE 1.5 inamaanisha 50% ya umeme unakwenda kwenye ubaridi na mambo mengine. Namba iliyo karibu na 1.0 ni bora.",
  },
  {
    sw: "Daraja la Huduma (Tier)",
    en: "Tier Rating (I–IV)",
    def: "Uainishaji wa Uptime Institute wa uaminifu wa kituo cha data — Tier I (msingi) hadi Tier IV (utaifa wa makosa). Tahadhari: 'Tier III design' ni ahadi ya mchoro; 'Tier III Certified Constructed Facility' ni uthibitisho wa jengo halisi.",
  },
  {
    sw: "Kebo za Chini ya Bahari",
    en: "Submarine Cables",
    def: "Kabeli maalum zinazopita chini ya bahari na kubeba takriban intaneti yote ya kimataifa. Kenya inaishi kwa sita zinazofika Mombasa: SEACOM, TEAMS, EASSy, PEACE, DARE1 na LION2.",
  },
  {
    sw: "Kituo cha Kuingia kwa Kabeli",
    en: "Cable Landing Station",
    def: "Jengo pwani ambapo kebo za chini ya bahari zinafikia nchi — hapo ndipo intaneti ya kimataifa inayoingia Kenya. SEACOM CLS Mombasa ina mtandao 30+ uliojiandikisha.",
  },
  {
    sw: "Kubadilishana Trafiki (Peering)",
    en: "Peering",
    def: "Mitandao miwili kukabidhi trafiki moja kwa moja badala ya kupitia mtu wa tatu — inapunguza gharama na ucheleweshaji. Ikiwa wavuti ya Kenya inaonekana haraka, peering ndiyo sababu.",
  },
  {
    sw: "Kituo cha Kubadilishana Mtandao",
    en: "Internet Exchange Point (IXP)",
    def: "Swichi ya jumla ambapo mitandao ya nchi inakutana kubadilishana trafiki ndani ya nchi. KIXP Nairobi ina wanachama 85 — trafiki ya Kenya inabaki Kenya.",
  },
  {
    sw: "Mtandao Uliojiandikisha",
    en: "Networks Registered (PeeringDB)",
    def: "Idadi ya mitandao iliyothibitisha uwepo wake kwenye jengo fulani kwenye rejista ya PeeringDB — kipimo bora zaidi cha kihadhiari cha 'jengo hili linaunganishwa kwa kina' kwa sababu matangazo ya uuzaji hayasemi.",
  },
  {
    sw: "Ucheleweshaji",
    en: "Latency",
    def: "Muda unaotumika na takwimu kusafiri kutoka A hadi B — kipimo cha milisekunde. Huduma za AI na miamala ya benki zinahitaji ucheleweshaji mdogo; ndiyo sababu seva za karibu na watumiaji ni muhimu.",
  },
  {
    sw: "Ujumuishaji wa Nishati (Redundancy)",
    en: "Redundancy (N+1, 2N)",
    def: "Kuwa na nakala ya kila kipengele muhimu: N+1 inamaanisha 'moja zaidi ya inayohitajika'; 2N inamaanisha 'nakala kamili ya kila kitu'. Ni tofauti kati ya kukatika na kuendelea.",
  },
  {
    sw: "Akili Bandia",
    en: "Artificial Intelligence (AI)",
    def: "Mifano ya kompyuta inayojifunza kutoka takwimu. Maeneo ya AI yanahitaji seva za GPU zenye nguvu kubwa na ubaridi wa kina — ndiyo sababu vituo vipya kama iXAfrica vinajivunia kuwa 'AI-ready'.",
  },
  {
    sw: "Ulinzi wa Takwimu",
    en: "Data Protection",
    def: "Sheria ya Ulinzi wa Data ya Kenya (2019) inadhibiti jinsi takwimu za Watanzania wa Kenya zinavyokusanywa na kutunzwa. Kuhifadhi takwimu ndani ya Kenya kunarahisisha uzingatiaji — hoja moja ya kuweka seva hapa.",
  },
  {
    sw: "Uhifadhi wa Takwimu Ndani ya Nchi",
    en: "Data Sovereignty / Residency",
    def: "Kanuni kwamba takwimu za raani wa nchi zinabaki ndani ya mipaka ya nchi hiyo, au chini ya sheria zake. Serikali na benki zinaanza kuhitaji hii — inaongeza mahitaji ya vituo vya data vya ndani.",
  },
  {
    sw: "Umeme Joto (Jiokalai)",
    en: "Geothermal Power",
    def: "Umeme wa mvuke wa ardhi wa Bonde la Ufa — Kenya ni miongoni mwa nchi bora duniani. Takriban 93% ya umeme wa Kenya (2024) unatoka nishati njiani, hivyo vituo vya data hapa ni 'kijani' kwa asili.",
  },
];
