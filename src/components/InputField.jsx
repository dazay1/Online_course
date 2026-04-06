// components/InputField.js
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputField = ({
  label,
  type = "text",
  name,
  register,
  defaultValue,
  error,
  inputProps,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  // Determine the input type based on showPassword state for password fields
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4 relative">
      <label className="text-xs text-gray-500">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          {...register(name)}
          className="ring-[1.5px] ring-gray-300 p-2 pr-10 rounded-md text-sm w-full"
          {...inputProps}
          defaultValue={defaultValue}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-lamaSky focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
          </button>
        )}
      </div>
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;