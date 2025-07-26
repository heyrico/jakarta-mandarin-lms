import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  // ===== CONVERSATIONS =====
  async getAllConversations() {
    try {
      console.log('Returning mock conversations data');
      return [
        {
          id: 1,
          name: 'Admin - Sarah Chen',
          type: 'private',
          participants: [
            { id: 1, name: 'Admin JM', avatar: 'AJ', role: 'ADMIN', isOnline: true },
            { id: 2, name: 'Sarah Chen', avatar: 'SC', role: 'STUDENT', isOnline: false }
          ],
          lastMessage: {
            id: 15,
            content: 'Baik, saya akan konfirmasi jadwal kelas besok',
            sender: 'Sarah Chen',
            timestamp: '2024-01-25T10:30:00Z',
            isRead: true
          },
          unreadCount: 0,
          createdAt: '2024-01-20',
          updatedAt: '2024-01-25'
        },
        {
          id: 2,
          name: 'Guru Li Wei - Kelas Mandarin Basic',
          type: 'group',
          participants: [
            { id: 3, name: 'Li Wei', avatar: 'LW', role: 'TEACHER', isOnline: true },
            { id: 2, name: 'Sarah Chen', avatar: 'SC', role: 'STUDENT', isOnline: false },
            { id: 4, name: 'Budi Santoso', avatar: 'BS', role: 'STUDENT', isOnline: true },
            { id: 5, name: 'Lisa Wang', avatar: 'LW', role: 'STUDENT', isOnline: false }
          ],
          lastMessage: {
            id: 23,
            content: 'Materi untuk kelas besok sudah diupload di drive',
            sender: 'Li Wei',
            timestamp: '2024-01-25T09:15:00Z',
            isRead: false
          },
          unreadCount: 3,
          createdAt: '2024-01-15',
          updatedAt: '2024-01-25'
        },
        {
          id: 3,
          name: 'Admin - Budi Santoso',
          type: 'private',
          participants: [
            { id: 1, name: 'Admin JM', avatar: 'AJ', role: 'ADMIN', isOnline: true },
            { id: 4, name: 'Budi Santoso', avatar: 'BS', role: 'STUDENT', isOnline: true }
          ],
          lastMessage: {
            id: 8,
            content: 'Terima kasih atas pembayarannya',
            sender: 'Admin JM',
            timestamp: '2024-01-24T16:45:00Z',
            isRead: true
          },
          unreadCount: 0,
          createdAt: '2024-01-18',
          updatedAt: '2024-01-24'
        },
        {
          id: 4,
          name: 'Guru Chen Ming - Kelas Intermediate',
          type: 'group',
          participants: [
            { id: 6, name: 'Chen Ming', avatar: 'CM', role: 'TEACHER', isOnline: false },
            { id: 2, name: 'Sarah Chen', avatar: 'SC', role: 'STUDENT', isOnline: false },
            { id: 4, name: 'Budi Santoso', avatar: 'BS', role: 'STUDENT', isOnline: true }
          ],
          lastMessage: {
            id: 31,
            content: 'Homework untuk minggu ini sudah dikumpulkan semua',
            sender: 'Chen Ming',
            timestamp: '2024-01-25T08:30:00Z',
            isRead: true
          },
          unreadCount: 0,
          createdAt: '2024-01-22',
          updatedAt: '2024-01-25'
        },
        {
          id: 5,
          name: 'Admin - Lisa Wang',
          type: 'private',
          participants: [
            { id: 1, name: 'Admin JM', avatar: 'AJ', role: 'ADMIN', isOnline: true },
            { id: 5, name: 'Lisa Wang', avatar: 'LW', role: 'STUDENT', isOnline: false }
          ],
          lastMessage: {
            id: 12,
            content: 'Kapan bisa mulai kelas trial?',
            sender: 'Lisa Wang',
            timestamp: '2024-01-25T11:20:00Z',
            isRead: false
          },
          unreadCount: 1,
          createdAt: '2024-01-23',
          updatedAt: '2024-01-25'
        }
      ];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return [];
    }
  }

  async getConversationById(id: number) {
    try {
      const conversations = await this.getAllConversations();
      return conversations.find(conv => conv.id === id);
    } catch (error) {
      console.error('Error fetching conversation by id:', error);
      return null;
    }
  }

  async getConversationsByUser(userId: number) {
    try {
      const conversations = await this.getAllConversations();
      return conversations.filter(conv => 
        conv.participants.some(participant => participant.id === userId)
      );
    } catch (error) {
      console.error('Error fetching conversations by user:', error);
      return [];
    }
  }

  async createConversation(createConversationDto: any) {
    try {
      const newConversation = {
        id: Math.floor(Math.random() * 1000) + 1,
        name: createConversationDto.name,
        type: createConversationDto.type,
        participants: createConversationDto.participants,
        lastMessage: null,
        unreadCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return newConversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  async updateConversation(id: number, updateConversationDto: any) {
    try {
      const updatedConversation = {
        id: id,
        name: updateConversationDto.name,
        type: updateConversationDto.type,
        participants: updateConversationDto.participants,
        lastMessage: updateConversationDto.lastMessage,
        unreadCount: updateConversationDto.unreadCount,
        createdAt: updateConversationDto.createdAt,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      return updatedConversation;
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  }

  async deleteConversation(id: number) {
    try {
      return { success: true, message: 'Conversation deleted successfully' };
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  // ===== MESSAGES =====
  async getAllMessages() {
    try {
      console.log('Returning mock messages data');
      return [
        {
          id: 1,
          conversationId: 1,
          senderId: 1,
          senderName: 'Admin JM',
          senderAvatar: 'AJ',
          content: 'Halo Sarah, bagaimana dengan kelas kemarin?',
          messageType: 'text',
          timestamp: '2024-01-25T08:00:00Z',
          isRead: true,
          attachments: []
        },
        {
          id: 2,
          conversationId: 1,
          senderId: 2,
          senderName: 'Sarah Chen',
          senderAvatar: 'SC',
          content: 'Sangat menyenangkan! Saya sudah mengerti materi pinyin',
          messageType: 'text',
          timestamp: '2024-01-25T08:05:00Z',
          isRead: true,
          attachments: []
        },
        {
          id: 3,
          conversationId: 2,
          senderId: 3,
          senderName: 'Li Wei',
          senderAvatar: 'LW',
          content: 'Selamat pagi semua! Kelas hari ini akan membahas karakter dasar',
          messageType: 'text',
          timestamp: '2024-01-25T09:00:00Z',
          isRead: true,
          attachments: []
        },
        {
          id: 4,
          conversationId: 2,
          senderId: 3,
          senderName: 'Li Wei',
          senderAvatar: 'LW',
          content: 'Materi untuk kelas besok sudah diupload di drive',
          messageType: 'text',
          timestamp: '2024-01-25T09:15:00Z',
          isRead: false,
          attachments: [
            { name: 'materi_karakter_dasar.pdf', type: 'pdf', size: '2.5MB' }
          ]
        },
        {
          id: 5,
          conversationId: 3,
          senderId: 4,
          senderName: 'Budi Santoso',
          senderAvatar: 'BS',
          content: 'Admin, saya sudah transfer untuk paket intermediate',
          messageType: 'text',
          timestamp: '2024-01-24T16:30:00Z',
          isRead: true,
          attachments: [
            { name: 'bukti_transfer.jpg', type: 'image', size: '1.2MB' }
          ]
        },
        {
          id: 6,
          conversationId: 3,
          senderId: 1,
          senderName: 'Admin JM',
          senderAvatar: 'AJ',
          content: 'Terima kasih atas pembayarannya',
          messageType: 'text',
          timestamp: '2024-01-24T16:45:00Z',
          isRead: true,
          attachments: []
        },
        {
          id: 7,
          conversationId: 4,
          senderId: 6,
          senderName: 'Chen Ming',
          senderAvatar: 'CM',
          content: 'Homework untuk minggu ini sudah dikumpulkan semua',
          messageType: 'text',
          timestamp: '2024-01-25T08:30:00Z',
          isRead: true,
          attachments: []
        },
        {
          id: 8,
          conversationId: 5,
          senderId: 5,
          senderName: 'Lisa Wang',
          senderAvatar: 'LW',
          content: 'Kapan bisa mulai kelas trial?',
          messageType: 'text',
          timestamp: '2024-01-25T11:20:00Z',
          isRead: false,
          attachments: []
        }
      ];
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  async getMessagesByConversation(conversationId: number) {
    try {
      const messages = await this.getAllMessages();
      return messages.filter(msg => msg.conversationId === conversationId);
    } catch (error) {
      console.error('Error fetching messages by conversation:', error);
      return [];
    }
  }

  async getMessagesByUser(userId: number) {
    try {
      const messages = await this.getAllMessages();
      return messages.filter(msg => msg.senderId === userId);
    } catch (error) {
      console.error('Error fetching messages by user:', error);
      return [];
    }
  }

  async createMessage(createMessageDto: any) {
    try {
      const newMessage = {
        id: Math.floor(Math.random() * 1000) + 1,
        conversationId: createMessageDto.conversationId,
        senderId: createMessageDto.senderId,
        senderName: createMessageDto.senderName,
        senderAvatar: createMessageDto.senderAvatar,
        content: createMessageDto.content,
        messageType: createMessageDto.messageType || 'text',
        timestamp: new Date().toISOString(),
        isRead: false,
        attachments: createMessageDto.attachments || []
      };
      return newMessage;
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  async updateMessage(id: number, updateMessageDto: any) {
    try {
      const updatedMessage = {
        id: id,
        conversationId: updateMessageDto.conversationId,
        senderId: updateMessageDto.senderId,
        senderName: updateMessageDto.senderName,
        senderAvatar: updateMessageDto.senderAvatar,
        content: updateMessageDto.content,
        messageType: updateMessageDto.messageType,
        timestamp: updateMessageDto.timestamp,
        isRead: updateMessageDto.isRead,
        attachments: updateMessageDto.attachments
      };
      return updatedMessage;
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  }

  async deleteMessage(id: number) {
    try {
      return { success: true, message: 'Message deleted successfully' };
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  // ===== FILE UPLOAD =====
  async uploadFile(uploadFileDto: any) {
    try {
      const uploadedFile = {
        id: Math.floor(Math.random() * 1000) + 1,
        filename: uploadFileDto.filename,
        originalName: uploadFileDto.originalName,
        type: uploadFileDto.type,
        size: uploadFileDto.size,
        url: `/uploads/${uploadFileDto.filename}`,
        uploadedBy: uploadFileDto.uploadedBy,
        uploadedAt: new Date().toISOString()
      };
      return uploadedFile;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  async getFile(filename: string) {
    try {
      return {
        filename: filename,
        url: `/uploads/${filename}`,
        exists: true
      };
    } catch (error) {
      console.error('Error getting file:', error);
      throw error;
    }
  }

  // ===== VOICE/VIDEO CALLS =====
  async startCall(startCallDto: any) {
    try {
      const call = {
        id: Math.floor(Math.random() * 1000) + 1,
        type: startCallDto.type, // 'voice' or 'video'
        initiatorId: startCallDto.initiatorId,
        initiatorName: startCallDto.initiatorName,
        participants: startCallDto.participants,
        status: 'active',
        startTime: new Date().toISOString(),
        endTime: null,
        duration: 0
      };
      return call;
    } catch (error) {
      console.error('Error starting call:', error);
      throw error;
    }
  }

  async joinCall(callId: number, joinCallDto: any) {
    try {
      return {
        success: true,
        message: 'Successfully joined call',
        callId: callId,
        participantId: joinCallDto.participantId
      };
    } catch (error) {
      console.error('Error joining call:', error);
      throw error;
    }
  }

  async endCall(callId: number) {
    try {
      return {
        success: true,
        message: 'Call ended successfully',
        callId: callId,
        endTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error ending call:', error);
      throw error;
    }
  }

  async getCallHistory() {
    try {
      return [
        {
          id: 1,
          type: 'video',
          initiatorName: 'Li Wei',
          participants: ['Li Wei', 'Sarah Chen', 'Budi Santoso'],
          status: 'completed',
          startTime: '2024-01-24T14:00:00Z',
          endTime: '2024-01-24T15:30:00Z',
          duration: 90
        },
        {
          id: 2,
          type: 'voice',
          initiatorName: 'Admin JM',
          participants: ['Admin JM', 'Lisa Wang'],
          status: 'completed',
          startTime: '2024-01-23T10:00:00Z',
          endTime: '2024-01-23T10:15:00Z',
          duration: 15
        }
      ];
    } catch (error) {
      console.error('Error fetching call history:', error);
      return [];
    }
  }

  // ===== NOTIFICATIONS =====
  async getAllNotifications() {
    try {
      console.log('Returning mock notifications data');
      return [
        {
          id: 1,
          userId: 2,
          type: 'message',
          title: 'Pesan Baru',
          content: 'Li Wei mengirim pesan di grup Kelas Mandarin Basic',
          isRead: false,
          timestamp: '2024-01-25T09:15:00Z'
        },
        {
          id: 2,
          userId: 4,
          type: 'payment',
          title: 'Pembayaran Berhasil',
          content: 'Pembayaran paket intermediate telah dikonfirmasi',
          isRead: true,
          timestamp: '2024-01-24T16:45:00Z'
        },
        {
          id: 3,
          userId: 1,
          type: 'system',
          title: 'Sistem Update',
          content: 'Sistem akan diupdate pada pukul 02:00 WIB',
          isRead: false,
          timestamp: '2024-01-25T08:00:00Z'
        }
      ];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  }

  async getNotificationsByUser(userId: number) {
    try {
      const notifications = await this.getAllNotifications();
      return notifications.filter(notif => notif.userId === userId);
    } catch (error) {
      console.error('Error fetching notifications by user:', error);
      return [];
    }
  }

  async createNotification(createNotificationDto: any) {
    try {
      const newNotification = {
        id: Math.floor(Math.random() * 1000) + 1,
        userId: createNotificationDto.userId,
        type: createNotificationDto.type,
        title: createNotificationDto.title,
        content: createNotificationDto.content,
        isRead: false,
        timestamp: new Date().toISOString()
      };
      return newNotification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async markNotificationAsRead(id: number) {
    try {
      return {
        success: true,
        message: 'Notification marked as read',
        notificationId: id
      };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async deleteNotification(id: number) {
    try {
      return { success: true, message: 'Notification deleted successfully' };
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // ===== CHAT STATS =====
  async getChatStats() {
    try {
      return {
        totalConversations: 5,
        totalMessages: 8,
        activeUsers: 3,
        totalFiles: 2,
        totalCalls: 2,
        unreadMessages: 4,
        thisWeekMessages: 15,
        lastWeekMessages: 12
      };
    } catch (error) {
      console.error('Error fetching chat stats:', error);
      throw error;
    }
  }

  async getConversationStats(conversationId: number) {
    try {
      return {
        conversationId: conversationId,
        totalMessages: 8,
        participants: 4,
        lastActivity: '2024-01-25T11:20:00Z',
        averageResponseTime: '5 minutes',
        mostActiveUser: 'Li Wei'
      };
    } catch (error) {
      console.error('Error fetching conversation stats:', error);
      throw error;
    }
  }

  // ===== SEARCH =====
  async searchMessages(query: any) {
    try {
      const messages = await this.getAllMessages();
      const searchTerm = query.q?.toLowerCase();
      
      if (!searchTerm) return messages;
      
      return messages.filter(msg => 
        msg.content.toLowerCase().includes(searchTerm) ||
        msg.senderName.toLowerCase().includes(searchTerm)
      );
    } catch (error) {
      console.error('Error searching messages:', error);
      return [];
    }
  }

  async searchConversations(query: any) {
    try {
      const conversations = await this.getAllConversations();
      const searchTerm = query.q?.toLowerCase();
      
      if (!searchTerm) return conversations;
      
      return conversations.filter(conv => 
        conv.name.toLowerCase().includes(searchTerm) ||
        conv.participants.some(p => p.name.toLowerCase().includes(searchTerm))
      );
    } catch (error) {
      console.error('Error searching conversations:', error);
      return [];
    }
  }

  // ===== WEBSOCKET EVENTS (MOCK) =====
  async sendTypingEvent(typingEventDto: any) {
    try {
      return {
        success: true,
        event: 'typing',
        conversationId: typingEventDto.conversationId,
        userId: typingEventDto.userId,
        isTyping: typingEventDto.isTyping
      };
    } catch (error) {
      console.error('Error sending typing event:', error);
      throw error;
    }
  }

  async sendOnlineEvent(onlineEventDto: any) {
    try {
      return {
        success: true,
        event: 'online',
        userId: onlineEventDto.userId,
        isOnline: onlineEventDto.isOnline
      };
    } catch (error) {
      console.error('Error sending online event:', error);
      throw error;
    }
  }

  async sendReadEvent(readEventDto: any) {
    try {
      return {
        success: true,
        event: 'read',
        conversationId: readEventDto.conversationId,
        userId: readEventDto.userId,
        messageId: readEventDto.messageId
      };
    } catch (error) {
      console.error('Error sending read event:', error);
      throw error;
    }
  }
} 