import React, { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formatNumber = (value) => {
  if (!Number.isFinite(value)) return String(value);
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
};

const createEmptyResult = () => ({ placeholder: true });

const AnswerDisplay = ({ result, placeholderValue = "0" }) => {
  const output = result ?? createEmptyResult();

  const isPlaceholder = Boolean(output.placeholder);
  const hasError = Boolean(output.error);
  const value =
    !isPlaceholder && !hasError && typeof output.value === "string"
      ? output.value
      : placeholderValue;

  const digitCount = String(value).replace(/[^0-9]/g, "").length;
  const valueSizeClass =
    digitCount > 18
      ? "text-2xl"
      : digitCount > 13
      ? "text-3xl"
      : digitCount > 9
      ? "text-4xl"
      : "text-5xl";

  const [isBumping, setIsBumping] = useState(false);
  const previousValueRef = useRef(value);
  const bumpTimeoutRef = useRef(null);

  useEffect(() => {
    if (isPlaceholder || hasError) {
      previousValueRef.current = value;
      return undefined;
    }

    if (previousValueRef.current !== value) {
      setIsBumping(true);
      if (bumpTimeoutRef.current) clearTimeout(bumpTimeoutRef.current);
      bumpTimeoutRef.current = setTimeout(() => {
        setIsBumping(false);
      }, 180);
    }

    previousValueRef.current = value;

    return () => {
      if (bumpTimeoutRef.current) clearTimeout(bumpTimeoutRef.current);
    };
  }, [value, isPlaceholder, hasError]);

  return (
    <div className="h-fit border-t border-gray-200 pt-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
        Answer
      </p>
      <p
        className={
          isPlaceholder || hasError
            ? `mt-2 w-full select-none whitespace-nowrap overflow-hidden text-clip font-semibold tabular-nums leading-none tracking-tight text-orange-400/40 transition-transform duration-200 ease-out ${valueSizeClass}`
            : `mt-2 w-full whitespace-nowrap overflow-hidden text-clip font-semibold tabular-nums leading-none tracking-tight text-orange-400 transition-transform duration-200 ease-out ${valueSizeClass} ${
                isBumping ? "scale-105" : "scale-100"
              }`
        }
      >
        {value}
      </p>
      {hasError ? (
        <p className="mt-2 text-sm font-medium text-red-600">{output.error}</p>
      ) : null}
    </div>
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

  const [isClearAnimating, setIsClearAnimating] = useState(false);
  const [isClearDone, setIsClearDone] = useState(false);
  const [clearNonce, setClearNonce] = useState(0);
  const clearTimeoutRef = useRef(null);
  const clearDoneTimeoutRef = useRef(null);

  const [isCopyAnimating, setIsCopyAnimating] = useState(false);
  const [isCopyDone, setIsCopyDone] = useState(false);
  const [copyNonce, setCopyNonce] = useState(0);
  const copyTimeoutRef = useRef(null);
  const copyDoneTimeoutRef = useRef(null);

  const handleClear = () => {
    setClearNonce((current) => current + 1);
    setIsClearAnimating(true);
    setIsClearDone(true);
    if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
    clearTimeoutRef.current = setTimeout(() => {
      setIsClearAnimating(false);
    }, 220);
    if (clearDoneTimeoutRef.current) clearTimeout(clearDoneTimeoutRef.current);
    clearDoneTimeoutRef.current = setTimeout(() => {
      setIsClearDone(false);
    }, 900);
    onClear();
  };

  const handleCopy = async () => {
    if (!canCopy) return;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(result.value);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = result.value;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        textarea.style.top = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopyNonce((current) => current + 1);
      setIsCopyAnimating(true);
      setIsCopyDone(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => {
        setIsCopyAnimating(false);
      }, 220);
      if (copyDoneTimeoutRef.current) clearTimeout(copyDoneTimeoutRef.current);
      copyDoneTimeoutRef.current = setTimeout(() => {
        setIsCopyDone(false);
      }, 900);
    } catch {
      setIsCopyAnimating(false);
      setIsCopyDone(false);
    }
  };

  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
      if (clearDoneTimeoutRef.current)
        clearTimeout(clearDoneTimeoutRef.current);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      if (copyDoneTimeoutRef.current) clearTimeout(copyDoneTimeoutRef.current);
    };
  }, []);

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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!canCopy}
            aria-label="Copy result"
            title={canCopy ? "Copy result" : "Nothing to copy yet"}
            className={`rounded-full py-5 text-white/80 bg-orange-800/20 transition-all hover:bg-orange-800/30 duration-200 ease-out disabled:opacity-50 ${
              canCopy ? "cursor-pointer" : " cursor-not-allowed"
            } ${isCopyAnimating ? "scale-105" : "scale-100"} `}
            onClick={handleCopy}
          >
            <span className="relative h-4 w-4">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`absolute inset-0 h-4 w-4 transition-all duration-150 ${
                  isCopyDone ? "scale-75 opacity-0" : "scale-100 opacity-100"
                } ${
                  isCopyAnimating ? "animate-[spin_0.35s_ease-in-out_1]" : ""
                }`}
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
              <svg
                key={copyNonce}
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`absolute inset-0 h-4 w-4 text-white transition-all duration-150 ${
                  isCopyDone ? "scale-100 opacity-100" : "scale-75 opacity-0"
                }`}
                aria-hidden="true"
              >
                <path
                  d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Clear inputs"
            title="Clear"
            className={`rounded-full py-5 text-white/80 bg-orange-800/20 transition-all hover:bg-orange-800/30 duration-200 ease-out ${
              isClearAnimating ? "scale-105" : "scale-100"
            }`}
            onClick={handleClear}
          >
            <span className="relative h-4 w-4">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`absolute inset-0 h-4 w-4 transition-all duration-150 ${
                  isClearDone ? "scale-75 opacity-0" : "scale-100 opacity-100"
                }`}
                aria-hidden="true"
              >
                <path
                  d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                key={clearNonce}
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`absolute inset-0 h-4 w-4 text-white transition-all duration-150 ${
                  isClearDone ? "scale-100 opacity-100" : "scale-75 opacity-0"
                }`}
                aria-hidden="true"
              >
                <path
                  d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </Button>
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

