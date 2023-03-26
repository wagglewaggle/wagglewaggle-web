import { StatusType } from "types/typeBundle";

const getMapSelectedSymbol = (symbol: string, status?: StatusType) => {
  const symbolObj: {[key: string]: string} = {
    궁궐: 'palace',
    공원: 'park',
    쇼핑몰: 'shopping',
    '골목 및 거리': 'street',
    지하철: 'subway',
    테마파크: 'theme-park',
    마을: 'village',
    한강: 'han-river',
  };

  if (!status || !symbolObj[symbol]) return require(`assets/symbols/mapSelectedSymbols/VERY_RELAXATION/palace.svg`);
  return require(`assets/symbols/mapSelectedSymbols/${status}/${symbolObj[symbol]}.svg`)
}

export default getMapSelectedSymbol;