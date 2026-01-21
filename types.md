```javascript
// ===================================
// BASE TYPES
// ===================================

export type ObjectId = string;

export type Timestamps = {
  createdAt: string;
  updatedAt: string;
};

// ===================================
// NESTED TYPES
// ===================================

export type UserProfile = {
  fullName?: string;
  bio?: string;
  avatar: string;
  website?: string;
  phoneNumber?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
};

export type UserCounts = {
  posts: number;
  followers: number;
  following: number;
};

export type PostCounts = {
  likes: number;
  comments: number;
  shares: number;
};

export type CommentCounts = {
  likes: number;
  replies: number;
};

export type StoryCounts = {
  views: number;
  replies: number;
};

export type Media = {
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Location = {
  name?: string;
  coordinates?: Coordinates;
};

export type RecentComment = {
  _id: ObjectId;
  userId: ObjectId;
  username: string;
  userAvatar: string;
  text: string;
  createdAt: string;
};

export type StoryMedia = {
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  duration: number;
};

export type StickerPosition = {
  x: number;
  y: number;
};

export type Sticker = {
  type: 'location' | 'mention' | 'hashtag' | 'poll' | 'question' | 'music';
  data: any;
  position: StickerPosition;
};

export type Participant = {
  userId: ObjectId;
  username: string;
  avatar: string;
  lastReadAt: string;
};

export type LastMessage = {
  text: string;
  senderId: ObjectId;
  createdAt: string;
};

export type MessageContent = {
  text?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  sharedPostId?: ObjectId;
  sharedStoryId?: ObjectId;
};

export type ReadReceipt = {
  userId: ObjectId;
  readAt: string;
};

export type TopPost = {
  postId: ObjectId;
  thumbnailUrl: string;
};

// ===================================
// MAIN ENTITY TYPES
// ===================================

export type User = Timestamps & {
  _id: ObjectId;
  username: string;
  email: string;
  profile: UserProfile;
  counts: UserCounts;
  isVerified: boolean;
  isPrivate: boolean;
  lastLoginAt?: string;
};

export type Post = Timestamps & {
  _id: ObjectId;
  userId: ObjectId;
  username: string;
  userAvatar: string;
  media: Media[];
  caption?: string;
  location?: Location;
  hashtags: string[];
  mentions: string[];
  counts: PostCounts;
  recentComments: RecentComment[];
  isCommentsEnabled: boolean;
  isLikesVisible: boolean;
};

export type Comment = Timestamps & {
  _id: ObjectId;
  postId: ObjectId;
  userId: ObjectId;
  username: string;
  userAvatar: string;
  text: string;
  parentCommentId: ObjectId | null;
  mentions: string[];
  counts: CommentCounts;
};

export type Like = Timestamps & {
  _id: ObjectId;
  userId: ObjectId;
  targetType: 'post' | 'comment';
  targetId: ObjectId;
};

export type Follow = Timestamps & {
  _id: ObjectId;
  followerId: ObjectId;
  followingId: ObjectId;
  followerUsername: string;
  followingUsername: string;
  status: 'pending' | 'accepted';
};

export type Story = Timestamps & {
  _id: ObjectId;
  userId: ObjectId;
  username: string;
  userAvatar: string;
  media: StoryMedia;
  stickers: Sticker[];
  counts: StoryCounts;
  viewedBy: ObjectId[];
  expiresAt: string;
};

export type Conversation = Timestamps & {
  _id: ObjectId;
  participants: Participant[];
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  lastMessage?: LastMessage;
};

export type Message = Timestamps & {
  _id: ObjectId;
  conversationId: ObjectId;
  senderId: ObjectId;
  senderUsername: string;
  type: 'text' | 'image' | 'video' | 'post_share' | 'story_reply';
  content: MessageContent;
  reactions: Record<string, ObjectId[]>;
  readBy: ReadReceipt[];
  isDeleted: boolean;
};

export type Notification = Timestamps & {
  _id: ObjectId;
  recipientId: ObjectId;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'story_reply' | 'follow_request';
  actorId: ObjectId;
  actorUsername: string;
  actorAvatar: string;
  postId?: ObjectId;
  commentId?: ObjectId;
  storyId?: ObjectId;
  message: string;
  isRead: boolean;
};

export type SavedPost = Timestamps & {
  _id: ObjectId;
  userId: ObjectId;
  postId: ObjectId;
  collectionName: string;
};

export type Hashtag = {
  _id: string;
  count: number;
  recentCount: number;
  trending: boolean;
  topPost?: TopPost;
  lastUpdated: string;
};
```