const PercentOfCard = () => {
  const [percent, setPercent] = useState("");
  const [base, setBase] = useState("");
  const [result, setResult] = useState(createEmptyResult);

  const calculate = () => {
    if (percent.trim() === "" || base.trim() === "") {
      setResult(createEmptyResult());
      return;
    }

    const p = parseFloat(percent);
    const b = parseFloat(base);
    if (!Number.isFinite(p) || !Number.isFinite(b)) {
      setResult({ error: "Please enter valid numbers" });
      return;
    }

    const value = (p / 100) * b;
    const formatted = formatNumber(value);
    setResult({
      value: formatted,
      explanation: `${p}% of ${b} is ${formatted}`,
    });
  };

  const clear = () => {
    setPercent("");
    setBase("");
    setResult(createEmptyResult());
  };

  useEffect(() => {
    calculate();
  }, [percent, base]);

  return (
    <CalculatorFrame
      title="Percentage of..."
      description="What is X% of Y?"
      result={result}
      onClear={clear}
      answerPlaceholder="0"
    >
      <div className="flex w-full flex-wrap items-center justify-start gap-2">
        <span className="text-white/80">What is</span>
        <Input
          inputMode="decimal"
          type="number"
          step="any"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          className="w-20 text-center text-lg"
          placeholder="0"
        />
        <span className="text-white/80">% of</span>
        <Input
          inputMode="decimal"
          type="number"
          step="any"
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className="w-20 text-center text-lg"
          placeholder="0"
        />
        <span className="text-white/80">?</span>
      </div>
    </CalculatorFrame>
  );
};

