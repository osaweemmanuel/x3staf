import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "header" | "danger" | "transparent"; // Define different button variants
  customClassName?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  customClassName,
  onClick,
  disabled,
  ...props
}) => {
  let buttonClasses =
    "font-Raleway font-medium h-max text-sm tracking-widest text-center rounded-[4px] focus:outline-none";

  switch (variant) {
    case "primary":
      buttonClasses += " bg-[#048372] px-6 py-6 text-white";
      break;
    case "secondary":
      buttonClasses += " text-[#048372] px-6 py-6 border border-[#73777F]";
      break;
    case "header":
      buttonClasses += " text-[#F1F1F1] px-6 py-6 border border-[#F1F1F1]";
      break;
    case "danger":
      buttonClasses += " bg-[#000000] px-6 py-6 text-white";
      break;
    case "transparent":
      buttonClasses += " border-black border text-primary px-6 py-3";
      break;
    default:
      buttonClasses += " text-[#048372] px-6 py-6 border border-[#73777F]";
  }

  if (customClassName) {
    buttonClasses += " " + customClassName; // Concatenate custom class names
  }

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    />
  );
};

export default Button;
