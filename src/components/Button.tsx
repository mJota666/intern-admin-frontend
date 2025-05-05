export default function Button({ content }: { content: string }) {
  return (
    <button
      type="submit"
      className="w-full font-bold text-lg rounded-3xl p-3 bg-[#C86C24] text-white hover:bg-[#652702] transition-all duration-300 cursor-pointer"
    >
      {content}
    </button>
  );
}
