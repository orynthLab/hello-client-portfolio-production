import { HTMLAttributes } from "react";
import clsx from "clsx";

export default function GlassPanel({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("glass-panel rounded-3xl", className)} {...rest}>
      {children}
    </div>
  );
}
