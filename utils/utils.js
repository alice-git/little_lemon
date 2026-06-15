import { useRef, useEffect } from 'react';

export function getSectionListData(data) {
  const groupedItems = data.reduce((acc, item) => {
    const category = item.category;

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push({
      id: item.id,
      title: item.title,
      price: item.price,
    });

    return acc;
  }, {});

  return Object.keys(groupedItems).map((category) => ({
    title: category,
    data: groupedItems[category],
  }));
}

export function useUpdateEffect(effect, dependencies = []) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
