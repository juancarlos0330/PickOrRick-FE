import * as React from "react";
import { FC } from "react";
import style from "./TimeBlock.module.scss";
import clsx from "clsx";

interface ITimeBlock {
  value: number;
  unit: string;
  className?: string;
}

export const TimeBlock: FC<ITimeBlock> = ({ value, unit, className }) => {
  return (
    <div className={clsx(style.timeCell, className && className)}>
      <p className={style.timeCell_value}>{value}</p>
      <p className={style.timeCell_unit}>{unit}</p>
    </div>
  );
};
