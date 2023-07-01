import { useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { Navigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import LogoutButton from '../components/LogoutButton';
import UserInfo from '../components/UserInfo';
import OpenGames from '../components/OpenGames';
import BasicTabs from '../components/BasicTabs';
import YourGames from '../components/YourGames';
import { socket } from '../socket';

export default function Home() {
    const {username} = useAuth();
    const tabs = [
        {name: "Open Games", contents: <OpenGames />, key: "Open Games"},
        {name: "Your Games", contents: <YourGames />, key: "Your Games"}
    ]
    return (
        <>
            <BasicTabs tabs={tabs} />
            <LogoutButton />
            <Typography>You are logged in as ${username}</Typography>
        </>
    )
}