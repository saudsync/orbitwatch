/* ═══════════════════════════════════════
   ORBITWATCH — SATELLITE DATABASE
   ═══════════════════════════════════════ */

const SATELLITES = [
  {
    name: "ISS (ZARYA)", norad: "25544", cat: "station",
    icon: "🛸",
    desc: "The International Space Station is a modular space station in low Earth orbit. A joint project of NASA, Roscosmos, JAXA, ESA, and CSA, it has been continuously inhabited since November 2000 and serves as a unique science laboratory.",
    tle1: "1 25544U 98067A   24001.50000000  .00016717  00000-0  10270-3 0  9993",
    tle2: "2 25544  51.6416 247.4627 0006703 130.5360 325.0288 15.50000000000000",
    launch: "1998-11-20", country: "Multinational", mass: "420,000 kg", purpose: "Research & Habitation"
  },
  {
    name: "STARLINK-1130", norad: "44914", cat: "comms",
    icon: "📡",
    desc: "SpaceX Starlink is a satellite internet constellation providing high-speed internet to over 60 countries. Starlink satellites operate in shells at ~550 km altitude and use laser inter-satellite links for global coverage.",
    tle1: "1 44914U 20001E   24001.50000000  .00001000  00000-0  10000-3 0  9990",
    tle2: "2 44914  53.0000 100.0000 0001234  90.0000 270.0000 15.05000000000000",
    launch: "2020-01-07", country: "USA", mass: "260 kg", purpose: "Internet Broadband"
  },
  {
    name: "HUBBLE SPACE TELESCOPE", norad: "20580", cat: "obs",
    icon: "🔭",
    desc: "The Hubble Space Telescope, launched in 1990, is one of the largest and most versatile space telescopes. It has contributed to fundamental breakthroughs including the discovery of dark energy, precise measurements of the Hubble constant, and stunning imagery of distant galaxies.",
    tle1: "1 20580U 90037B   24001.50000000  .00000000  00000-0  00000-0 0  9990",
    tle2: "2 20580  28.4689  53.3300 0002715  68.4148 291.7350 15.08500000000000",
    launch: "1990-04-24", country: "USA", mass: "11,110 kg", purpose: "Space Telescope"
  },
  {
    name: "TIANGONG CSS", norad: "48274", cat: "station",
    icon: "🏛️",
    desc: "China's Tiangong Space Station (CSS) is a modular orbital outpost in low Earth orbit. The core module Tianhe launched in April 2021. It hosts taikonauts conducting science experiments and represents China's milestone in long-duration human spaceflight.",
    tle1: "1 48274U 21035A   24001.50000000  .00015000  00000-0  16000-3 0  9995",
    tle2: "2 48274  41.4700 280.0000 0006000 120.0000 240.0000 15.60000000000000",
    launch: "2021-04-29", country: "China", mass: "66,000 kg", purpose: "Research & Habitation"
  },
  {
    name: "TERRA", norad: "25994", cat: "earth",
    icon: "🌍",
    desc: "Terra is NASA's flagship Earth Observation satellite launched in 1999. It carries five sensors that observe Earth's atmosphere, land surface, oceans, and solar energy. Terra data helps scientists understand how Earth is changing.",
    tle1: "1 25994U 99068A   24001.50000000  .00000000  00000-0  30000-4 0  9990",
    tle2: "2 25994  98.2000  60.0000 0001500  80.0000 280.0000 14.57000000000000",
    launch: "1999-12-18", country: "USA", mass: "5,190 kg", purpose: "Earth Observation"
  },
  {
    name: "SENTINEL-1A", norad: "39634", cat: "earth",
    icon: "📷",
    desc: "Sentinel-1A is an ESA C-band SAR satellite providing radar imagery day and night in all weather. It supports emergency management, sea ice observation, forest monitoring, and Earth's surface motion mapping.",
    tle1: "1 39634U 14016A   24001.50000000  .00000100  00000-0  20000-4 0  9990",
    tle2: "2 39634  98.1800  20.0000 0001300  90.0000 270.0000 14.59000000000000",
    launch: "2014-04-03", country: "Europe/ESA", mass: "2,300 kg", purpose: "SAR Imaging"
  },
  {
    name: "GPS BIIR-2", norad: "28361", cat: "nav",
    icon: "🧭",
    desc: "GPS Block IIR satellites form part of the Global Positioning System constellation operated by the US Air Force. They transmit precise navigation, positioning, and timing signals used by billions of devices worldwide.",
    tle1: "1 28361U 04023A   24001.50000000  .00000020  00000-0  00000-0 0  9990",
    tle2: "2 28361  55.4000 210.0000 0100000  60.0000 300.0000  2.00500000000000",
    launch: "2004-06-23", country: "USA", mass: "2,032 kg", purpose: "Navigation"
  },
  {
    name: "NOAA-19", norad: "33591", cat: "earth",
    icon: "🌩️",
    desc: "NOAA-19 is the last of the POES (Polar Operational Environmental Satellites) series. It provides global atmospheric soundings and imagery for weather forecasting, search and rescue, and environmental monitoring from a polar sun-synchronous orbit.",
    tle1: "1 33591U 09005A   24001.50000000 -.00000020  00000-0 -15000-4 0  9990",
    tle2: "2 33591  99.1000  40.0000 0014000  80.0000 280.0000 14.12000000000000",
    launch: "2009-02-06", country: "USA/NOAA", mass: "1,457 kg", purpose: "Weather & Environment"
  },
  {
    name: "AQUA", norad: "27424", cat: "earth",
    icon: "💧",
    desc: "Aqua is a NASA Earth-observing satellite focused on water in Earth's systems — oceans, clouds, sea ice, precipitation, and water vapor. Launched in 2002, it carries six instruments providing critical climate data.",
    tle1: "1 27424U 02022A   24001.50000000  .00000050  00000-0  35000-4 0  9990",
    tle2: "2 27424  98.2000  55.0000 0001000  85.0000 275.0000 14.57000000000000",
    launch: "2002-05-04", country: "USA", mass: "2,934 kg", purpose: "Climate & Water"
  },
  {
    name: "LANDSAT 9", norad: "49260", cat: "earth",
    icon: "🗺️",
    desc: "Landsat 9 continues the world's longest-running record of Earth's surface from space, first begun in 1972. It captures medium-resolution imagery for agriculture, forestry, land management, disaster response, and change detection.",
    tle1: "1 49260U 21088A   24001.50000000  .00000050  00000-0  35000-4 0  9990",
    tle2: "2 49260  98.2000  58.0000 0001100  87.0000 273.0000 14.57000000000000",
    launch: "2021-09-27", country: "USA/USGS", mass: "2,750 kg", purpose: "Land Imaging"
  },
  {
    name: "GOES-18", norad: "51850", cat: "earth",
    icon: "🌪️",
    desc: "GOES-18 is NOAA's latest geostationary weather satellite covering the western US and Pacific Ocean. It provides rapid-refresh imagery for severe storm tracking, hurricane monitoring, and fire detection from 35,786 km altitude.",
    tle1: "1 51850U 22021A   24001.50000000 -.00000300  00000-0  00000-0 0  9990",
    tle2: "2 51850   0.1000 265.0000 0001200 350.0000  10.0000  1.00270000000000",
    launch: "2022-03-01", country: "USA/NOAA", mass: "5,192 kg", purpose: "Geostationary Weather"
  },
  {
    name: "INTELSAT 901", norad: "26824", cat: "comms",
    icon: "📶",
    desc: "Intelsat 901 is a commercial communications satellite in geostationary orbit providing TV broadcasting and broadband services across Europe, Africa, the Americas, and the Middle East. It was serviced in orbit by Northrop Grumman's MEV-1 spacecraft.",
    tle1: "1 26824U 01024A   24001.50000000 -.00000300  00000-0  00000-0 0  9990",
    tle2: "2 26824   0.0100 358.0000 0002000 200.0000 160.0000  1.00270000000000",
    launch: "2001-06-09", country: "Luxembourg", mass: "4,724 kg", purpose: "Communications"
  },
  {
    name: "CARTOSAT-2F", norad: "43111", cat: "earth",
    icon: "🇮🇳",
    desc: "CARTOSAT-2F is an Indian Earth observation satellite built and operated by ISRO (Indian Space Research Organisation). Launched aboard PSLV-C40 in January 2018, it provides high-resolution panchromatic and multispectral imagery for cartography, urban planning, disaster management, and land-use mapping across India and the globe.",
    tle1: "1 43111U 18004B   24001.50000000  .00001200  00000-0  50000-4 0  9992",
    tle2: "2 43111  97.4700  30.0000 0001200  90.0000 270.0000 14.77000000000000",
    launch: "2018-01-12", country: "India (ISRO)", mass: "710 kg", purpose: "High-Resolution Earth Imaging"
  },
  {
    name: "IRNSS-1I (NavIC)", norad: "43286", cat: "nav",
    icon: "🧭",
    desc: "IRNSS-1I is part of India's own Navigation with Indian Constellation (NavIC) system, built and operated by ISRO. Launched by PSLV-C41 in April 2018 as a replacement satellite, it provides accurate Position, Navigation and Timing (PNT) services over India and a region extending up to 1,500 km around India. NavIC makes India one of only a handful of nations with its own independent navigation satellite system.",
    tle1: "1 43286U 18035A   24001.50000000 -.00000300  00000-0  00000-0 0  9991",
    tle2: "2 43286  28.1000  55.0000 0020000 270.0000  88.0000  1.00270000000000",
    launch: "2018-04-12", country: "India (ISRO)", mass: "1,425 kg", purpose: "Regional Navigation (NavIC)"
  },
];

