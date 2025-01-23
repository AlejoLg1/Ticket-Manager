"use client";

interface ResetButtonProps {
  onReset: () => void;
}

const ResetButton = ({ onReset }: ResetButtonProps) => {
  return (
    <div
      className="w-16 h-16 cursor-pointer rounded-full flex items-center justify-center bg-[#212E5F] hover:bg-[#7A8DBB]"
      onClick={onReset}
    >
      <img
        alt="reset icon"
        src="/images/reset.svg"
        width="32"
        height="32"
        decoding="async"
        style={{ color: 'transparent' }}
      />
    </div>
  );
};

export default ResetButton;
