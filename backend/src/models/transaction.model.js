import mongoose from "mongoose";
import {CATEGORIES} from "../lib/constants.js"
const transactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min:[0.01,"Amount must be greater than 0"]
    },
    notes: {
      type: String,
      default:"No Notes"
    },
    currency:{
        type: String,
        required: true,
        default: 'INR',
        enum: ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR', 'AUD', 'CAD', 'CHF', 'NZD'],
    },
    type:{
        type: String,
        enum: ['income', 'expense'],
        required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      required: true,
      enum:{
        values: CATEGORIES,
        message: "{VALUE} is not a valid category"
      },
      default: 'Other'
      
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: { 
        type: Boolean,
        default: false 
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
  },
  { timestamps: true }
);

// Automatically filter out soft-deleted records on any find query
const excludeDeleted = function () {
  if (!this.getFilter().isDeleted) {
    this.where({ isDeleted: false });
  }
};

transactionSchema.pre("find", excludeDeleted);
transactionSchema.pre("findOne", excludeDeleted);
transactionSchema.pre("countDocuments", excludeDeleted);
transactionSchema.pre("findOneAndUpdate", excludeDeleted);

//indexing
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, isDeleted: 1 });


// soft delete
transactionSchema.methods.softDelete = async function (deletedByUserId) {
  this.isDeleted = true;
  this.deletedBy = deletedByUserId;
  return this.save();
};

// format amount
transactionSchema.virtual("formattedAmount").get(function () {
  return `${this.currency} ${this.amount.toFixed(2)}`;
});

// format date
transactionSchema.virtual("formattedDate").get(function () {
  return this.date.toLocaleDateString();
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction; 
