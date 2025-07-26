import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Conversations
  @Get('conversations')
  async getAllConversations() {
    return this.chatService.getAllConversations();
  }

  @Get('conversations/:id')
  async getConversationById(@Param('id') id: string) {
    return this.chatService.getConversationById(parseInt(id));
  }

  @Get('conversations/user/:userId')
  async getConversationsByUser(@Param('userId') userId: string) {
    return this.chatService.getConversationsByUser(parseInt(userId));
  }

  @Post('conversations')
  async createConversation(@Body() createConversationDto: any) {
    return this.chatService.createConversation(createConversationDto);
  }

  @Put('conversations/:id')
  async updateConversation(@Param('id') id: string, @Body() updateConversationDto: any) {
    return this.chatService.updateConversation(parseInt(id), updateConversationDto);
  }

  @Delete('conversations/:id')
  async deleteConversation(@Param('id') id: string) {
    return this.chatService.deleteConversation(parseInt(id));
  }

  // Messages
  @Get('messages')
  async getAllMessages() {
    return this.chatService.getAllMessages();
  }

  @Get('messages/conversation/:conversationId')
  async getMessagesByConversation(@Param('conversationId') conversationId: string) {
    return this.chatService.getMessagesByConversation(parseInt(conversationId));
  }

  @Get('messages/user/:userId')
  async getMessagesByUser(@Param('userId') userId: string) {
    return this.chatService.getMessagesByUser(parseInt(userId));
  }

  @Post('messages')
  async createMessage(@Body() createMessageDto: any) {
    return this.chatService.createMessage(createMessageDto);
  }

  @Put('messages/:id')
  async updateMessage(@Param('id') id: string, @Body() updateMessageDto: any) {
    return this.chatService.updateMessage(parseInt(id), updateMessageDto);
  }

  @Delete('messages/:id')
  async deleteMessage(@Param('id') id: string) {
    return this.chatService.deleteMessage(parseInt(id));
  }

  // File Upload
  @Post('upload')
  async uploadFile(@Body() uploadFileDto: any) {
    return this.chatService.uploadFile(uploadFileDto);
  }

  @Get('files/:filename')
  async getFile(@Param('filename') filename: string) {
    return this.chatService.getFile(filename);
  }

  // Voice/Video Calls
  @Post('calls/start')
  async startCall(@Body() startCallDto: any) {
    return this.chatService.startCall(startCallDto);
  }

  @Post('calls/:callId/join')
  async joinCall(@Param('callId') callId: string, @Body() joinCallDto: any) {
    return this.chatService.joinCall(parseInt(callId), joinCallDto);
  }

  @Post('calls/:callId/end')
  async endCall(@Param('callId') callId: string) {
    return this.chatService.endCall(parseInt(callId));
  }

  @Get('calls/history')
  async getCallHistory() {
    return this.chatService.getCallHistory();
  }

  // Notifications
  @Get('notifications')
  async getAllNotifications() {
    return this.chatService.getAllNotifications();
  }

  @Get('notifications/user/:userId')
  async getNotificationsByUser(@Param('userId') userId: string) {
    return this.chatService.getNotificationsByUser(parseInt(userId));
  }

  @Post('notifications')
  async createNotification(@Body() createNotificationDto: any) {
    return this.chatService.createNotification(createNotificationDto);
  }

  @Put('notifications/:id/read')
  async markNotificationAsRead(@Param('id') id: string) {
    return this.chatService.markNotificationAsRead(parseInt(id));
  }

  @Delete('notifications/:id')
  async deleteNotification(@Param('id') id: string) {
    return this.chatService.deleteNotification(parseInt(id));
  }

  // Chat Stats
  @Get('stats')
  async getChatStats() {
    return this.chatService.getChatStats();
  }

  @Get('stats/conversation/:conversationId')
  async getConversationStats(@Param('conversationId') conversationId: string) {
    return this.chatService.getConversationStats(parseInt(conversationId));
  }

  // Search
  @Get('search')
  async searchMessages(@Query() query: any) {
    return this.chatService.searchMessages(query);
  }

  @Get('search/conversations')
  async searchConversations(@Query() query: any) {
    return this.chatService.searchConversations(query);
  }

  // WebSocket Events (Mock)
  @Post('events/typing')
  async sendTypingEvent(@Body() typingEventDto: any) {
    return this.chatService.sendTypingEvent(typingEventDto);
  }

  @Post('events/online')
  async sendOnlineEvent(@Body() onlineEventDto: any) {
    return this.chatService.sendOnlineEvent(onlineEventDto);
  }

  @Post('events/read')
  async sendReadEvent(@Body() readEventDto: any) {
    return this.chatService.sendReadEvent(readEventDto);
  }
} 