import { Dispatch, SetStateAction } from 'react';
import { MobxStore } from 'App';
import copy from 'copy-to-clipboard';

const handleShareLinkClick = async (
  current: HTMLInputElement | null,
  setLinkCopied?: Dispatch<SetStateAction<boolean>>
) => {
  if (!current) return;
  current.focus();
  current.select();
  current.setSelectionRange(0, 99999);
  const copyValue = current.value.replace('map', 'review').replace('list', 'review');
  try {
    await navigator.clipboard.writeText(copyValue);
  } catch {
    copy(copyValue);
  } finally {
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
  }
};

export default handleShareLinkClick;
