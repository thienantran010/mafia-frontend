import { DateTime } from 'luxon';
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

interface TimerProps {
    deadline: string;
}

const useTimer = (deadline : string) => {
    const [duration, setDuration] = useState(DateTime.fromISO(deadline).diffNow());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDuration((duration) => duration.minus({seconds: 1}));
        }, 1000);

        return () => {
            clearInterval(intervalId);
        }
    })

    useEffect(() => {
        setDuration(DateTime.fromISO(deadline).diffNow());
    }, [deadline]);
    
    return {
        hours: duration.hours,
        minutes: duration.minutes,
        seconds: duration.seconds
    }
}

export default function Timer({deadline} : TimerProps) {
    const { hours, minutes, seconds } = useTimer(deadline);

    return <Typography variant="h1">{hours}:{minutes}:{seconds}</Typography>
}