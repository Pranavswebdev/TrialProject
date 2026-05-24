import { useRef, useEffect } from 'react';

export default function CategoryTabs({ categories, activeCategory, onCategorySelect }) {
  const scrollContainerRef = useRef(null);
  const activeTabRef = useRef(null);

  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeTab = activeTabRef.current;

      const containerRect = container.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      const scrollLeft =
        activeTab.offsetLeft -
        containerRect.width / 2 +
        tabRect.width / 2;

      container.scrollLeft = scrollLeft;
    }
  }, [activeCategory]);

  return (
    <div
      ref={scrollContainerRef}
      className="sticky top-0 z-20 overflow-x-auto bg-white border-b border-gray-200 flex gap-4 px-4 py-3"
      style={{ scrollBehavior: 'smooth' }}
    >
      {categories.map((category) => (
        <button
          ref={activeCategory === category.id ? activeTabRef : null}
          key={category.id}
          onClick={() => onCategorySelect(category.id)}
          className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
            activeCategory === category.id
              ? 'bg-indigo-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
