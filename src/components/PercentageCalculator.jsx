import React, { useEffect, useMemo, useState } from "react";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Select } from "./ui/select";

const formatNumber = (value) => {
  if (!Number.isFinite(value)) return String(value);
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
};

const createEmptyResult = () => ({ placeholder: true });

const ResultPanel = ({ result }) => {
  const output = result ?? createEmptyResult();

  if (output.placeholder) {
    return (
      <div className="mt-5 min-h-[112px] rounded-lg border border-dashed border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4 text-center">
        <div className="flex h-full flex-col items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm shadow-black/5">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Live result
          </div>
          <p className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-extrabold text-transparent">
            —
          </p>
          <p className="text-sm text-gray-600">
            Type in the fields to see the answer instantly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 min-h-[112px] rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
      {output.error ? (
        <p className="text-sm font-medium text-red-600">{output.error}</p>
      ) : (
        <>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Result
          </p>
          <p className="my-2 text-3xl font-extrabold text-blue-600">
            {output.value}
          </p>
          <p className="text-sm text-gray-700">{output.explanation}</p>
        </>
      )}
    </div>
  );
};

const CalculatorFrame = ({ title, description, children, result, onClear }) => {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="relative">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-4 top-4 rounded-full px-3 text-gray-500 hover:text-gray-900"
          onClick={onClear}
        >
          Clear
        </Button>
        <CardTitle className="text-center text-xl">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        <div className="flex flex-col items-center gap-4">{children}</div>
        <div className="mt-auto">
          <ResultPanel result={result} />
        </div>
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
      title="Percentage Of"
      description="What is X% of Y?"
      result={result}
      onClear={clear}
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="text-gray-700">What is</span>
        <Input
          inputMode="decimal"
          type="number"
          step="any"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          className="w-24 text-center text-lg"
          placeholder="0"
        />
        <span className="text-gray-700">% of</span>
        <Input
          inputMode="decimal"
          type="number"
          step="any"
          value={base}
          onChange={(e) => setBase(e.target.value)}
          className="w-28 text-center text-lg"
          placeholder="0"
        />
        <span className="text-gray-700">?</span>
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
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Input
          inputMode="decimal"
          type="number"
          step="any"
          value={part}
          onChange={(e) => setPart(e.target.value)}
          className="w-28 text-center text-lg"
          placeholder="0"
        />
        <span className="text-gray-700">is what % of</span>
        <Input
          inputMode="decimal"
          type="number"
          step="any"
          value={whole}
          onChange={(e) => setWhole(e.target.value)}
          className="w-28 text-center text-lg"
          placeholder="0"
        />
        <span className="text-gray-700">?</span>
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
    >
      <div className="flex w-full max-w-sm flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="w-14 text-sm text-gray-700">From</span>
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
          <span className="w-14 text-sm text-gray-700">To</span>
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
      title="Find Total"
      description="X is Y% of what?"
      result={result}
      onClear={clear}
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Input
          inputMode="decimal"
          type="number"
          step="any"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-28 text-center text-lg"
          placeholder="0"
        />
        <span className="text-gray-700">is</span>
        <Input
          inputMode="decimal"
          type="number"
          step="any"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          className="w-24 text-center text-lg"
          placeholder="0"
        />
        <span className="text-gray-700">% of what?</span>
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

    const avg = (v1 + v2) / 2;
    if (avg === 0) {
      setResult({ error: "Average of values cannot be zero" });
      return;
    }

    const diff = (Math.abs(v1 - v2) / Math.abs(avg)) * 100;
    const formatted = `${diff.toFixed(2)}%`;
    setResult({
      value: formatted,
      explanation: `Difference between ${v1} and ${v2} is ${formatted}`,
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
        <Select value={operator} onChange={(e) => setOperator(e.target.value)}>
          <option value="increase">Increase by</option>
          <option value="decrease">Decrease by</option>
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
          <span className="text-sm text-gray-700">%</span>
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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
