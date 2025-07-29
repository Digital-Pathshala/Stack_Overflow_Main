import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true,
    maxlength: 500
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['technology', 'science', 'programming', 'tutorial', 'discussion', 'news', 'other']
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  featured: {
    type: Boolean,
    default: false
  },
  readTime: {
    type: Number, // in minutes
    default: 1
  }
}, {
  timestamps: true
});

// Calculate read time based on content length
articleSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    const words = this.content.split(' ').length;
    this.readTime = Math.ceil(words / wordsPerMinute);
  }
  next();
});

// Index for search
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });
articleSchema.index({ createdAt: -1 });
articleSchema.index({ views: -1 });

const Article = mongoose.model('Article', articleSchema);
export default Article;