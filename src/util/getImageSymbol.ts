const getImageSymbol = (categoryList: string[]) => {
  const primaryCategories = ['강변', '공원', '궁궐'];
  const addedSymbol: string[] = [];
  primaryCategories.forEach((category: string) => {
    if (categoryList.includes(category)) {
      addedSymbol.push(category);
    }
  });
  categoryList.forEach((category: string) => {
    addedSymbol.push(category);
  });
  return addedSymbol[0] ?? '';
};

export default getImageSymbol;
