'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Activity {
    average_watts?: number;
    moving_time: number;
}

interface PowerZoneChartProps {
    activities: Activity[];
    zones?: any;
    model?: 'standard' | 'polarized';
    colorBlindMode?: boolean;
}

// Default Power Zones (Estimated)
const DEFAULT_ZONES = [
    { min: 0, max: 150 },
    { min: 150, max: 200 },
    { min: 200, max: 250 },
    { min: 250, max: 300 },
    { min: 300, max: 2000 },
];

const ZONE_COLORS_STANDARD = ['#7f1d1d', '#991b1b', '#b91c1c', '#dc2626', '#ef4444'];
const ZONE_COLORS_POLARIZED = ['#c2410c', '#f97316', '#fbbf24']; // Dark Orange -> Orange -> Bright Amber

// Color Blind Palettes
const CB_COLORS_STANDARD = ['#999999', '#56B4E9', '#009E73', '#F0E442', '#E69F00']; // Matches default zones length
const CB_COLORS_POLARIZED = ['#0072B2', '#E69F00', '#D55E00'];

export default function PowerZoneChart({ activities, zones, model = 'standard', colorBlindMode = false }: PowerZoneChartProps) {
    // Calculate total duration only for activities with power data
    const totalDuration = activities.reduce((acc, curr) => {
        return (curr.average_watts !== undefined && curr.average_watts !== null) ? acc + curr.moving_time : acc;
    }, 0);

    let zoneDefinitions = DEFAULT_ZONES;
    if (zones && zones.zones) {
        zoneDefinitions = zones.zones;
    }

    // Process data to calculate percentage of total time per zone
    let data = zoneDefinitions.map((zone: any, index: number) => {
        const durationInSeconds = activities.reduce((total, activity) => {
            // Check if average_watts exists
            if (activity.average_watts && activity.average_watts >= zone.min && activity.average_watts < zone.max) {
                return total + activity.moving_time;
            }
            return total;
        }, 0);

        const percentage = totalDuration > 0 ? (durationInSeconds / totalDuration) * 100 : 0;
        const label = zone.max === -1 ? `>${zone.min}` : `${zone.min}-${zone.max}`;

        return {
            name: `Z${index + 1} (${label})`,
            label: label,
            value: parseFloat(percentage.toFixed(1)), // Percentage
            duration: parseFloat((durationInSeconds / 60).toFixed(0)), // Keep duration for tooltip
            min: zone.min,
            max: zone.max
        };
    });

    let colors = colorBlindMode ? CB_COLORS_STANDARD : ZONE_COLORS_STANDARD;

    // Aggregate for Polarized Model (3 Zones)
    if (model === 'polarized' && data.length === 5) {
        colors = colorBlindMode ? CB_COLORS_POLARIZED : ZONE_COLORS_POLARIZED;
        const z1 = data[0]; // Z1
        const z2 = data[1]; // Z2
        const z3 = data[2]; // Z3
        const z4 = data[3]; // Z4
        const z5 = data[4]; // Z5

        // Zone 1 (Low): Z1 + Z2
        const lowZone = {
            name: 'Zone 1 (Low)',
            label: `${z1.min}-${z2.max}`,
            value: parseFloat((z1.value + z2.value).toFixed(1)),
            duration: z1.duration + z2.duration,
            min: z1.min,
            max: z2.max
        };

        // Zone 2 (Threshold): Z3 + Z4
        const thresholdZone = {
            name: 'Zone 2 (Threshold)',
            label: `${z3.min}-${z4.max}`,
            value: parseFloat((z3.value + z4.value).toFixed(1)),
            duration: z3.duration + z4.duration,
            min: z3.min,
            max: z4.max
        };

        // Zone 3 (High): Z5
        const highZone = {
            name: 'Zone 3 (High)',
            label: z5.label,
            value: z5.value,
            duration: z5.duration,
            min: z5.min,
            max: z5.max
        };

        data = [lowZone, thresholdZone, highZone];
    }

    return (
        <div className="bg-gray-400 p-6 shadow-lg mb-8 rounded-none">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Power Zone Distribution History ({model === 'polarized' ? 'Polarized' : 'Pyramidal'})</h2>
            <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 40, // Increased bottom margin for rotated labels
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#9ca3af" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#374151"
                            tick={{ fill: '#374151', fontSize: 10 }}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis stroke="#374151" tick={{ fill: '#374151' }} label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fill: '#374151' }} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#f3f4f6', border: 'none', borderRadius: '0px', color: '#1f2937' }}
                            formatter={(value: number, name: string, props: any) => {
                                if (name === 'value') return [`${value}%`, 'Percentage'];
                                return [`${props.payload.duration} min`, 'Duration'];
                            }}
                            labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {data.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
