const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema(
  {
    // Dispute identification
    disputeId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    
    // Dispute type and category
    type: {
      type: String,
      required: true,
      enum: [
        'quality_issue',
        'payment_dispute', 
        'copyright_infringement',
        'data_misrepresentation',
        'delivery_issue',
        'refund_request',
        'other'
      ],
      default: 'other'
    },
    
    // Priority level
    priority: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    
    // Status tracking
    status: {
      type: String,
      required: true,
      enum: [
        'open',
        'under_review',
        'investigating',
        'awaiting_response',
        'resolved',
        'closed',
        'escalated'
      ],
      default: 'open'
    },
    
    // Parties involved
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    againstUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    // Related dataset/transaction
    datasetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DatasetCatalogue',
      required: false // Optional, for general disputes
    },
    
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: false // Optional, for general disputes
    },
    
    // Dispute details
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000
    },
    
    // Evidence and attachments
    evidence: [{
      type: {
        type: String,
        enum: ['image', 'document', 'link', 'other'],
        required: true
      },
      url: {
        type: String,
        required: true,
        trim: true
      },
      description: {
        type: String,
        trim: true,
        maxlength: 500
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Resolution details
    resolution: {
      outcome: {
        type: String,
        enum: [
          'refund_full',
          'refund_partial',
          'replacement',
          'compensation',
          'warning_issued',
          'account_suspended',
          'dispute_dismissed',
          'other'
        ]
      },
      amount: {
        type: Number,
        min: 0
      },
      currency: {
        type: String,
        default: 'MATIC',
        enum: ['MATIC', 'ETH', 'USD']
      },
      notes: {
        type: String,
        trim: true,
        maxlength: 1000
      },
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Admin who resolved
      },
      resolvedAt: {
        type: Date
      }
    },
    
    // Admin assignment and notes
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Admin assigned to handle
    },
    
    adminNotes: [{
      note: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
      },
      adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Communication history
    messages: [{
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
      },
      isInternal: {
        type: Boolean,
        default: false // For admin-only notes
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    
    // Timestamps for tracking
    openedAt: {
      type: Date,
      default: Date.now
    },
    
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    
    closedAt: {
      type: Date
    },
    
    // Escalation tracking
    escalatedAt: {
      type: Date
    },
    
    escalationReason: {
      type: String,
      trim: true,
      maxlength: 500
    },
    
    // Tags for categorization
    tags: [{
      type: String,
      trim: true,
      maxlength: 50
    }]
  },
  { timestamps: true }
);

// Indexes for better query performance
disputeSchema.index({ disputeId: 1 });
disputeSchema.index({ status: 1 });
disputeSchema.index({ type: 1 });
disputeSchema.index({ priority: 1 });
disputeSchema.index({ raisedBy: 1 });
disputeSchema.index({ againstUser: 1 });
disputeSchema.index({ datasetId: 1 });
disputeSchema.index({ transactionId: 1 });
disputeSchema.index({ assignedTo: 1 });
disputeSchema.index({ openedAt: -1 });
disputeSchema.index({ lastUpdated: -1 });

// Pre-save middleware to update lastUpdated
disputeSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Method to update dispute status
disputeSchema.methods.updateStatus = function(newStatus, adminId = null, notes = '') {
  this.status = newStatus;
  this.lastUpdated = new Date();
  
  if (adminId) {
    this.adminNotes.push({
      note: `Status changed to: ${newStatus}. ${notes}`.trim(),
      adminId: adminId
    });
  }
  
  // Set specific timestamps based on status
  if (newStatus === 'resolved' || newStatus === 'closed') {
    this.closedAt = new Date();
  } else if (newStatus === 'escalated') {
    this.escalatedAt = new Date();
  }
  
  return this.save();
};

// Method to add admin note
disputeSchema.methods.addAdminNote = function(note, adminId) {
  this.adminNotes.push({
    note: note,
    adminId: adminId
  });
  this.lastUpdated = new Date();
  return this.save();
};

// Method to add message
disputeSchema.methods.addMessage = function(senderId, message, isInternal = false) {
  this.messages.push({
    senderId: senderId,
    message: message,
    isInternal: isInternal
  });
  this.lastUpdated = new Date();
  return this.save();
};

// Method to assign to admin
disputeSchema.methods.assignToAdmin = function(adminId) {
  this.assignedTo = adminId;
  this.lastUpdated = new Date();
  return this.save();
};

// Method to resolve dispute
disputeSchema.methods.resolve = function(outcome, amount = null, currency = 'MATIC', notes = '', adminId) {
  this.status = 'resolved';
  this.resolution.outcome = outcome;
  this.resolution.amount = amount;
  this.resolution.currency = currency;
  this.resolution.notes = notes;
  this.resolution.resolvedBy = adminId;
  this.resolution.resolvedAt = new Date();
  this.closedAt = new Date();
  this.lastUpdated = new Date();
  
  if (adminId) {
    this.adminNotes.push({
      note: `Dispute resolved: ${outcome}. ${notes}`.trim(),
      adminId: adminId
    });
  }
  
  return this.save();
};

// Method to escalate dispute
disputeSchema.methods.escalate = function(reason, adminId = null) {
  this.status = 'escalated';
  this.escalatedAt = new Date();
  this.escalationReason = reason;
  this.lastUpdated = new Date();
  
  if (adminId) {
    this.adminNotes.push({
      note: `Dispute escalated: ${reason}`,
      adminId: adminId
    });
  }
  
  return this.save();
};

// Virtual for dispute age (days since opened)
disputeSchema.virtual('ageInDays').get(function() {
  if (!this.openedAt) return 0;
  const now = new Date();
  const diffTime = Math.abs(now - this.openedAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for is overdue (based on priority)
disputeSchema.virtual('isOverdue').get(function() {
  if (this.status === 'resolved' || this.status === 'closed') return false;
  
  const ageInDays = this.ageInDays;
  switch (this.priority) {
    case 'critical': return ageInDays > 1;
    case 'high': return ageInDays > 3;
    case 'medium': return ageInDays > 7;
    case 'low': return ageInDays > 14;
    default: return false;
  }
});

// Ensure virtual fields are included when converting to JSON
disputeSchema.set('toJSON', { virtuals: true });
disputeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Dispute', disputeSchema);
