import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unSeenMessages, setUnSeenMessages] = useState({});

    const { socket, axios, authUser } = useContext(AuthContext);

    // Function to get all users for sidebar
    const getUsers = useCallback(async () => {
        if (!authUser) return; // wait until authenticated user loaded
        try {
            const { data } = await axios.get("/api/messages/users?includeSelf=true");
            if (data.success) {
                setUsers(data.users);
                setUnSeenMessages(data.unSeenMessages || {});
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [authUser, axios]);

    // Function to get messages for selected user
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Function to send messages to selected user
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Function to subscribe for selected user
    const subscribeToMessages = useCallback(() => {
        if (!socket) return; // wait until socket is ready
        const handler = async (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true; // optimistic
                setMessages((prev) => [...prev, newMessage]);
                try { await axios.put(`/api/messages/mark/${newMessage._id}`); } catch { /* ignore */ }
            } else {
                setUnSeenMessages((prev) => ({
                    ...prev,
                    [newMessage.senderId]: (prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1)
                }));
            }
        };
        socket.on('newMessage', handler);
        return () => socket.off('newMessage', handler);
    }, [socket, selectedUser, axios]);

    // Function to unsubscribe from messages
    const unsubscribeFromMessages = () => {
        if (socket) {
            socket.off('newMessages');
        }
    };

    useEffect(() => {
        const unsubscribe = subscribeToMessages();
        return () => unsubscribe && unsubscribe();
    }, [subscribeToMessages]);

    // Fetch users whenever auth user becomes available (login) or online users list changes
    useEffect(() => {
        getUsers();
    }, [getUsers, socket]);

    const value = {
        messages,
        setMessages,
        users,
        setUsers,
        selectedUser,
        setSelectedUser,
        unSeenMessages,
        setUnSeenMessages,
        getUsers,
        getMessages,
        sendMessage,
        subscribeToMessages,
        unsubscribeFromMessages
    }

    return (
        <ChatContext.Provider value={ value }>
            {children}
        </ChatContext.Provider>
    );
};