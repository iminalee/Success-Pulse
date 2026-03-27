import React, { useRef, useEffect } from "react";

const AutoTextarea = ({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
}) => {
  const textareaRef = useRef(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);
  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`${className} overflow-hidden resize-none transition-[height] duration-200 font-sans`}
      rows={1}
    />
  );
};

export default AutoTextarea;
