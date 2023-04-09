import { ReactComponent as Palace } from 'assets/symbols/palace.svg';
import { ReactComponent as Park } from 'assets/symbols/park.svg';
import { ReactComponent as Shopping } from 'assets/symbols/shopping.svg';
import { ReactComponent as Street } from 'assets/symbols/street.svg';
import { ReactComponent as Subway } from 'assets/symbols/subway.svg';
import { ReactComponent as ThemePark } from 'assets/symbols/theme-park.svg';
import { ReactComponent as Village } from 'assets/symbols/village.svg';
import { ReactComponent as HanRiver } from 'assets/symbols/han-river.svg';
import { ReactComponent as Beach } from 'assets/symbols/beach.svg';

export const symbolsComponents: { [key: string]: React.ReactNode } = {
  궁궐: <Palace />,
  공원: <Park />,
  쇼핑몰: <Shopping />,
  '골목 및 거리': <Street />,
  지하철: <Subway />,
  테마파크: <ThemePark />,
  마을: <Village />,
  강변: <HanRiver />,
  해변: <Beach />,
};
