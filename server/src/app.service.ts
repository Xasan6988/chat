import { Injectable } from '@nestjs/common';
import { Message, Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { MessageUpdatePayload } from './types/types';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  // Get all message
  async getMessages(): Promise<Message[]> {
    return this.prisma.message.findMany();
  }

  // Delete all message --for dev
  async clearMessages(): Promise<Prisma.BatchPayload> {
    return this.prisma.message.deleteMany();
  }

  // Create message
  async createMessage(data: Prisma.MessageCreateInput) {
    return this.prisma.message.create({data});
  }

  // Update message
  async updateMessage(payload: MessageUpdatePayload) {
    const {id, text} = payload;
    return this.prisma.message.update({ where: {id}, data: {text}});
  }

  // Delete message
  async removeMessage(where: Prisma.MessageWhereUniqueInput) {
    return this.prisma.message.delete({where});
  }
}
