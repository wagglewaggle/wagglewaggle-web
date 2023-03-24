import { MouseEvent } from 'react';
import { Menu, MenuItem, styled } from '@mui/material';
import { palette } from 'constants/';

type PropsType = {
  anchorEl: null | HTMLElement;
  isMyReview: boolean;
  handleMenuClose: (e: MouseEvent) => void;
};

const HeaderSelectMenu = (props: PropsType) => {
  const { anchorEl, isMyReview, handleMenuClose } = props;
  const open = Boolean(anchorEl);
  const selectItems = isMyReview ? ['수정하기', '삭제하기', '신고하기'] : ['신고하기'];

  const reportReview = () => {
    console.log('report');
  };

  const editReview = () => {
    console.log('edit');
  };

  const deleteReview = () => {
    console.log('delete');
  };

  const handleMenuItemClick = (e: MouseEvent<HTMLLIElement>) => {
    e.stopPropagation();
    const { textContent } = e.target as HTMLInputElement;
    if (textContent === '수정하기') {
      editReview();
    } else if (textContent === '삭제하기') {
      deleteReview();
    } else if (textContent === '신고하기') {
      reportReview();
    }
    handleMenuClose(e);
  };

  return (
    <CustomMenu
      open={open}
      onClose={handleMenuClose}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: -5, horizontal: 65 }}
    >
      {selectItems.map((item: string) => (
        <CustomMenuItem key={`menu-item-${item}`} value={item} onClick={handleMenuItemClick} dense>
          {item}
        </CustomMenuItem>
      ))}
    </CustomMenu>
  );
};

export default HeaderSelectMenu;

const CustomMenu = styled(Menu)({
  '& li': {
    borderBottom: `1px solid ${palette.grey[300]}`,
    height: 36,
  },
  '& li:last-of-type': {
    border: 'none',
  },
});

const CustomMenuItem = styled(MenuItem)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '8px 24px',
  width: 97,
  height: 20,
  color: palette.grey[600],
  fontSize: 14,
  fontWeight: 600,
  lineHeight: '20px',
});
