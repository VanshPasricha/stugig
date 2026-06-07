import { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Send, Paperclip, Smile, Loader2 } from 'lucide-react';
import api from '../utils/axiosInterceptor';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { useLocation } from 'react-router-dom';

export default function Messages() {
    const { user } = useAuth();
    const location = useLocation();
    const [conversations, setConversations] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [chatHistory, setChatHistory] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loadingChats, setLoadingChats] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const [socket, setSocket] = useState(null);

    // Socket Initialization
    useEffect(() => {
        if (user && user._id) {
            const newSocket = io(import.meta.env.VITE_API_URL || 'https://stugig-backend.onrender.com');
            setSocket(newSocket);

            newSocket.on('connect', () => {
                newSocket.emit('register', user._id);
            });

            return () => newSocket.close();
        }
    }, [user]);

    // Fetch conversations
    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/api/messages/conversations');
            setConversations(data);
            
            // If no selected chat and NO newChatUser state, pick first chat
            if (data.length > 0 && !selectedChat && !location.state?.newChatUser) {
                setSelectedChat(data[0]);
            }
        } catch (err) {
            console.error('Failed to fetch conversations', err);
        } finally {
            setLoadingChats(false);
        }
    };

    // Fetch specific chat history
    const fetchChatHistory = async (otherUserId) => {
        try {
            const { data } = await api.get(`/api/messages/history/${otherUserId}`);
            setChatHistory(data);
            scrollToBottom();
        } catch (err) {
            console.error('Failed to fetch chat history', err);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchConversations();
    }, []);

    // Handle incoming chat initialization from state
    useEffect(() => {
        if (!loadingChats && location.state?.newChatUser) {
            const newUser = location.state.newChatUser;
            const existingChat = conversations.find(c => c.otherUser._id === newUser._id);
            
            if (existingChat) {
                setSelectedChat(existingChat);
            } else {
                const newConv = {
                    otherUser: newUser,
                    lastMessage: 'Say hi to start the conversation!',
                    lastMessageTime: new Date().toISOString(),
                    unreadCount: 0
                };
                setConversations(prev => {
                    if (prev.find(c => c.otherUser._id === newUser._id)) return prev;
                    return [newConv, ...prev];
                });
                setSelectedChat(newConv);
            }
            // Clear state so it doesn't run again on re-renders unnecessarily
            window.history.replaceState({}, document.title);
        }
    }, [loadingChats, location.state, conversations]);

    // Load history when selected chat changes
    useEffect(() => {
        if (selectedChat) {
            fetchChatHistory(selectedChat.otherUser._id);
        }
    }, [selectedChat]);

    // Listen for incoming real-time messages
    useEffect(() => {
        if (socket) {
            const handleNewMessage = (newMessage) => {
                const isCurrentChat = selectedChat && 
                    (newMessage.sender === selectedChat.otherUser._id || newMessage.receiver === selectedChat.otherUser._id);

                if (isCurrentChat) {
                    setChatHistory(prev => [...prev, newMessage]);
                    setTimeout(scrollToBottom, 100);
                }
                
                fetchConversations();
            };

            socket.on('newMessage', handleNewMessage);

            return () => {
                socket.off('newMessage', handleNewMessage);
            }
        }
    }, [socket, selectedChat]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedChat) return;
        
        const textToSend = messageInput;
        setMessageInput('');
        setSending(true);
        
        try {
            const { data } = await api.post('/api/messages', {
                receiverId: selectedChat.otherUser._id,
                text: textToSend
            });
            
            // Immediately append sent message to history
            setChatHistory(prev => [...prev, data]);
            setTimeout(scrollToBottom, 100);
            fetchConversations();
        } catch (err) {
            console.error('Failed to send message', err);
        } finally {
            setSending(false);
        }
    };

    const handleInput = (e) => {
        setMessageInput(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <div className="flex-1 flex overflow-hidden">
            
            {/* Conversations Sidebar */}
            <div className="w-80 border-r border-border/50 bg-background flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-border/50">
                    <h2 className="text-xl font-bold mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Search chats..." 
                            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loadingChats ? (
                        <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
                    ) : conversations.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground text-sm">No conversations yet.</div>
                    ) : conversations.map(chat => (
                        <div 
                            key={chat.otherUser._id}
                            onClick={() => setSelectedChat(chat)}
                            className={`p-4 border-b border-border/50 cursor-pointer transition-colors ${selectedChat?.otherUser?._id === chat.otherUser._id ? 'bg-muted border-l-2 border-l-primary' : 'hover:bg-muted/50 border-l-2 border-l-transparent'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img src={chat.otherUser.profileImage || `https://ui-avatars.com/api/?name=${chat.otherUser.name}`} alt={chat.otherUser.name} className="w-12 h-12 rounded-full border border-border" />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-bold text-sm text-foreground truncate">{chat.otherUser.name}</h4>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                            {new Date(chat.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className={`text-xs truncate ${chat.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                            {chat.lastMessage}
                                        </p>
                                        {chat.unreadCount > 0 && (
                                            <span className="ml-2 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                                                {chat.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Chat Window */}
            {selectedChat ? (
                <div className="flex-1 flex flex-col bg-card/30">
                    {/* Chat Header */}
                    <div className="h-16 px-6 border-b border-border/50 flex items-center justify-between bg-background/50 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <img src={selectedChat.otherUser.profileImage || `https://ui-avatars.com/api/?name=${selectedChat.otherUser.name}`} alt={selectedChat.otherUser.name} className="w-10 h-10 rounded-full border border-border" />
                            <div>
                                <h3 className="font-bold text-foreground">{selectedChat.otherUser.name}</h3>
                                <p className="text-xs text-muted-foreground capitalize">{selectedChat.otherUser.role} • Online</p>
                            </div>
                        </div>
                        <button className="p-2 hover:bg-muted rounded-full text-muted-foreground transition-colors">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="text-center">
                            <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">Today</span>
                        </div>

                        {chatHistory.map((msg) => {
                            const isMe = msg.sender === user._id;
                            return (
                                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
                                        <div className={`px-4 py-2.5 rounded-2xl ${isMe ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-muted text-foreground rounded-bl-none'}`}>
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                        <div className={`text-[10px] text-muted-foreground mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-muted text-foreground px-4 py-2.5 rounded-2xl rounded-bl-none max-w-[70%]">
                                <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-100"></span>
                                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce delay-200"></span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chat Input */}
                    <div className="p-4 bg-background border-t border-border/50">
                        <div className="flex items-center gap-2 max-w-4xl mx-auto">
                            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors shrink-0">
                                <Paperclip className="w-5 h-5" />
                            </button>
                            <div className="flex-1 relative">
                                <input 
                                    type="text" 
                                    value={messageInput}
                                    onChange={handleInput}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type a message..." 
                                    className="w-full pl-4 pr-10 py-3 bg-muted/50 border border-border/50 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                                />
                                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-full transition-colors">
                                    <Smile className="w-5 h-5" />
                                </button>
                            </div>
                            <button 
                                onClick={handleSendMessage}
                                disabled={sending || !messageInput.trim()}
                                className={`p-3 rounded-full flex items-center justify-center transition-all shrink-0 ${messageInput.trim() ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90' : 'bg-muted text-muted-foreground'}`}
                            >
                                {sending ? <Loader2 className="w-5 h-5 ml-0.5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-card/30 text-muted-foreground">
                    <p>Select a conversation to start messaging</p>
                </div>
            )}
        </div>
    );
}