const WhatPercentCard = () => {
  const [part, setPart] = useState("");
  const [whole, setWhole] = useState("");
  const [result, setResult] = useState(createEmptyResult);

  const calculate = () => {
    if (part.trim() === "" || whole.trim() === "") {
      setResult(createEmptyResult());
      return;
    }

    const p = parseFloat(part);
    const w = parseFloat(whole);
    if (!Number.isFinite(p) || !Number.isFinite(w)) {
      setResult({ error: "Please enter valid numbers" });
      return;
    }
    if (w === 0) {
      setResult({ error: "Cannot divide by zero" });
      return;
    }

    const percent = (p / w) * 100;
    const formatted = `${percent.toFixed(2)}%`;
    setResult({
      value: formatted,
      explanation: `${p} is ${formatted} of ${w}`,
    });
  };

  const clear = () => {
    setPart("");
    setWhole("");
    setResult(createEmptyResult());
  };

  useEffect(() => {
    calculate();
  }, [part, whole]);

  return (
    <CalculatorFrame
      title="What Percentage?"
      description="X is what % of Y?"
      result={result}
      onClear={clear}
      answerPlaceholder="0%"
    >
      <div className="flex w-full flex-wrap items-center justify-start gap-2">
        <Input
          inputMode="decimal"
          type="number"
          step="any"
          value={part}
          onChange={(e) => setPart(e.target.value)}
          className="w-20 text-center text-lg"
          placeholder="0"
        />
        <span className="text-white/80">is what % of</span>
        <Input
          inputMode="decimal"
          type="number"
          step="any"
          value={whole}
          onChange={(e) => setWhole(e.target.value)}
          className="w-20 text-center text-lg"
          placeholder="0"
        />
        <span className="text-white/80">?</span>
      </div>
    </CalculatorFrame>
  );
};

const PercentageChangeCard = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState(createEmptyResult);

  const calculate = () => {
    if (from.trim() === "" || to.trim() === "") {
      setResult(createEmptyResult());
      return;
    }

    const a = parseFloat(from);
    const b = parseFloat(to);
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      setResult({ error: "Please enter valid numbers" });
      return;
    }
    if (a === 0) {
      setResult({ error: "Initial value cannot be zero" });
      return;
    }

    const pct = ((b - a) / a) * 100;
    const direction = pct > 0 ? "increase" : "decrease";
    const formatted = `${Math.abs(pct).toFixed(2)}%`;
    setResult({
      value: formatted,
      explanation: `${formatted} ${direction} from ${a} to ${b}`,
    });
  };

  const clear = () => {
    setFrom("");
    setTo("");
    setResult(createEmptyResult());
  };

  useEffect(() => {
    calculate();
  }, [from, to]);

  return (
    <CalculatorFrame
      title="Percentage Change"
      description="Percentage increase/decrease from X to Y"
      result={result}
      onClear={clear}
      answerPlaceholder="0%"
    >
      <div className="flex w-full max-w-sm flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="w-14 text-sm text-white/80">From... </span>
          <Input
            inputMode="decimal"
            type="number"
            step="any"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="text-center text-lg"
            placeholder="Start"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-14 text-sm text-white/80 text-right">to... </span>
          <Input
            inputMode="decimal"
            type="number"
            step="any"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="text-center text-lg"
            placeholder="End"
          />
        </div>
      </div>
    </CalculatorFrame>
  );
};

const FindTotalCard = () => {
  const [value, setValue] = useState("");
  const [percent, setPercent] = useState("");
  const [result, setResult] = useState(createEmptyResult);

  const calculate = () => {
    if (value.trim() === "" || percent.trim() === "") {
      setResult(createEmptyResult());
      return;
    }

    const v = parseFloat(value);
    const p = parseFloat(percent);
    if (!Number.isFinite(v) || !Number.isFinite(p)) {
      setResult({ error: "Please enter valid numbers" });
      return;
    }
    if (p === 0) {
      setResult({ error: "Percentage cannot be zero" });
      return;
    }

    const total = v / (p / 100);
    const formatted = formatNumber(total);
    setResult({
      value: formatted,
      explanation: `${v} is ${p}% of ${formatted}`,
    });
  };

  const clear = () => {
    setValue("");
    setPercent("");
    setResult(createEmptyResult());
  };

  useEffect(() => {
    calculate();
  }, [value, percent]);

  return (
    <CalculatorFrame
      title="Find Total of..."
      description="X is Y% of what?"
      result={result}
      onClear={clear}
      answerPlaceholder="0"
    >
      <div className="flex w-full flex-wrap items-center justify-start gap-2">
        <Input
          inputMode="decimal"
          type="number"
          step="any"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-20 text-center text-lg"
          placeholder="0"
        />
        <span className="text-white/80">is</span>
        <Input
          inputMode="decimal"
          type="number"
          step="any"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          className="w-20 text-center text-lg"
          placeholder="0"
        />
        <span className="text-white">% of what?</span>
      </div>
    </CalculatorFrame>
  );
};

