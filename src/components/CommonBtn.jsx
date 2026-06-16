import React from "react";

const CommonButton = ({
    title,
    width = "w-[200px]",
    onClick,
    type = "button",
    className = "",
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`
        ${width}
        h-[46px]
        rounded-[14px]
        px-[36px]
        py-[14px]
        inline-flex
        items-center
        justify-center
        gap-[9px]
        bg-gradient-to-r
        from-[#00ADEE]
        to-[#0079CE]
        text-white
        font-semibold
        text-[14px]
        leading-none
        transition-all
        duration-300
        hover:opacity-90
        ${className}
      `}
        >
            <span>{title}</span>
            <span>→</span>
        </button>
    );
};

export default CommonButton;