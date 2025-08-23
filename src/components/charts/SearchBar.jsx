import { RxAvatar } from "react-icons/rx";
import { useSelector } from "react-redux";
import FormModal from "../forms/FormModal";

const SearchBar = ({ hidden }) => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const user = userInfo || "";
  return (
    <div
      style={{ display: hidden ? "none" : "flex" }}
      className="justify-end items-end w-full p-4 mt-10"
    >
      <div className="flex items-center gap-6 justify-end w-full">
        <div className="flex flex-col">
          <span className="text-lg leading-3 font-medium text-[#ae00ff]">
            {user.firstName} {user.lastName}
          </span>
          <span className="text-[10px] text-gray-500 text-right">
            {user.role}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {user.img ? (
            <img
              src={user.img}
              alt=""
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <RxAvatar fontSize={45} color="black" />
          )}
          <FormModal table="profile" type="deleteAdmin" id={user.id} />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