const PercentageDifferenceCard = () => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState(createEmptyResult);

  const calculate = () => {
    if (a.trim() === "" || b.trim() === "") {
      setResult(createEmptyResult());
      return;
    }

    const v1 = parseFloat(a);
    const v2 = parseFloat(b);
    if (!Number.isFinite(v1) || !Number.isFinite(v2)) {
      setResult({ error: "Please enter valid numbers" });
      return;
    }
    if (v1 === 0 && v2 === 0) {
      setResult({ error: "Both values cannot be zero" });
      return;
    }

    const base = Math.min(Math.abs(v1), Math.abs(v2));
    if (base === 0) {
      setResult({
        value: "∞%",
        explanation: `Difference between ${v1} and ${v2} relative to the smaller value is infinite`,
      });
      return;
    }

    const diff = (Math.abs(v1 - v2) / base) * 100;
    const formatted = `${diff.toFixed(2)}%`;
    setResult({
      value: formatted,
      explanation: `Difference between ${v1} and ${v2} relative to the smaller value is ${formatted}`,
    });
  };

  const clear = () => {
    setA("");
    setB("");
    setResult(createEmptyResult());
  };

  useEffect(() => {
    calculate();
  }, [a, b]);

  return (
    <CalculatorFrame
      title="Percentage Difference"
      description="Difference between A and B"
      result={result}
      onClear={clear}
      answerPlaceholder="0%"
    >
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Input
          inputMode="decimal"
          type="number"
          step="any"
          value={a}
          onChange={(e) => setA(e.target.value)}
          className="text-center text-lg"
          placeholder="Value A"
        />
        <Input
          inputMode="decimal"
          type="number"
          step="any"
          value={b}
          onChange={(e) => setB(e.target.value)}
          className="text-center text-lg"
          placeholder="Value B"
        />
      </div>
    </CalculatorFrame>
  );
};

const ValueChangeCard = () => {
  const [start, setStart] = useState("");
  const [percent, setPercent] = useState("");
  const [operator, setOperator] = useState("increase");
  const [result, setResult] = useState(createEmptyResult);

  const verb = useMemo(
    () => (operator === "increase" ? "increased" : "decreased"),
    [operator]
  );

  const calculate = () => {
    if (start.trim() === "" || percent.trim() === "") {
      setResult(createEmptyResult());
      return;
    }

    const s = parseFloat(start);
    const p = parseFloat(percent);
    if (!Number.isFinite(s) || !Number.isFinite(p)) {
      setResult({ error: "Please enter valid numbers" });
      return;
    }

    const multiplier = operator === "increase" ? 1 + p / 100 : 1 - p / 100;
    const value = s * multiplier;
    const formatted = formatNumber(value);
    setResult({
      value: formatted,
      explanation: `${s} ${verb} by ${p}% is ${formatted}`,
    });
  };

  const clear = () => {
    setStart("");
    setPercent("");
    setOperator("increase");
    setResult(createEmptyResult());
  };

  useEffect(() => {
    calculate();
  }, [start, percent, operator]);

  return (
    <CalculatorFrame
      title="Increase/Decrease Value"
      description="X increased/decreased by Y% equals what?"
      result={result}
      onClear={clear}
      answerPlaceholder="0"
    >
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Input
          inputMode="decimal"
          type="number"
          step="any"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="text-center text-lg"
          placeholder="Start value"
        />
        <Select value={operator} onValueChange={setOperator}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="increase">Increase by</SelectItem>
            <SelectItem value="decrease">Decrease by</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2">
          <Input
            inputMode="decimal"
            type="number"
            step="any"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            className="text-center text-lg"
            placeholder="0"
          />
          <span className="text-sm text-white">%</span>
        </div>
      </div>
    </CalculatorFrame>
  );
};

const PercentageCalculator = () => {
  return (
    <div className="mx-auto w-full max-w-7xl p-4 md:p-8">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Percentage Calculator
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Multiple calculators side-by-side for quick answers.
        </p>
      </div>

      <div className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PercentOfCard />
        <WhatPercentCard />
        <PercentageChangeCard />
        <FindTotalCard />
        <PercentageDifferenceCard />
        <ValueChangeCard />
      </div>
    </div>
  );
};

export default PercentageCalculator;
