import { ChipType } from 'types/typeBundle';

const iconNames = {
  전체: 'all',
  강변: 'han-river',
  '봄 나들이': 'spring',
  '골목 및 거리': 'street',
  공원: 'park',
  궁궐: 'palace',
  마을: 'village',
  쇼핑몰: 'shopping',
  지하철: 'subway',
  테마파크: 'theme-park',
  해변: 'beach',
  '기타 지역': 'etc',
};

const getChipImage = (chip: ChipType) => {
  return require(`assets/icons/chips/${iconNames[chip]}.svg`);
};

export default getChipImage;
