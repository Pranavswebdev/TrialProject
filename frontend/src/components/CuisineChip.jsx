export default function CuisineChip({ label, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
        isSelected
          ? 'bg-indigo-500 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );
}
