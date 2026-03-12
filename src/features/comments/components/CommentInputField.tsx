import type { ReactNode } from "react";
import IconSend from "@/assets/base/icon-Send.svg?react";

interface CommentInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  prefix?: ReactNode;
}

const CommentInputField = ({
  value,
  onChange,
  onSubmit,
  placeholder,
  disabled,
  autoFocus = true,
  className = "",
  prefix,
}: CommentInputFieldProps) => (
  <div className={`h-[50px] rounded-[8px] border border-gray-300 flex items-center overflow-hidden ${className}`}>
    <div className="flex-1 flex items-center px-4 h-full min-w-0 gap-1">
      {prefix}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        placeholder={placeholder}
        className="w-full text-base text-gray-500 focus:outline-none bg-transparent"
        autoFocus={autoFocus}
      />
    </div>
    <button
      onClick={onSubmit}
      disabled={disabled ?? !value.trim()}
      className="flex-shrink-0 flex items-center justify-center w-[50px] h-[50px] bg-gray-300"
    >
      <IconSend className="w-[26px] h-[26px] text-background" />
    </button>
  </div>
);

export default CommentInputField;
