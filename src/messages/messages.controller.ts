import { Body, Controller, Post } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message-dto';
import { MessageRecord, MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(@Body() body: CreateMessageDto): Promise<MessageRecord> {
    return this.messagesService.create(body);
  }
}
