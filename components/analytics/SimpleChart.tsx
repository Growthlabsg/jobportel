'use client';

import { TrendData } from '@/types/analytics';
import { formatDate } from '@/lib/utils';

interface SimpleChartProps {
  data: TrendData[];
  title?: string;
  height?: number;
  color?: string;
}

export const SimpleChart = ({ data, title, height = 200, color = '#0F7377' }: SimpleChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500 dark:text-gray-400">
        No data available
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);

  const getBarHeight = (value: number) => {
    if (maxValue === minValue) return 50;
    return ((value - minValue) / (maxValue - minValue)) * (height - 40) + 20;
  };

  return (
    <div className="w-full">
      {title && <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>}
      <div className="relative" style={{ height: `${height}px` }}>
        <div className="flex items-end justify-between h-full gap-1">
          {data.map((item, index) => {
            const barHeight = getBarHeight(item.value);
            return (
              <div key={index} className="flex-1 flex flex-col items-center justify-end">
                <div
                  className="w-full rounded-t transition-all hover:opacity-80"
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: color,
                    minHeight: '4px',
                  }}
                  title={`${formatDate(item.date)}: ${item.value}`}
                />
                {data.length <= 12 && (
                  <span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
        <span>Min: {minValue}</span>
        <span>Max: {maxValue}</span>
      </div>
    </div>
  );
};

