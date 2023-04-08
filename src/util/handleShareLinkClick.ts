import { Dispatch, SetStateAction } from 'react';
import { MobxStore } from 'App';

const handleShareLinkClick = (
  current: HTMLInputElement | null,
  setLinkCopied?: Dispatch<SetStateAction<boolean>>
) => {
  if (!current) return;
  current.focus();
  current.select();
  navigator.clipboard.writeText(current.value.replace('map', 'review').replace('list', 'review'));
  const { UserNavigatorStore } = MobxStore;
  UserNavigatorStore.setShouldLinkPopupAppear(true);
  setTimeout(() => {
    UserNavigatorStore.setShouldLinkPopupAppear(false);
  }, 3000);
  if (setLinkCopied) {
    setLinkCopied(true);
    setTimeout(() => {
      setLinkCopied(false);
    }, 3000);
  }
};

export default handleShareLinkClick;
