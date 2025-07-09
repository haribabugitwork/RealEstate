// src/components/UpcomingVacanciesList.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { differenceInDays, parseISO } from 'date-fns';

const UpcomingVacanciesList = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await axios.get('/properties?status=upcomingVacancy');
        setUnits(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVacancies();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const today = new Date();

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Upcoming Vacancies</h2>
      <ul className="space-y-2">
        {units.map(unit => {
          const vacDate = parseISO(unit.vacancyDate);
          const daysUntil = differenceInDays(vacDate, today);
          const highlight = daysUntil <= 30;
          return (
            <li
              key={unit._id}
              className={`p-3 border rounded ${
                highlight ? 'bg-yellow-100' : 'bg-white'
              }`}
            >
              <div className="flex justify-between">
                <span>{unit.name}</span>
                <span>{vacDate.toLocaleDateString()}</span>
              </div>
              {highlight && (
                <div className="text-sm text-red-600">
                  Vacating in {daysUntil} days
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UpcomingVacanciesList;