const FEATURED_NAMES = ["ISS (ZARYA)", "STARLINK-1130", "HUBBLE SPACE TELESCOPE", "TIANGONG CSS", "CARTOSAT-2F", "IRNSS-1I (NavIC)"];

const BADGE_CLASSES = { station:"badge-station", comms:"badge-comms", earth:"badge-earth", obs:"badge-obs", nav:"badge-nav" };
const BADGE_LABELS = { station:"Space Station", comms:"Communications", earth:"Earth Science", obs:"Observatory", nav:"Navigation" };
const CAT_ICONS = { station:"🛸", comms:"📡", earth:"🌍", obs:"🔭", nav:"🧭" };

// Indian satellites — highlighted in UI
const INDIAN_NORADS = ["43111", "43286"];

// ── Satellite.js SGP4 wrapper ──────────────────────────────────────────────
function getSatPosition(sat, date) {
  try {
    if(typeof satellite === 'undefined') return mockPosition(sat, date);
    const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
    const posVel = satellite.propagate(satrec, date);
    if(!posVel || !posVel.position) return null;
    const gmst = satellite.gstime(date);
    const geo = satellite.eciToGeodetic(posVel.position, gmst);
    return {
      lat: satellite.degreesLat(geo.latitude),
      lng: satellite.degreesLong(geo.longitude),
      alt: geo.height,
      vel: Math.sqrt(posVel.velocity.x**2 + posVel.velocity.y**2 + posVel.velocity.z**2),
    };
  } catch(e) { return mockPosition(sat, date); }
}

function mockPosition(sat, date) {
  const t = date.getTime() / 1000;
  const seed = parseInt(sat.norad) || 1;
  return {
    lat: Math.sin(t * 0.0001 * seed % 6.28) * 51.6,
    lng: ((t * 0.04 * (seed % 5 + 1)) % 360) - 180,
    alt: 380 + Math.sin(t * 0.001) * 20 + seed % 100,
    vel: 7.66 + (seed % 10) * 0.01,
  };
}

function getOrbitalParams(sat) {
  try {
    if(typeof satellite === 'undefined') return null;
    const satrec = satellite.twoline2satrec(sat.tle1, sat.tle2);
    const period = (2 * Math.PI / satrec.no) * 60;
    return {
      inc: (satrec.inclo * 180/Math.PI).toFixed(2),
      ecc: satrec.ecco.toFixed(6),
      raan: (satrec.nodeo * 180/Math.PI).toFixed(2),
      period: (period / 60).toFixed(2),
      sma: (Math.cbrt(398600.4418 * (period/(2*Math.PI))**2) / 1000).toFixed(0),
    };
  } catch(e) { return null; }
}
