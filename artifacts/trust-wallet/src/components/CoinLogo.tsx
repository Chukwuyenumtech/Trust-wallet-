import { useState } from "react";

interface CoinLogoProps {
  symbol: string;
  logoUrl: string;
  color: string;
  size?: number;
}

export default function CoinLogo({ symbol, logoUrl, color, size = 40 }: CoinLogoProps) {
  const [errored, setErrored] = useState(false);

  if (!errored) {
    return (
      <div
        className="rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
        style={{ width: size, height: size, background: color }}
      >
        <img
          src={logoUrl}
          alt={symbol}
          width={size}
          height={size}
          style={{ width: size, height: size, objectFit: "cover" }}
          onError={() => setErrored(true)}
        />
      </div>
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: color }}
    >
      <span className="text-white font-bold" style={{ fontSize: size * 0.32 }}>
        {symbol.slice(0, 3)}
      </span>
    </div>
  );
}
