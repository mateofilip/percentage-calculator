import React, { useEffect, useRef, useState } from "react";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AnswerDisplay } from "./AnswerDisplay";

const copyTextToClipboard = async (text) => {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return Boolean(ok);
  } catch {
    return false;
  }
};

const TrashIcon = ({ className }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);

const CopyIcon = ({ className }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M5 1.5C5 1.22386 5.22386 1 5.5 1H11.5C11.7761 1 12 1.22386 12 1.5V9.5C12 9.77614 11.7761 10 11.5 10H5.5C5.22386 10 5 9.77614 5 9.5V1.5ZM6 2V9H11V2H6Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
    <path
      d="M3 5.5C3 5.22386 3.22386 5 3.5 5H4V6H4V11H9V11.5C9 11.7761 8.77614 12 8.5 12H3.5C3.22386 12 3 11.7761 3 11.5V5.5Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
    />
  </svg>
);

const IconSwapButton = ({
  disabled,
  ariaLabel,
  title,
  titleDisabled,
  onAction,
  DefaultIcon,
}) => {
  const tooltipText = disabled ? titleDisabled : title;
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [nonce, setNonce] = useState(0);
  const animTimeoutRef = useRef(null);
  const doneTimeoutRef = useRef(null);

  const handleClick = async () => {
    if (disabled) return;

    const ok = await onAction();
    if (!ok) return;

    setNonce((current) => current + 1);
    setIsAnimating(true);
    setIsDone(true);

    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    animTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 220);

    if (doneTimeoutRef.current) clearTimeout(doneTimeoutRef.current);
    doneTimeoutRef.current = setTimeout(() => {
      setIsDone(false);
    }, 900);
  };

  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      if (doneTimeoutRef.current) clearTimeout(doneTimeoutRef.current);
    };
  }, []);

  return (
    <span
      className={`relative inline-flex group/tooltip ${
        disabled ? "cursor-not-allowed" : ""
      }`}
    >
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled}
        aria-label={ariaLabel}
        className={`rounded-full py-5 text-white/80 bg-orange-800/20 transition-all hover:bg-orange-800/30 duration-200 ease-out disabled:opacity-50 ${
          isAnimating ? "scale-105" : "scale-100"
        }`}
        onClick={handleClick}
      >
        <span className="relative h-4 w-4">
          <DefaultIcon
            className={`absolute inset-0 h-4 w-4 transition-all duration-150 ${
              isDone ? "scale-75 opacity-0" : "scale-100 opacity-100"
            }`}
          />
          <CheckIcon
            key={nonce}
            className={`absolute inset-0 h-4 w-4 text-white transition-all duration-150 ${
              isDone ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          />
        </span>
      </Button>
      <span className="pointer-events-none absolute right-0 bottom-full z-50 mb-2 w-max max-w-56 whitespace-nowrap opacity-0 transition-all duration-200 translate-y-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0">
        <span className="relative block rounded-xl  bg-slate-900 border border-gray-900 p-2 text-xs font-medium text-white shadow-lg">
          {tooltipText}
          <span className="absolute -bottom-1 right-3 h-2 w-2 rotate-45 border-b border-r border-black bg-gray-900" />
        </span>
      </span>
    </span>
  );
};

const CalculatorFrame = ({
  title,
  description,
  children,
  result,
  onClear,
  answerPlaceholder,
}) => {
  const canCopy =
    Boolean(result) &&
    !Boolean(result?.placeholder) &&
    !Boolean(result?.error) &&
    typeof result?.value === "string";

  return (
    <Card className="flex h-full flex-col rounded-xl group hover:rounded-3xl border border-white/40 bg-black/15 shadow-lg shadow-black/10 backdrop-blur-xl hover:shadow-xl transition-all duration-200 ease-out">
      <CardHeader className="flex flex-row justify-between items-center border-b border-white/20 bg-orange-400/90 backdrop-blur-xl rounded-t-xl group-hover:rounded-t-3xl transition-all duration-200 ease-out">
        <div>
          <CardTitle className=" text-lg text-white">{title}</CardTitle>
          <CardDescription className="text-xs text-white/65">
            {description}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <IconSwapButton
            disabled={!canCopy}
            ariaLabel="Copy result"
            title="Copy result"
            titleDisabled="Nothing to copy yet"
            DefaultIcon={CopyIcon}
            onAction={async () => {
              if (!canCopy) return false;
              return copyTextToClipboard(result.value);
            }}
          />
          <IconSwapButton
            disabled={false}
            ariaLabel="Clear inputs"
            title="Clear"
            titleDisabled="Clear"
            DefaultIcon={TrashIcon}
            onAction={async () => {
              onClear();
              return true;
            }}
          />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-1">
        <div className="h-full items-center justify-center grid gap-5 py-6">
          {children}
        </div>
        <AnswerDisplay result={result} placeholderValue={answerPlaceholder} />
      </CardContent>
    </Card>
  );
};

export { CalculatorFrame };
