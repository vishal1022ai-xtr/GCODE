import React from 'react';
import type { Patient } from '../types';

interface PieChartProps {
  patients: Patient[];
}

const CompliancePieChart: React.FC<PieChartProps> = ({ patients }) => {
  const data = {
    'Compliant': patients.filter(p => p.complianceStatus === 'Compliant').length,
    'Partial': patients.filter(p => p.complianceStatus === 'Partial').length,
    'Non-Compliant': patients.filter(p => p.complianceStatus === 'Non-Compliant').length,
  };

  const total = patients.length;
  if (total === 0) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-full flex items-center justify-center">
            <p>No patient data available for this view.</p>
        </div>
    );
  }

  const colors = {
    'Compliant': '#4ade80', // green-400
    'Partial': '#facc15', // yellow-400
    'Non-Compliant': '#f87171', // red-400
  };

  let cumulativePercent = 0;
  const segments = Object.entries(data).map(([key, value]) => {
    if (value === 0) return null;
    const percent = (value / total) * 100;
    const startAngle = (cumulativePercent / 100) * 360;
    cumulativePercent += percent;
    const endAngle = (cumulativePercent / 100) * 360;
    
    const largeArcFlag = percent > 50 ? 1 : 0;

    const x1 = 50 + 40 * Math.cos(Math.PI * (startAngle - 90) / 180);
    const y1 = 50 + 40 * Math.sin(Math.PI * (startAngle - 90) / 180);
    const x2 = 50 + 40 * Math.cos(Math.PI * (endAngle - 90) / 180);
    const y2 = 50 + 40 * Math.sin(Math.PI * (endAngle - 90) / 180);

    return (
      <path
        key={key}
        d={`M 50,50 L ${x1},${y1} A 40,40 0 ${largeArcFlag},1 ${x2},${y2} Z`}
        fill={colors[key as keyof typeof colors]}
      />
    );
  }).filter(Boolean);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow h-full">
      <h2 className="text-xl font-bold mb-4 text-center">Patient Compliance Overview</h2>
      <div className="flex flex-col md:flex-row items-center justify-around gap-6">
        <svg viewBox="0 0 100 100" className="w-32 h-32 md:w-40 md:h-40">
          {segments}
        </svg>
        <div className="space-y-2">
          {Object.entries(colors).map(([key, color]) => (
            <div key={key} className="flex items-center">
              <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }}></span>
              <span>{key} ({data[key as keyof typeof data]})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompliancePieChart;