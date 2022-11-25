import { pageType } from 'types/typeBundle';

interface propsType {
  handleCurrentPageChange: (newPage: pageType) => void;
}

const SearchData = (props: propsType) => {
  const { handleCurrentPageChange } = props;

  return (
    <div>
      <div>Search Data</div>
    </div>
  );
};

export default SearchData;
