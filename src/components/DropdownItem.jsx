function DropdownItem({ icon, text, danger }) {
  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer
        transition hover:bg-gray-100
        ${danger ? "text-red-500 hover:bg-red-50" : "text-orange-500"}
      `}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}
export default DropdownItem;