
import React, { useState } from 'react';

const ComplianceCalendar: React.FC = () => {
    const [date, setDate] = useState(new Date());

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const month = date.getMonth();
    const year = date.getFullYear();
    const totalDays = daysInMonth(month, year);
    const startDay = firstDayOfMonth(month, year);

    const complianceStatus = (day: number) => {
        // Mock compliance data for the calendar
        if (day > 0 && day < new Date().getDate()) {
            if (day % 5 === 0) return 'bg-red-200 dark:bg-red-800'; // Missed
            if (day % 3 === 0) return 'bg-yellow-200 dark:bg-yellow-800'; // Partial
            return 'bg-green-200 dark:bg-green-800'; // Full
        }
        return 'bg-transparent';
    };

    const calendarDays = [];
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    for (let day = 1; day <= totalDays; day++) {
        calendarDays.push(
            <div key={day} className={`p-2 text-center rounded-full ${complianceStatus(day)}`}>
                {day}
            </div>
        );
    }

    const changeMonth = (delta: number) => {
        setDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)}>&lt;</button>
                <h3 className="font-bold">{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => changeMonth(1)}>&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-sm">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="font-semibold text-center">{day}</div>
                ))}
                {calendarDays}
            </div>
        </div>
    );
};

export default ComplianceCalendar;
