export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** ₹4.8 Cr / ₹85 L — Indian short-scale price formatting. */
export function formatINR(value: number) {
  if (value >= 1_00_00_000) {
    const cr = value / 1_00_00_000;
    return `₹${trim(cr)} Cr`;
  }
  if (value >= 1_00_000) {
    return `₹${trim(value / 1_00_000)} L`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

function trim(n: number) {
  return Number(n.toFixed(n >= 10 ? 1 : 2)).toString();
}

export function formatCoord(value: number, axis: "lat" | "lng") {
  const dir = axis === "lat" ? (value >= 0 ? "N" : "S") : value >= 0 ? "E" : "W";
  const abs = Math.abs(value);
  const deg = Math.floor(abs);
  const minFloat = (abs - deg) * 60;
  const min = Math.floor(minFloat);
  const sec = Math.round((minFloat - min) * 60);
  return `${deg}°${String(min).padStart(2, "0")}′${String(sec).padStart(2, "0")}″ ${dir}`;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
