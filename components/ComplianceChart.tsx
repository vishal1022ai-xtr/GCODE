
import React from 'react';
import { COMPLIANCE_DATA } from '../constants';

const ComplianceChart: React.FC = () => {
  const maxCompliance = Math.max(...COMPLIANCE_DATA.map(d => d.compliance), 100);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="font-bold mb-4 text-lg">Weekly Compliance</h3>
      <div className="flex justify-around items-end h-48">
        {COMPLIANCE_DATA.map((data, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="w-8 bg-blue-500 rounded-t-md" 
              style={{ height: `${(data.compliance / maxCompliance) * 100}%` }}
              title={`${data.compliance}%`}
            ></div>
            <span className="text-xs mt-2">{data.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceChart;
