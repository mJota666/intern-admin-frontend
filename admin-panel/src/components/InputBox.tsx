import { InputBoxProps } from "../interfaces/InputBoxProps";

export default function InputBox({
  id,
  type,
  value,
  onChange,
  label,
}: InputBoxProps) {
  const isActive = value.length > 0;
  console.log(isActive);
  return (
    <div className="group relative  w-full h-full cursor-pointer">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="rounded-3xl absolute bottom-0 block w-full h-[90%]  border  pl-4 text-sm focus:outline-[#C86C24] cursor-pointer"
        required
      />
      <label
        htmlFor={id}
        style={{ top: isActive ? "10%" : "" }}
        className="group-focus-within:top-[10%] group-focus-within:text-[#C86C24]    text-md absolute top-[55%] -translate-y-1/2 left-0 transition-all duration-200 ml-4 p-2 bg-white cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
}
