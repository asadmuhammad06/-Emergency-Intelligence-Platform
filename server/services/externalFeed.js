const NEWS_RSS_URL = 'https://news.google.com/rss/search';

const categoryFor = text => {
  const value = text.toLowerCase();
  if (/flood|water|rain|storm/.test(value)) return 'WATER_SHORTAGE';
  if (/road|bridge|traffic|landslide/.test(value)) return 'ROAD_BLOCKED';
  if (/hospital|health|injur|medical/.test(value)) return 'HOSPITAL_CAPACITY';
  if (/power|electric|blackout|grid/.test(value)) return 'POWER_OUTAGE';
  return 'GENERAL_ALERT';
};

const severityFor = text => {
  const value = text.toLowerCase();
  if (/death|fatal|evacuat|emergency|critical/.test(value)) return 9;
  if (/flood|storm|displaced|damage/.test(value)) return 7;
  return 5;
};

const coordinatesFor = (item, regions) => {
  const location = item.fields?.primaryCountry?.location;
  if (Array.isArray(location) && location.length === 2) return location;
  const match = regions.find(region => {
    const name = region.name.toLowerCase().split('/')[0].trim();
    return item.fields?.title?.toLowerCase().includes(name);
  });
  return match?.center || regions[0].center;
};

export const fetchExternalDistress = async (regions, region) => {
  const regionQuery = region ? `${region.name.split('/')[0]} Pakistan` : 'Pakistan';
  const query = encodeURIComponent(`${regionQuery} flood OR earthquake OR emergency OR rescue`);
  const response = await fetch(`${NEWS_RSS_URL}?q=${query}&hl=en-PK&gl=PK&ceid=PK:en`, {
    headers: { Accept: 'application/rss+xml' }
  });
  if (!response.ok) throw new Error(`External news feed error: ${response.status}`);
  const xml = await response.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

  return items.slice(0, 30).map(([, rawItem], index) => {
    const read = tag => rawItem.match(new RegExp(`<${tag}><!\\[CDATA\\[(.*?)\\]\\]><\\/${tag}>|<${tag}>(.*?)<\\/${tag}>`))?.[1] ||
      rawItem.match(new RegExp(`<${tag}><!\\[CDATA\\[(.*?)\\]\\]><\\/${tag}>|<${tag}>(.*?)<\\/${tag}>`))?.[2] || '';
    const title = read('title') || 'Pakistan emergency update';
    const body = read('description') || title;
    const text = `${title} ${body}`;
    const coords = region?.center || coordinatesFor({ fields: { title } }, regions);
    return {
      id: `news_${Buffer.from(title).toString('base64url').slice(0, 30)}_${index}`,
      rawText: title,
      category: categoryFor(text),
      severity: severityFor(text),
      headcount: 0,
      locationName: region?.name || regions.find(region => region.name.toLowerCase().split('/')[0].trim() &&
        title.toLowerCase().includes(region.name.toLowerCase().split('/')[0].trim()))?.name || 'Pakistan',
      coords,
      timestamp: read('pubDate') || new Date().toISOString(),
      status: 'VERIFIED',
      needs: ['Monitor official response updates'],
      languageDetected: 'English',
      confidence: 0.8,
      sourceUrl: read('link'),
      source: read('source') || 'Google News'
    };
  });
};
