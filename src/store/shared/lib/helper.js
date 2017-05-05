export const getParentIds = (categories, categoryId) => {
  let parentIds = [];
  let parentExists = false;

  do {
    const category = categories.find(item => item.id === categoryId);
    parentExists = category && category.parent_id;
    if(parentExists){
      parentIds.push(category.parent_id)
      categoryId = category.parent_id;
    }
  } while(parentExists)

  return parentIds;
}
