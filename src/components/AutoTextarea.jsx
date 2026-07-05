import React, { useRef, useEffect } from "react";

const AutoTextarea = ({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
}) => {
  const textareaRef = useRef(null);
  // 매 렌더마다 재계산 — 내용이 없으면 작게(1줄), 내용이 늘면 확장.
  // 레벨 전환·카드 펼침 직후에도 이전 높이가 남지 않도록 deps 없이 실행
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  });
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
