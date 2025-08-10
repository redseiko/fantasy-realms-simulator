
import { useState, useCallback, useEffect } from 'react';
import { FANTASY_MONTHS, FANTASY_DAYS_OF_WEEK, DAYS_IN_MONTH } from '../utils/time';

export const useTime = (isPaused: boolean, isLoading: boolean, error: string | null) => {
    const [currentYear, setCurrentYear] = useState<number | null>(null);
    const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(0);
    const [currentDay, setCurrentDay] = useState<number>(1);
    const [dayOfWeekIndex, setDayOfWeekIndex] = useState<number>(0);

    const advanceTime = useCallback(() => {
        setDayOfWeekIndex(prev => (prev + 1) % FANTASY_DAYS_OF_WEEK.length);
        setCurrentDay(prevDay => {
            const nextDay = prevDay + 1;
            if (nextDay > DAYS_IN_MONTH) {
                setCurrentMonthIndex(prevMonth => {
                    const nextMonthIndex = (prevMonth + 1) % FANTASY_MONTHS.length;
                    if (nextMonthIndex === 0) {
                        setCurrentYear(prevYear => (prevYear ? prevYear + 1 : 1));
                    }
                    return nextMonthIndex;
                });
                return 1;
            }
            return nextDay;
        });
    }, []);
    
    const setDate = useCallback((date: { year: number, monthIndex: number, day: number, dayOfWeekIndex: number }) => {
        setCurrentYear(date.year);
        setCurrentMonthIndex(date.monthIndex);
        setCurrentDay(date.day);
        setDayOfWeekIndex(date.dayOfWeekIndex);
    }, []);

    const randomizeDate = useCallback(() => {
        const randomMonth = Math.floor(Math.random() * FANTASY_MONTHS.length);
        const randomDay = Math.floor(Math.random() * DAYS_IN_MONTH) + 1;
        const randomDayOfWeek = Math.floor(Math.random() * FANTASY_DAYS_OF_WEEK.length);
        setCurrentMonthIndex(randomMonth);
        setCurrentDay(randomDay);
        setDayOfWeekIndex(randomDayOfWeek);
    }, []);

    useEffect(() => {
        if (isPaused || isLoading || error) {
            return;
        }

        const timer = setInterval(advanceTime, 1000);

        return () => clearInterval(timer);
    }, [isPaused, isLoading, error, advanceTime]);

    return {
        currentYear,
        currentMonthIndex,
        currentDay,
        dayOfWeekIndex,
        advanceTime,
        setCurrentYear,
        setDate,
        randomizeDate,
    };
};
