import mongoose from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: string[];
  marketData?: {
    BTCUSDT?: {
      price: string;
      symbol: string;
      timestamp: string;
    };
    ETHUSDT?: {
      price: string;
      symbol: string;
      timestamp: string;
    };
  };
}

export interface IChatSession {
  sessionId: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  context: [String],
  marketData: {
    BTCUSDT: {
      price: String,
      symbol: String,
      timestamp: String,
    },
    ETHUSDT: {
      price: String,
      symbol: String,
      timestamp: String,
    },
  },
});

const ChatSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ChatSessionSchema.pre('save', function () {
  this.updatedAt = new Date();
});

export default mongoose.models.ChatSession ||
  mongoose.model<IChatSession>('ChatSession', ChatSessionSchema);
