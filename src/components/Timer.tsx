import { Duration } from 'luxon';
import { useState, useEffect } from 'react';
import { Typography, Stack } from '@mui/material';


interface TimerProps {
    timeLeft: string,
    currentPhase: string
}
export default function Timer({timeLeft, currentPhase} : TimerProps) {
    const duration = Duration.fromISO(timeLeft);
    let hoursMinsSecs;
    if (duration.invalidExplanation) {
        hoursMinsSecs = <Typography variant="h1">Game Ended</Typography> 
    }
    else {
        hoursMinsSecs = <Typography variant="h1">{duration.hours}:{duration.minutes}:{duration.seconds}</Typography>
    }
    console.log(duration);
    return <Stack>
        {hoursMinsSecs}
        <Typography variant="subtitle1">{currentPhase}</Typography>
    </Stack>
}