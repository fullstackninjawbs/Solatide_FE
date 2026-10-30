import React from "react";
import { Link } from "react-router-dom";

/**
 * Gradient call-to-action. Pass `to` to render a real link (<a>) styled as a button —
 * never wrap this component in a <Link>, which would nest <button> inside <a> (invalid HTML).
 */
const CommonButton = ({
    title,
    width = "w-[200px]",
    onClick,
    type = "button",
    className = "",
    to,
}) => {
    const classes = `
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
      `;
    const content = (
        <>
            <span>{title}</span>
            <span>→</span>
        </>
    );

    if (to) {
        return (
            <Link to={to} onClick={onClick} className={classes}>
                {content}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} className={classes}>
            {content}
        </button>
    );
};

export default CommonButton;
