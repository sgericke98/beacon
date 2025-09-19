import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartCardProps {
  title: string;
  description?: string;
  type: "line" | "bar" | "pie";
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKeys: string[];
}

export function ChartCard({ title, description, type, data, xKey, yKeys }: ChartCardProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {type === "line" ? (
            <LineChart data={data} xKey={xKey} yKeys={yKeys} />
          ) : type === "bar" ? (
            <BarChart data={data} xKey={xKey} yKeys={yKeys} />
          ) : (
            <PieChart data={data} xKey={xKey} valueKey={yKeys[0]} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function LineChart({ data, xKey, yKeys }: { data: Array<Record<string, string | number>>; xKey: string; yKeys: string[] }) {
  const width = 600;
  const height = 220;
  const padding = 40;
  const colors = ["#6366f1", "#22c55e", "#f97316", "#14b8a6"];
  const numericValues = data.flatMap((item) => yKeys.map((key) => Number(item[key] ?? 0)));
  const max = Math.max(...numericValues, 1);
  const min = Math.min(...numericValues, 0);

  const pointsForKey = (key: string) =>
    data
      .map((item, index) => {
        const x = padding + (index / Math.max(1, data.length - 1)) * (width - padding * 2);
        const value = Number(item[key] ?? 0);
        const normalized = (value - min) / (max - min || 1);
        const y = height - padding - normalized * (height - padding * 2);
        return `${x},${y}`;
      })
      .join(" ");

  const axisYLabels = [0, 0.5, 1].map((tick) => min + (max - min) * tick);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <line x1={padding} x2={padding} y1={padding} y2={height - padding} stroke="#d1d5db" />
      <line x1={padding} x2={width - padding} y1={height - padding} y2={height - padding} stroke="#d1d5db" />
      {axisYLabels.map((label, index) => {
        const y = height - padding - ((label - min) / (max - min || 1)) * (height - padding * 2);
        return (
          <text key={index} x={4} y={y + 4} className="fill-current text-xs" fill="currentColor">
            {Math.round(label)}
          </text>
        );
      })}
      {data.map((item, index) => {
        const x = padding + (index / Math.max(1, data.length - 1)) * (width - padding * 2);
        return (
          <text key={index} x={x} y={height - padding + 16} textAnchor="middle" className="fill-current text-xs" fill="currentColor">
            {String(item[xKey])}
          </text>
        );
      })}
      {yKeys.map((key, idx) => (
        <polyline key={key} fill="none" stroke={colors[idx % colors.length]} strokeWidth={3} points={pointsForKey(key)} />
      ))}
    </svg>
  );
}

function BarChart({ data, xKey, yKeys }: { data: Array<Record<string, string | number>>; xKey: string; yKeys: string[] }) {
  const width = 600;
  const height = 220;
  const padding = 40;
  const colors = ["#6366f1", "#22c55e", "#f97316", "#14b8a6"];
  const max = Math.max(...data.flatMap((item) => yKeys.map((key) => Number(item[key] ?? 0))), 1);
  const barWidth = ((width - padding * 2) / data.length) * 0.7;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      <line x1={padding} x2={padding} y1={padding} y2={height - padding} stroke="#d1d5db" />
      <line x1={padding} x2={width - padding} y1={height - padding} y2={height - padding} stroke="#d1d5db" />
      {data.map((item, index) => {
        const groupX = padding + (index / data.length) * (width - padding * 2) + barWidth * 0.2;
        return (
          <g key={index}>
            <text x={groupX + barWidth / 2} y={height - padding + 16} textAnchor="middle" className="fill-current text-xs" fill="currentColor">
              {String(item[xKey])}
            </text>
            {yKeys.map((key, seriesIndex) => {
              const value = Number(item[key] ?? 0);
              const heightRatio = value / (max || 1);
              const barHeight = heightRatio * (height - padding * 2);
              const x = groupX + (seriesIndex / yKeys.length) * barWidth;
              const y = height - padding - barHeight;
              const widthPerSeries = Math.max(6, barWidth / yKeys.length - 4);
              return <rect key={`${key}-${seriesIndex}`} x={x} y={y} width={widthPerSeries} height={barHeight} fill={colors[seriesIndex % colors.length]} rx={4} />;
            })}
          </g>
        );
      })}
    </svg>
  );
}

function PieChart({ data, xKey, valueKey }: { data: Array<Record<string, string | number>>; xKey: string; valueKey: string }) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const colors = ["#6366f1", "#22c55e", "#f97316", "#14b8a6", "#ec4899"];
  const total = data.reduce((sum, item) => sum + Number(item[valueKey] ?? 0), 0);
  let offset = 0;

  return (
    <svg viewBox="0 0 220 220" className="h-full w-full">
      <g transform="translate(110,110)">
        {data.map((item, index) => {
          const value = Number(item[valueKey] ?? 0);
          const fraction = total ? value / total : 0;
          const strokeDasharray = `${fraction * circumference} ${circumference}`;
          const circle = (
            <circle
              key={index}
              r={radius}
              fill="transparent"
              stroke={colors[index % colors.length]}
              strokeWidth={32}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={-offset * circumference}
            />
          );
          offset += fraction;
          return circle;
        })}
      </g>
      <g transform="translate(10,10)">
        {data.map((item, index) => (
          <g key={index} transform={`translate(0, ${index * 20})`}>
            <rect width={12} height={12} fill={colors[index % colors.length]} rx={3} />
            <text x={18} y={10} className="fill-current text-xs" fill="currentColor">
              {String(item[xKey])}: {total ? Math.round((Number(item[valueKey] ?? 0) / total) * 100) : 0}%
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
