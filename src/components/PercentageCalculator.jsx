import React from "react";

import {
  FindTotalCard,
  PercentOfCard,
  PercentageChangeCard,
  PercentageDifferenceCard,
  ValueChangeCard,
  WhatPercentCard,
} from "./calculator/cards";

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
