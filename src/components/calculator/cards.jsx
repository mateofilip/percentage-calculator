import React, { useEffect, useMemo, useState } from "react";

import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CalculatorFrame } from "./CalculatorFrame";
import { createEmptyResult, formatNumber } from "./utils";

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

export {
  FindTotalCard,
  PercentOfCard,
  PercentageChangeCard,
  PercentageDifferenceCard,
  ValueChangeCard,
  WhatPercentCard,
};

