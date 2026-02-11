'use client';

import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

type SparklineChartProps = {
    data: number[];
    color: string;
};

export default function SparklineChart({ data, color }: SparklineChartProps) {
    if (!data || data.length === 0) return null;

    const chartData = data.map((val, i) => ({ i, val }));

    return (
        <div className="h-10 w-24">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <Line
                        type="monotone"
                        dataKey="val"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                    />
                    <YAxis domain={['dataMin', 'dataMax']} hide />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
