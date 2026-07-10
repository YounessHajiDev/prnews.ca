'use client';

interface ProvinceData {
  name: string;
  count: number;
}

interface CanadaMapProps {
  provinces: ProvinceData[];
}

// Simplified SVG path data for Canadian provinces
const PROVINCE_PATHS: Record<string, { path: string; label: string }> = {
  'BC': { path: 'M 150 180 L 200 140 L 250 120 L 280 100 L 320 90 L 360 80 L 380 120 L 370 160 L 340 200 L 300 220 L 260 230 L 220 240 L 180 250 L 150 230 L 130 200 Z', label: 'British Columbia' },
  'AB': { path: 'M 360 80 L 420 70 L 480 70 L 520 80 L 540 120 L 540 180 L 500 200 L 460 210 L 420 220 L 380 210 L 340 200 L 370 160 L 380 120 Z', label: 'Alberta' },
  'SK': { path: 'M 520 80 L 560 75 L 590 80 L 600 120 L 600 180 L 590 220 L 560 230 L 540 220 L 540 180 L 540 120 Z', label: 'Saskatchewan' },
  'MB': { path: 'M 590 80 L 630 70 L 660 80 L 670 120 L 660 180 L 650 220 L 620 230 L 590 220 L 600 180 L 600 120 L 590 80 Z', label: 'Manitoba' },
  'ON': { path: 'M 660 80 L 700 60 L 740 50 L 780 60 L 800 100 L 810 140 L 800 180 L 780 210 L 740 220 L 700 210 L 670 200 L 660 180 L 670 120 Z', label: 'Ontario' },
  'QC': { path: 'M 740 50 L 780 30 L 820 20 L 860 30 L 880 60 L 870 100 L 850 140 L 820 180 L 800 180 L 810 140 L 800 100 Z', label: 'Quebec' },
  'NB': { path: 'M 850 140 L 870 150 L 880 170 L 870 190 L 850 180 Z', label: 'New Brunswick' },
  'NS': { path: 'M 870 190 L 890 200 L 900 220 L 880 230 L 860 210 Z', label: 'Nova Scotia' },
  'PE': { path: 'M 860 210 L 870 215 L 865 225 L 855 220 Z', label: 'Prince Edward Island' },
  'NL': { path: 'M 900 100 L 920 90 L 940 100 L 930 130 L 910 140 L 895 120 Z', label: 'Newfoundland and Labrador' },
  'YT': { path: 'M 100 80 L 150 60 L 200 50 L 250 50 L 280 60 L 300 80 L 280 100 L 240 110 L 200 110 L 160 100 L 130 95 Z', label: 'Yukon' },
  'NT': { path: 'M 280 100 L 340 70 L 400 60 L 460 55 L 520 60 L 560 75 L 590 80 L 540 120 L 500 130 L 460 130 L 420 120 L 380 110 L 340 110 L 300 100 Z', label: 'Northwest Territories' },
  'NU': { path: 'M 560 20 L 620 10 L 680 15 L 740 30 L 780 50 L 800 80 L 780 100 L 740 100 L 700 90 L 660 80 L 620 70 L 580 60 L 560 50 L 550 35 Z', label: 'Nunavut' },
};

export function CanadaMap({ provinces = [] }: CanadaMapProps) {
  return (
    <div className="relative aspect-[1.6] w-full max-w-3xl mx-auto">
      <svg viewBox="0 0 1000 300" className="w-full h-full">
        {Object.entries(PROVINCE_PATHS).map(([code, { path, label }]) => {
          const prov = provinces.find((p) => p.name === label);
          const count = prov?.count ?? 0;
          const intensity = Math.min(count / 5, 1);
          const fill = count > 0
            ? `rgba(212, 160, 23, ${0.2 + intensity * 0.8})`
            : 'rgba(255, 255, 255, 0.08)';
          const stroke = count > 0 ? '#D4A017' : 'rgba(255, 255, 255, 0.2)';

          return (
            <path
              key={code}
              d={path}
              fill={fill}
              stroke={stroke}
              strokeWidth={count > 0 ? 2 : 1}
              className="transition-all duration-300 cursor-pointer hover:fill-wire-amber/40"
            >
              <title>{label}: {count} releases</title>
            </path>
          );
        })}
      </svg>
    </div>
  );
}
