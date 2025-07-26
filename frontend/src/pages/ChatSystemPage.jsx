import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Input, 
  Button, 
  Avatar, 
  List, 
  Badge, 
  Space, 
  Tag, 
  Typography, 
  Divider,
  Row,
  Col,
  Statistic,
  Select,
  Tooltip,
  message,
  notification,
  Drawer,
  Form,
  Modal,
  Empty,
  Spin,
  Dropdown,
  Menu
} from 'antd';
import { 
  SendOutlined, 
  UserOutlined, 
  TeamOutlined, 
  MessageOutlined, 
  PhoneOutlined,
  VideoCameraOutlined,
  FileOutlined,
  SmileOutlined,
  PaperClipOutlined,
  MoreOutlined,
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  StarOutlined,
  StarFilled,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  CopyOutlined,
  DownloadOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  GroupOutlined,
  GlobalOutlined,
  HomeOutlined,
  BookOutlined,
  TrophyOutlined,
  DollarOutlined,
  CalendarOutlined,
  AudioOutlined,
  CloseOutlined,
  FullscreenOutlined,
  CheckOutlined
} from '@ant-design/icons';
import './ChatSystemPage.css';

const { Option } = Select;
const { TextArea } = Input;
const { Text, Title } = Typography;

const ChatSystemPage = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [allMessages, setAllMessages] = useState({}); // Store all messages by conversation ID
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [typingStatus, setTypingStatus] = useState({}); // Track who's typing
  const [onlineStatus, setOnlineStatus] = useState({}); // Track online status
  const [messageStatus, setMessageStatus] = useState({}); // Track message status (sent, delivered, read)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // Show/hide emoji picker
  const [showImagePreview, setShowImagePreview] = useState(null); // Show image preview
  const [showMeetingModal, setShowMeetingModal] = useState(false); // Show meeting link modal
  const [meetingLinks, setMeetingLinks] = useState({}); // Store meeting links
  const [stats, setStats] = useState({
    totalConversations: 0,
    unreadMessages: 0,
    onlineUsers: 0,
    totalMessages: 0
  });
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const messagesEndRef = useRef(null);
  const [form] = Form.useForm();

  // Get current user info
  const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
  const userRole = currentUser.role || 'SISWA';
  const userName = currentUser.name || 'User';

  // Get current user ID based on role
  const getCurrentUserId = () => {
    switch (userRole) {
      case 'SISWA':
        return 'siswa-budi';
      case 'GURU':
        return 'guru-li-wei';
      case 'SUPER_ADMIN':
        return 'admin-jakarta-mandarin';
      default:
        return 'siswa-budi';
    }
  };

  const currentUserId = getCurrentUserId();

  // Filter conversations based on user role and participants
  const getFilteredConversations = () => {
    return conversations.filter(conversation => {
      // User can see conversation if they are a participant
      if (conversation.participants.includes(currentUserId)) {
        return true;
      }
      
      // Admin can see all conversations
      if (userRole === 'SUPER_ADMIN') {
        return true;
      }
      
      // Teachers can see class conversations they created
      if (userRole === 'GURU' && conversation.type === 'class' && conversation.createdBy === currentUserId) {
        return true;
      }
      
      return false;
    });
  };

  // Call states
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState(null); // 'voice' or 'video'
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState(null);

  // WebRTC refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const callTimerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load data from localStorage
  const loadFromStorage = () => {
    try {
      // Clear old data from localStorage
      localStorage.removeItem('chatConversations');
      localStorage.removeItem('chatMessages');
      localStorage.removeItem('chatStats');
      
      // Set empty data
      setConversations([]);
      setAllMessages({});
      setStats({
        totalConversations: 0,
        unreadMessages: 0,
        onlineUsers: 0,
        totalMessages: 0
      });
    } catch (error) {
      console.error('Error clearing chat data:', error);
    }
  };

  // Save data to localStorage
  const saveToStorage = (conversationsData, messagesData, statsData) => {
    try {
      console.log('Saving conversations:', conversationsData);
      console.log('Saving messages:', messagesData);
      console.log('Saving stats:', statsData);
      
      localStorage.setItem('chatConversations', JSON.stringify(conversationsData));
      localStorage.setItem('chatMessages', JSON.stringify(messagesData));
      localStorage.setItem('chatStats', JSON.stringify(statsData));
    } catch (error) {
      console.error('Error saving chat data:', error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    // Clear any existing chat data first
    loadFromStorage();
    
    const fetchConversations = async () => {
      try {
        const response = await fetch('http://localhost:3000/chat/conversations');
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        } else {
          setConversations([]);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setConversations([]);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://localhost:3000/chat/messages');
        if (response.ok) {
          const data = await response.json();
          setAllMessages(data);
        } else {
          setAllMessages({});
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
        setAllMessages({});
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-scroll when new message is added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100); // Small delay to ensure DOM is updated
    }
  }, [messages.length]);

  // Call timer effect
  useEffect(() => {
    if (isCallActive && callStartTime) {
      callTimerRef.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartTime) / 1000));
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    }

    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [isCallActive, callStartTime]);

  const handleChatSelect = (conversation) => {
    setCurrentChat(conversation);
    setMessages(allMessages[conversation.id] || []);
    setShowSidebar(false); // Hide sidebar on mobile
    
    // Auto-scroll to bottom when selecting chat
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentChat) return;

    const messageId = Date.now();
    const message = {
      id: messageId,
      senderId: 'me',
      senderName: 'Saya',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isOwn: true,
      status: 'sent' // WhatsApp-like status: sent, delivered, read
    };

    // Update current messages
    setMessages(prev => [...prev, message]);
    
    // Update allMessages
    const updatedMessages = {
      ...allMessages,
      [currentChat.id]: [...(allMessages[currentChat.id] || []), message]
    };
    setAllMessages(updatedMessages);
    
    // Update message status
    setMessageStatus(prev => ({
      ...prev,
      [messageId]: 'sent'
    }));
    
    setNewMessage('');
    
    // Auto-scroll to bottom after sending message
    setTimeout(() => {
      scrollToBottom();
    }, 50);
    
    // Simulate message delivery and read status (like WhatsApp)
    setTimeout(() => {
      setMessageStatus(prev => ({
        ...prev,
        [messageId]: 'delivered'
      }));
    }, 1000);
    
    setTimeout(() => {
      setMessageStatus(prev => ({
        ...prev,
        [messageId]: 'read'
      }));
    }, 2000);
    
    // Simulate reply after 3 seconds
    setTimeout(() => {
      const replyId = Date.now() + 1;
      const reply = {
        id: replyId,
        senderId: currentChat.id,
        senderName: currentChat.name,
        content: 'Pesan diterima, terima kasih!',
        timestamp: new Date().toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isOwn: false,
        status: 'sent'
      };
      
      // Update current messages
      setMessages(prev => [...prev, reply]);
      
      // Update allMessages
      const updatedMessagesWithReply = {
        ...updatedMessages,
        [currentChat.id]: [...updatedMessages[currentChat.id], reply]
      };
      setAllMessages(updatedMessagesWithReply);
      
      // Auto-scroll to bottom after receiving reply
      setTimeout(() => {
        scrollToBottom();
      }, 50);
      
      // Save to localStorage
      saveToStorage(conversations, updatedMessagesWithReply, stats);
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#10B981';
      case 'offline': return '#6B7280';
      default: return '#F59E0B';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <CheckCircleOutlined />;
      case 'offline': return <ClockCircleOutlined />;
      default: return <ExclamationCircleOutlined />;
    }
  };

  const getAvatarColor = (type) => {
    switch (type) {
      case 'group': return '#3B82F6';
      case 'teacher': return '#10B981';
      case 'admin': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  // Call functions
  const startCall = async (type) => {
    try {
      setCallType(type);
      setIsInCall(true);
      
      // Get user media
      const constraints = {
        audio: true,
        video: type === 'video'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      if (type === 'video' && localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Simulate call connection
      setTimeout(() => {
        setIsCallActive(true);
        setCallStartTime(Date.now());
        message.success(`${type === 'video' ? 'Video' : 'Voice'} call started!`);
      }, 2000);

    } catch (error) {
      console.error('Error starting call:', error);
      message.error('Failed to start call. Please check your camera/microphone permissions.');
      setIsInCall(false);
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    setIsInCall(false);
    setIsCallActive(false);
    setCallType(null);
    setCallDuration(0);
    setCallStartTime(null);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsFullscreen(false);

    message.info('Call ended');
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  };

  const toggleFullscreen = () => {
    if (callType === 'video') {
      if (!isFullscreen) {
        if (remoteVideoRef.current.requestFullscreen) {
          remoteVideoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Simulate typing indicator
  const simulateTyping = (conversationId) => {
    setTypingStatus(prev => ({
      ...prev,
      [conversationId]: true
    }));
    
    setTimeout(() => {
      setTypingStatus(prev => ({
        ...prev,
        [conversationId]: false
      }));
    }, 3000);
  };

  // Get message status icon (like WhatsApp)
  const getMessageStatusIcon = (messageId) => {
    const status = messageStatus[messageId];
    switch (status) {
      case 'sent':
        return <CheckOutlined style={{ color: '#8E8E93', fontSize: '12px' }} />;
      case 'delivered':
        return <CheckOutlined style={{ color: '#8E8E93', fontSize: '12px' }} />;
      case 'read':
        return <CheckOutlined style={{ color: '#34C759', fontSize: '12px' }} />;
      default:
        return null;
    }
  };

  // Common emojis for picker
  const commonEmojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
    '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
    '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😯', '😦', '😧',
    '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢',
    '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '💩', '👻', '💀',
    '☠️', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽',
    '🙀', '😿', '😾', '🙈', '🙉', '🙊', '👶', '👧', '🧒', '👦',
    '👩', '🧑', '👨', '👵', '🧓', '👴', '👮‍♀️', '👮', '👮‍♂️', '🕵️‍♀️',
    '🕵️', '🕵️‍♂️', '💂‍♀️', '💂', '💂‍♂️', '👷‍♀️', '👷', '👷‍♂️', '🤴', '👸',
    '👳‍♀️', '👳', '👳‍♂️', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👼',
    '🎅', '🤶', '🧙‍♀️', '🧙', '🧙‍♂️', '🧝‍♀️', '🧝', '🧝‍♂️', '🧚‍♀️', '🧛',
    '🧛‍♂️', '🧟‍♀️', '🧟', '🧟‍♂️', '🧞‍♀️', '🧞', '🧞‍♂️', '🧜‍♀️', '🧜', '🧜‍♂️',
    '🧚‍♀️', '🧚', '🧚‍♂️', '👼', '🤰', '🤱', '👰', '🤵', '🧕', '🤵',
    '👳‍♂️', '👳', '👳‍♀️', '👸', '🤴', '👷‍♂️', '👷', '👷‍♀️', '💂‍♂️', '💂',
    '💂‍♀️', '🕵️‍♂️', '🕵️', '🕵️‍♀️', '👮‍♂️', '👮', '👮‍♀️', '👴', '🧓', '👵'
  ];

  // Handle emoji selection
  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  // Handle image upload with preview
  const handleImageUpload = (file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const messageId = Date.now();
        const message = {
          id: messageId,
          senderId: 'me',
          senderName: 'Saya',
          content: '📷 Gambar',
          timestamp: new Date().toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          isOwn: true,
          status: 'sent',
          attachment: {
            type: 'image',
            name: file.name,
            size: file.size,
            url: e.target.result
          }
        };

        setMessages(prev => [...prev, message]);
        
        const updatedMessages = {
          ...allMessages,
          [currentChat.id]: [...(allMessages[currentChat.id] || []), message]
        };
        setAllMessages(updatedMessages);
        saveToStorage(conversations, updatedMessages, stats);
        
        // Auto-scroll to bottom after uploading
        setTimeout(() => {
          scrollToBottom();
        }, 50);
      };
      reader.readAsDataURL(file);
    } else {
      // Handle other file types
      handleFileUpload(file);
    }
  };

  // Handle file attachment
  const handleFileUpload = (file) => {
    const messageId = Date.now();
    const message = {
      id: messageId,
      senderId: 'me',
      senderName: 'Saya',
      content: `📎 ${file.name}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isOwn: true,
      status: 'sent',
      attachment: {
        type: 'file',
        name: file.name,
        size: file.size
      }
    };

    setMessages(prev => [...prev, message]);
    
    const updatedMessages = {
      ...allMessages,
      [currentChat.id]: [...(allMessages[currentChat.id] || []), message]
    };
    setAllMessages(updatedMessages);
    saveToStorage(conversations, updatedMessages, stats);
    
    // Auto-scroll to bottom after uploading file
    setTimeout(() => {
      scrollToBottom();
    }, 50);
  };

  // Clear all chat data (for testing)
  const clearChatData = () => {
    Modal.confirm({
      title: 'Hapus Data Chat',
      content: 'Apakah Anda yakin ingin menghapus semua data chat? Tindakan ini tidak dapat dibatalkan.',
      okText: 'Ya, Hapus',
      cancelText: 'Batal',
      onOk: () => {
        localStorage.removeItem('chatConversations');
        localStorage.removeItem('chatMessages');
        localStorage.removeItem('chatStats');
        
        // Reset to empty data
        setConversations([]);
        setAllMessages({});
        setCurrentChat(null);
        setMessages([]);
        
        const newStats = {
          totalConversations: 0,
          unreadMessages: 0,
          onlineUsers: 0,
          totalMessages: 0
        };
        setStats(newStats);
        
        message.success('Data chat berhasil dihapus!');
      }
    });
  };

  // Generate meeting links
  const generateMeetingLink = (type, className, teacherName) => {
    const timestamp = Date.now();
    const classId = `${className.replace(/\s+/g, '-').toLowerCase()}-${timestamp}`;
    
    if (type === 'zoom') {
      // Generate realistic Zoom meeting link
      const zoomMeetingId = Math.floor(Math.random() * 900000000) + 100000000; // 9-digit meeting ID
      const zoomPasscode = Math.floor(Math.random() * 900000) + 100000; // 6-digit passcode
      return {
        type: 'zoom',
        url: `https://us02web.zoom.us/j/${zoomMeetingId}?pwd=${zoomPasscode}`,
        meetingId: zoomMeetingId,
        passcode: zoomPasscode,
        joinUrl: `https://us02web.zoom.us/j/${zoomMeetingId}`,
        dialIn: `+62-21-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
        className: className,
        teacherName: teacherName,
        createdAt: new Date().toISOString(),
        note: "⚠️ Link ini adalah simulasi. Untuk link Zoom yang valid, admin perlu membuat meeting di Zoom terlebih dahulu."
      };
    } else if (type === 'gmeet') {
      // Generate realistic Google Meet link
      const meetCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      return {
        type: 'gmeet',
        url: `https://meet.google.com/${meetCode}-${Math.random().toString(36).substring(2, 4)}`,
        meetingCode: meetCode,
        joinUrl: `https://meet.google.com/${meetCode}-${Math.random().toString(36).substring(2, 4)}`,
        dialIn: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        className: className,
        teacherName: teacherName,
        createdAt: new Date().toISOString(),
        note: "⚠️ Link ini adalah simulasi. Untuk link Google Meet yang valid, admin perlu membuat meeting di Google Calendar terlebih dahulu."
      };
    }
  };

  // Handle meeting link generation
  const handleGenerateMeeting = (conversationId, type) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) return;

    // Check if user wants to use valid links
    const useValidLinks = confirm(
      'Pilih opsi:\n\n' +
      'OK = Gunakan link valid (perlu setup API)\n' +
      'Cancel = Gunakan simulasi (untuk demo)'
    );

    if (useValidLinks) {
      // For valid links, we would need API integration
      const validLink = prompt(
        `Masukkan link ${type.toUpperCase()} yang valid:\n\n` +
        `Contoh Zoom: https://us02web.zoom.us/j/123456789?pwd=abcdef\n` +
        `Contoh GMeet: https://meet.google.com/abc-defg-hij`
      );
      
      if (validLink) {
        const meetingLink = {
          type: type,
          url: validLink,
          meetingId: validLink.match(/\/(\d{9,})/)?.[1] || 'Manual',
          passcode: validLink.match(/pwd=([a-zA-Z0-9]+)/)?.[1] || 'Manual',
          joinUrl: validLink,
          dialIn: '+62-21-XXXX-XXXX',
          className: conversation.name,
          teacherName: 'Guru Mandarin',
          createdAt: new Date().toISOString(),
          note: "✅ Link valid yang dimasukkan manual oleh admin."
        };
        
        createMeetingMessage(conversationId, meetingLink);
      }
    } else {
      // Use simulation
      const meetingLink = generateMeetingLink(type, conversation.name, 'Guru Mandarin');
      createMeetingMessage(conversationId, meetingLink);
    }
  };

  // Create meeting message
  const createMeetingMessage = (conversationId, meetingLink) => {
    // Save meeting link
    setMeetingLinks(prev => ({
      ...prev,
      [conversationId]: meetingLink
    }));

    // Create system message with meeting info
    const meetingMessage = {
      id: Date.now(),
      senderId: 'system',
      senderName: 'Sistem',
      content: `📅 Link Meeting ${meetingLink.type.toUpperCase()} untuk ${meetingLink.className} telah dibuat!`,
      timestamp: new Date().toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      isOwn: false,
      meetingInfo: meetingLink
    };

    // Add message to conversation
    const updatedMessages = {
      ...allMessages,
      [conversationId]: [...(allMessages[conversationId] || []), meetingMessage]
    };
    setAllMessages(updatedMessages);

    // Update current messages if this is the active chat
    if (currentChat && currentChat.id === conversationId) {
      setMessages(prev => [...prev, meetingMessage]);
    }

    // Save to localStorage
    saveToStorage(conversations, updatedMessages, stats);

    message.success(`Link ${meetingLink.type.toUpperCase()} berhasil dibuat!`);
    setShowMeetingModal(false);
  };

  // Copy meeting link to clipboard
  const copyMeetingLink = (link) => {
    navigator.clipboard.writeText(link.url).then(() => {
      message.success('Link meeting berhasil disalin!');
    }).catch(() => {
      message.error('Gagal menyalin link');
    });
  };

  return (
    <div className="chat-system-container">
      {/* Header */}
      <div className="chat-system-header">
        <Title level={2}>💬 Chat System Jakarta Mandarin</Title>
        <Text type="secondary">Komunikasi real-time antara guru, siswa, dan admin</Text>
      </div>

      {/* Stats */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={12} sm={6} lg={3}>
          <Card className="stat-card">
            <Statistic
              title="Total Percakapan"
              value={stats.totalConversations}
              prefix={<MessageOutlined />}
              valueStyle={{ color: '#8B5CF6' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="stat-card">
            <Statistic
              title="Pesan Belum Dibaca"
              value={stats.unreadMessages}
              prefix={<BellOutlined />}
              valueStyle={{ color: '#F59E0B' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="stat-card">
            <Statistic
              title="User Online"
              value={stats.onlineUsers}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#10B981' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="stat-card">
            <Statistic
              title="Total Pesan"
              value={stats.totalMessages}
              prefix={<FileOutlined />}
              valueStyle={{ color: '#EC4899' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Call Interface */}
      {isInCall && (
        <div className={`call-interface ${callType === 'video' ? 'video-call' : 'voice-call'}`}>
          <div className="call-header">
            <div className="call-info">
              <Avatar 
                size={40} 
                icon={<UserOutlined />}
                style={{ background: getAvatarColor(currentChat?.type) }}
              />
              <div className="call-details">
                <div className="call-name">{currentChat?.name || 'Unknown'}</div>
                <div className="call-status">
                  {isCallActive ? (
                    <span className="call-duration">{formatCallDuration(callDuration)}</span>
                  ) : (
                    <span className="connecting">Connecting...</span>
                  )}
                </div>
              </div>
            </div>
            <div className="call-actions">
              <Button 
                type="text" 
                icon={<CloseOutlined />}
                onClick={endCall}
                className="call-action-btn end-call"
              />
            </div>
          </div>

          {callType === 'video' && (
            <div className="video-container">
              <video
                ref={remoteVideoRef}
                className="remote-video"
                autoPlay
                playsInline
                muted={false}
              />
              <video
                ref={localVideoRef}
                className="local-video"
                autoPlay
                playsInline
                muted={true}
              />
            </div>
          )}

          {callType === 'voice' && (
            <div className="voice-container">
              <div className="voice-avatar">
                <Avatar 
                  size={120} 
                  icon={<UserOutlined />}
                  style={{ background: getAvatarColor(currentChat?.type) }}
                />
                <div className="voice-waves">
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                </div>
              </div>
            </div>
          )}

          <div className="call-controls">
            <Button 
              type="text" 
              icon={isMuted ? <CloseOutlined /> : <AudioOutlined />}
              onClick={toggleMute}
              className={`call-control-btn ${isMuted ? 'muted' : ''}`}
            />
            {callType === 'video' && (
              <Button 
                type="text" 
                icon={isVideoOff ? <EyeOutlined /> : <VideoCameraOutlined />}
                onClick={toggleVideo}
                className={`call-control-btn ${isVideoOff ? 'video-off' : ''}`}
              />
            )}
            <Button 
              type="primary" 
              icon={<CloseOutlined />}
              onClick={endCall}
              className="end-call-btn"
              danger
            />
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <div className={`chat-interface ${isInCall ? 'hidden' : ''}`}>
        {/* Sidebar - Conversations */}
        <div className={`conversations-sidebar ${showSidebar ? 'show' : ''}`}>
          <div className="conversations-header">
            <div className="header-content">
              <Title level={4} style={{ margin: 0 }}>Percakapan</Title>
              <Space>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />} 
                  size="small"
                  onClick={() => setModalVisible(true)}
                >
                  Baru
                </Button>
                <Button 
                  type="text" 
                  icon={<SettingOutlined />} 
                  size="small"
                  onClick={() => setDrawerVisible(true)}
                />
              </Space>
            </div>
            <Input.Search
              placeholder="Cari percakapan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ marginTop: 16 }}
            />
          </div>
          
          <div className="conversations-list">
            <List
              dataSource={filteredConversations}
              loading={loading}
              renderItem={(conversation) => (
                <List.Item
                  className={`conversation-item ${currentChat?.id === conversation.id ? 'active' : ''}`}
                  onClick={() => handleChatSelect(conversation)}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        dot={conversation.status === 'online'} 
                        offset={[-5, 5]}
                      >
                        <Avatar 
                          size={48} 
                          icon={<UserOutlined />}
                          style={{ background: getAvatarColor(conversation.type) }}
                        />
                      </Badge>
                    }
                    title={
                      <div className="conversation-title">
                        <span>{conversation.name}</span>
                        {conversation.unreadCount > 0 && (
                          <Badge count={conversation.unreadCount} size="small" />
                        )}
                        {conversation.isPrivate && (
                          <LockOutlined 
                            style={{ 
                              color: '#52c41a', 
                              fontSize: '12px', 
                              marginLeft: '4px' 
                            }} 
                            title="Percakapan Private"
                          />
                        )}
                      </div>
                    }
                    description={
                      <div className="conversation-description">
                        <Text ellipsis style={{ maxWidth: '200px' }}>
                          {typeof conversation.lastMessage === 'string' 
                            ? conversation.lastMessage 
                            : JSON.stringify(conversation.lastMessage)}
                        </Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {typeof conversation.timestamp === 'string' 
                            ? conversation.timestamp 
                            : conversation.timestamp instanceof Date 
                              ? conversation.timestamp.toLocaleString()
                              : JSON.stringify(conversation.timestamp)}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="chat-main">
          {currentChat ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-header-left">
                  <Button 
                    type="text" 
                    icon={<Menu />} 
                    className="mobile-menu-btn"
                    onClick={() => setShowSidebar(!showSidebar)}
                  />
                  <div className="user-info">
                    <Badge 
                      dot={currentChat.status === 'online'} 
                      offset={[-5, 5]}
                    >
                      <Avatar 
                        size={40} 
                        icon={<UserOutlined />}
                        style={{ background: getAvatarColor(currentChat.type) }}
                      />
                    </Badge>
                    <div className="user-details">
                      <div className="user-name">{currentChat.name}</div>
                      <div className="user-status">
                        <Tag 
                          color={getStatusColor(currentChat.status)} 
                          icon={getStatusIcon(currentChat.status)}
                          size="small"
                        >
                          {currentChat.status === 'online' ? 'Online' : 
                           currentChat.status === 'offline' ? 'Offline' : 
                           currentChat.type === 'group' ? `${currentChat.participants || 0} anggota` : 'Grup'}
                        </Tag>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chat-header-right">
                  {currentChat.type === 'class' && (
                    <Tooltip title="Generate Meeting Link">
                      <Button 
                        type="text" 
                        icon={<CalendarOutlined />} 
                        onClick={() => setShowMeetingModal(true)}
                        className="meeting-btn"
                      />
                    </Tooltip>
                  )}
                  <Tooltip title="Panggilan Suara">
                    <Button 
                      type="text" 
                      icon={<PhoneOutlined />} 
                      onClick={() => startCall('voice')}
                      className="call-btn voice-call-btn"
                    />
                  </Tooltip>
                  <Tooltip title="Panggilan Video">
                    <Button 
                      type="text" 
                      icon={<VideoCameraOutlined />} 
                      onClick={() => startCall('video')}
                      className="call-btn video-call-btn"
                    />
                  </Tooltip>
                  <Tooltip title="Info">
                    <Button type="text" icon={<InfoCircleOutlined />} />
                  </Tooltip>
                </div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <div 
                      key={message.id} 
                      className={`message ${message.isOwn ? 'own' : 'other'}`}
                    >
                      <div className="message-content">
                        <div className="message-header">
                          <span className="sender-name">{message.senderName}</span>
                          <span className="message-time">
                            {typeof message.timestamp === 'string' 
                              ? message.timestamp 
                              : message.timestamp instanceof Date 
                                ? message.timestamp.toLocaleString()
                                : JSON.stringify(message.timestamp)}
                          </span>
                          {message.isOwn && getMessageStatusIcon(message.id)}
                        </div>
                        <div className="message-text">
                          {message.meetingInfo ? (
                            <div className="meeting-message">
                              <div className="meeting-header">
                                <span className="meeting-title">
                                  {typeof message.content === 'string' 
                                    ? message.content 
                                    : JSON.stringify(message.content)}
                                </span>
                              </div>
                              <div className="meeting-details">
                                <div className="meeting-info">
                                  <strong>Kelas:</strong> {message.meetingInfo.className}<br/>
                                  <strong>Guru:</strong> {message.meetingInfo.teacherName}<br/>
                                  <strong>Meeting ID:</strong> {message.meetingInfo.meetingId || message.meetingInfo.meetingCode}<br/>
                                  {message.meetingInfo.passcode && (
                                    <><strong>Passcode:</strong> {message.meetingInfo.passcode}<br/></>
                                  )}
                                  <strong>Dial-in:</strong> {message.meetingInfo.dialIn}
                                </div>
                                <div className="meeting-note">
                                  <Text type="warning" style={{ fontSize: '11px' }}>
                                    {message.meetingInfo.note}
                                  </Text>
                                </div>
                                <div className="meeting-actions">
                                  <Button 
                                    type="primary" 
                                    size="small"
                                    onClick={() => window.open(message.meetingInfo.joinUrl, '_blank')}
                                    style={{ marginRight: '8px' }}
                                  >
                                    🚀 Join Meeting
                                  </Button>
                                  <Button 
                                    size="small"
                                    onClick={() => copyMeetingLink(message.meetingInfo)}
                                  >
                                    📋 Copy Link
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : message.attachment ? (
                            message.attachment.type === 'image' ? (
                              <div className="image-attachment">
                                <img 
                                  src={message.attachment.url} 
                                  alt={message.attachment.name}
                                  onClick={() => setShowImagePreview(message.attachment.url)}
                                  style={{ 
                                    maxWidth: '200px', 
                                    maxHeight: '200px', 
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                  }}
                                />
                                <div className="image-info">
                                  <span>{message.attachment.name}</span>
                                  <span className="file-size">
                                    ({(message.attachment.size / 1024).toFixed(1)} KB)
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="attachment">
                                <PaperClipOutlined style={{ marginRight: '8px' }} />
                                <span>{message.attachment.name}</span>
                                <span className="file-size">
                                  ({(message.attachment.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                            )
                          ) : (
                            typeof message.content === 'string' 
                              ? message.content 
                              : JSON.stringify(message.content)
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <Empty 
                    description="Belum ada pesan" 
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input">
                <div className="input-container">
                  <div className="input-actions">
                    <input
                      type="file"
                      id="file-upload"
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleImageUpload(e.target.files[0]);
                        }
                      }}
                    />
                    <Button 
                      type="text" 
                      icon={<PaperClipOutlined />} 
                      onClick={() => document.getElementById('file-upload').click()}
                      title="Lampirkan file"
                    />
                    <Button 
                      type="text" 
                      icon={<SmileOutlined />} 
                      onClick={() => setShowEmojiPicker(true)}
                      title="Emoji"
                    />
                  </div>
                  <TextArea
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      // Simulate typing indicator
                      if (currentChat) {
                        simulateTyping(currentChat.id);
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    placeholder="Ketik pesan..."
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    style={{ 
                      border: 'none', 
                      resize: 'none',
                      padding: '12px 16px',
                      fontSize: '14px'
                    }}
                  />
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />} 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  />
                </div>
                
                {/* Typing Indicator */}
                {typingStatus[currentChat?.id] && (
                  <div className="typing-indicator">
                    <span className="typing-text">
                      {currentChat?.name} sedang mengetik...
                    </span>
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-chat">
              <Empty 
                description="Pilih percakapan untuk mulai chat" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {showSidebar && <div className="mobile-overlay" onClick={() => setShowSidebar(false)} />}

      {/* Modals and Drawers */}
      <Modal
        title="Percakapan Baru"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Tipe Percakapan" required name="type">
            <Select 
              placeholder="Pilih tipe"
              onChange={(value) => {
                console.log('Conversation type selected:', value);
                // Reset form when type changes
                form.setFieldsValue({ name: '', participants: [] });
              }}
            >
              <Option value="private">Private Chat (1-on-1)</Option>
              <Option value="class">Grup Kelas</Option>
              <Option value="study">Grup Belajar</Option>
              <Option value="announcement">Pengumuman (Admin Only)</Option>
            </Select>
          </Form.Item>
          
          <Form.Item label="Nama Percakapan" required name="name">
            <Input 
              placeholder="Masukkan nama percakapan" 
              onChange={(e) => {
                console.log('Conversation name:', e.target.value);
              }}
            />
          </Form.Item>

          <Form.Item label="Peserta" required name="participants">
            <Select
              mode="multiple"
              placeholder="Pilih peserta"
              style={{ width: '100%' }}
              onChange={(values) => {
                console.log('Selected participants:', values);
              }}
            >
              {/* Dynamic participants will be loaded from backend */}
            </Select>
          </Form.Item>

          <Form.Item label="Pengaturan Privasi">
            <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <LockOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                <Text strong>Percakapan Private</Text>
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Hanya peserta yang dipilih yang dapat melihat dan mengirim pesan dalam percakapan ini.
              </Text>
            </div>
          </Form.Item>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <Button 
              onClick={() => setModalVisible(false)}
              style={{ flex: 1 }}
            >
              Batal
            </Button>
            <Button 
              type="primary"
              onClick={() => {
                console.log('Creating new conversation...');
                
                // Validate form using Ant Design form validation
                form.validateFields()
                  .then((values) => {
                    console.log('Form values:', values);
                    
                    // Additional validation
                    if (!values.name || !values.participants || values.participants.length === 0) {
                      message.error('Mohon lengkapi semua field yang diperlukan');
                      return;
                    }

                    // Create new conversation with privacy settings
                    const newConversation = {
                      id: Date.now(),
                      name: values.name,
                      type: values.type || 'private',
                      status: 'online',
                      lastMessage: 'Percakapan baru dibuat',
                      timestamp: new Date().toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }),
                      unreadCount: 0,
                      avatar: null,
                      participants: values.participants,
                      isPrivate: true,
                      createdBy: currentUserId
                    };

                    // Create initial message for new conversation
                    const initialMessage = {
                      id: Date.now() + 1,
                      senderId: 'system',
                      senderName: 'Sistem',
                      content: `Percakapan "${values.name}" telah dibuat. Selamat chatting!`,
                      timestamp: new Date().toLocaleTimeString('id-ID', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }),
                      isOwn: false
                    };

                    console.log('New conversation created:', newConversation);
                    console.log('Initial message created:', initialMessage);
                    
                    // Add new conversation to state
                    const updatedConversations = [...conversations, newConversation];
                    setConversations(updatedConversations);
                    
                    // Add initial message to allMessages
                    const updatedMessages = {
                      ...allMessages,
                      [newConversation.id]: [initialMessage]
                    };
                    setAllMessages(updatedMessages);
                    
                    // Update stats
                    const updatedStats = {
                      ...stats,
                      totalConversations: stats.totalConversations + 1,
                      totalMessages: stats.totalMessages + 1
                    };
                    setStats(updatedStats);
                    
                    // Save everything to localStorage immediately
                    saveToStorage(updatedConversations, updatedMessages, updatedStats);

                    // Auto-select the new conversation (like WhatsApp/Messenger)
                    setCurrentChat(newConversation);
                    setMessages([initialMessage]);
                    setShowSidebar(false); // Hide sidebar on mobile for better UX

                    message.success('Percakapan baru berhasil dibuat!');
                    setModalVisible(false);
                    form.resetFields();
                  })
                  .catch((errorInfo) => {
                    console.log('Form validation failed:', errorInfo);
                    message.error('Mohon lengkapi semua field yang diperlukan');
                  });
              }}
              style={{ 
                flex: 1,
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                border: 'none'
              }}
            >
              Buat Percakapan
            </Button>
          </div>
        </Form>
      </Modal>

      <Drawer
        title="Pengaturan Chat"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={320}
      >
        <div style={{ padding: '16px 0' }}>
          <h4>Data Management</h4>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            Kelola data chat dan pengaturan aplikasi
          </p>
          
          <Button 
            type="primary" 
            danger
            icon={<DeleteOutlined />}
            onClick={clearChatData}
            style={{ width: '100%', marginBottom: '16px' }}
          >
            Hapus Semua Data Chat
          </Button>
          
          <div style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <InfoCircleOutlined style={{ marginRight: '4px' }} />
              Data chat tersimpan di browser Anda. Hapus data untuk kembali ke kondisi awal.
            </Text>
          </div>
        </div>
      </Drawer>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="emoji-picker-overlay">
          <div className="emoji-picker-content">
            <div className="emoji-categories">
              <h3>Emoji</h3>
              <div className="emoji-grid">
                {commonEmojis.map((emoji, index) => (
                  <span
                    key={index}
                    className="emoji-item"
                    onClick={() => handleEmojiSelect(emoji)}
                  >
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
            <div className="emoji-footer">
              <Button onClick={() => setShowEmojiPicker(false)}>Tutup</Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && (
        <div className="image-preview-overlay" onClick={() => setShowImagePreview(null)}>
          <div className="image-preview-content">
            <img 
              src={showImagePreview} 
              alt="Preview"
              style={{ 
                maxWidth: '90vw', 
                maxHeight: '90vh', 
                objectFit: 'contain' 
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <Button 
              type="primary"
              icon={<CloseOutlined />}
              onClick={() => setShowImagePreview(null)}
              className="close-preview-btn"
            >
              Tutup
            </Button>
          </div>
        </div>
      )}

      {/* Meeting Generation Modal */}
      <Modal
        title="Generate Meeting Link"
        open={showMeetingModal}
        onCancel={() => setShowMeetingModal(false)}
        footer={null}
        width={500}
      >
        <div style={{ padding: '20px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h3>Pilih Platform Meeting</h3>
            <p style={{ color: '#666' }}>
              Generate link meeting untuk kelas: <strong>{currentChat?.name}</strong>
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Card 
              hoverable 
              style={{ width: 200, textAlign: 'center' }}
              onClick={() => handleGenerateMeeting(currentChat?.id, 'zoom')}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📹</div>
              <h4>Zoom Meeting</h4>
              <p style={{ color: '#666', fontSize: '12px' }}>
                Generate link Zoom dengan meeting ID dan passcode
              </p>
            </Card>
            
            <Card 
              hoverable 
              style={{ width: 200, textAlign: 'center' }}
              onClick={() => handleGenerateMeeting(currentChat?.id, 'gmeet')}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎥</div>
              <h4>Google Meet</h4>
              <p style={{ color: '#666', fontSize: '12px' }}>
                Generate link Google Meet dengan meeting code
              </p>
            </Card>
          </div>
          
          <div style={{ marginTop: '24px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <InfoCircleOutlined style={{ marginRight: '4px' }} />
              Link meeting akan otomatis dikirim ke chat kelas dan tersimpan di sistem.
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChatSystemPage; 