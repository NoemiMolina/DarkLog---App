import mongoose, { Schema, Document, Types } from "mongoose";

export type NotificationType = 
  | "forum_like"           
  | "forum_comment"       
  | "comment_reply"      
  | "comment_like"         
  | "friend_request";      

export interface INotification extends Document {
  recipientId: Types.ObjectId;  
  senderId: Types.ObjectId;    
  senderPseudo: string;          
  senderProfilePicture?: string; 
  type: NotificationType;
  message: string;            
  isRead: boolean;
  createdAt: Date;
  postId?: Types.ObjectId;       
  commentId?: Types.ObjectId;    
  friendRequestId?: Types.ObjectId; 
}

const NotificationSchema: Schema = new Schema({
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderPseudo: {
    type: String,
    required: true,
  },
  senderProfilePicture: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    enum: ["forum_like", "forum_comment", "comment_reply", "comment_like", "friend_request"],
    required: true,
    index: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Forum",
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: "Comment", 
  },
  friendRequestId: {
    type: Schema.Types.ObjectId,
  },
});

export default mongoose.model<INotification>("Notification", NotificationSchema);
