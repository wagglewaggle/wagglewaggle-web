import { StatusType } from 'types/typeBundle';

const getMapSelectedSymbol = (symbol: string, status?: StatusType) => {
  const symbolObj: { [key: string]: string } = {
    궁궐: 'palace',
    공원: 'park',
    쇼핑몰: 'shopping',
    '골목 및 거리': 'street',
    지하철: 'subway',
    테마파크: 'theme-park',
    마을: 'village',
    강변: 'han-river',
    해변: 'beach',
  };

  if (!status || !symbolObj[symbol]) {
    return require(`assets/symbols/mapSelectedSymbols/NO_STATUS/palace.png`);
  }
  return require(`assets/symbols/mapSelectedSymbols/${status ?? 'NO_STATUS'}/${
    symbolObj[symbol]
  }.png`);
};

export default getMapSelectedSymbol;
