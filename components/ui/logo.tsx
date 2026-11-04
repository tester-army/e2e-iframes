const LOGOS = {
  logotype: {
    viewBox: "0 0 407 142",
    rects: [
      [155.91, 0, 90.24, 19.06],
      [26.94, 24.48, 82.4, 19.09],
      [145.32, 24.48, 35.83, 19.09],
      [220.91, 24.48, 35.84, 19.09],
      [297.82, 24.48, 82.43, 19.09],
      [10.59, 49.04, 32.69, 19.05],
      [92.79, 49.04, 33.14, 19.05],
      [210.32, 49.04, 35.83, 19.05],
      [281.46, 49.04, 32.69, 19.05],
      [363.66, 49.04, 33.18, 19.05],
      [0, 73.54, 135.96, 19.08],
      [185.09, 73.54, 35.8, 19.08],
      [270.88, 73.54, 135.97, 19.08],
      [4.13, 98.07, 32.68, 19.05],
      [158.07, 98.04, 35.83, 19.08],
      [274.98, 98.07, 32.68, 19.05],
      [26.94, 122.57, 82.4, 19.05],
      [145.32, 122.57, 113.33, 19.05],
      [297.82, 122.57, 82.43, 19.05],
    ],
  },
  sign: {
    viewBox: "0 0 251.842 398.518",
    rects: [
      [49.87, 0, 152.676, 35.327],
      [19.596, 45.401, 60.543, 35.327],
      [171.822, 45.401, 61.444, 35.327],
      [0, 90.798, 251.842, 35.327],
      [7.62, 136.205, 60.543, 35.327],
      [49.874, 181.592, 152.673, 35.327],
      [7.62, 226.991, 60.543, 35.327],
      [0, 272.388, 251.842, 35.327],
      [19.596, 317.793, 60.543, 35.327],
      [171.822, 317.793, 61.444, 35.327],
      [49.87, 363.191, 152.676, 35.327],
    ],
  },
} as const;

/** The official e2e mark. It fills with `currentColor`; size it by width or height. */
export function Logo({
  variant = "logotype",
  label = "e2e",
  className,
}: {
  variant?: keyof typeof LOGOS;
  /** Accessible name. Pass "" when visible text beside the logo already names it. */
  label?: string;
  className?: string;
}) {
  const logo = LOGOS[variant];
  return (
    <svg
      viewBox={logo.viewBox}
      fill="currentColor"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      {logo.rects.map(([x, y, width, height]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={width} height={height} />
      ))}
    </svg>
  );
}
