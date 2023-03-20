import { Dispatch, SetStateAction } from 'react';

const handleShareLinkClick = (
  current: HTMLInputElement | null,
  setLinkCopied: Dispatch<SetStateAction<boolean>>
) => {
  if (!current) return;
  current.focus();
  current.select();
  navigator.clipboard.writeText(current.value);
  setLinkCopied(true);
  setTimeout(() => {
    setLinkCopied(false);
  }, 3000);
};

export default handleShareLinkClick;
