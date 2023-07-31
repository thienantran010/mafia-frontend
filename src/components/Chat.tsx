import { messageJson } from '../types/gameTypes'
import { useState } from 'react';
export default function Chat( { name, messages } : {name: string, messages: messageJson[]}) {
    const [messagesState, setMessagesState] = useState(messages);
    return <h1>{name} Chat</h1>
}