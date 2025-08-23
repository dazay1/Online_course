const UserCard = ({ type }) => {
  return (
    <div className="rounded-2xl odd:bg-[#9f52df] even:bg-lamaYellow p-4 flex-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">2024/25</span>
      </div>
      <h4 className="text-2xl font-semibold my-4 text-white">1,234</h4>
      <h5 className="capitalize text-sm font-semibold text-black">{type}</h5>
    </div>
  )
}
export default UserCard