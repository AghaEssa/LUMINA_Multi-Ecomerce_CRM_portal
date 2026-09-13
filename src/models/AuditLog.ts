import { Schema, model, models, type InferSchemaType } from "mongoose";

const auditLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    email: { type: String, trim: true, lowercase: true, default: "" },
    action: { type: String, required: true, index: true },
    status: { type: String, enum: ["SUCCESS", "FAILURE", "WARNING"], required: true },
    ipAddress: { type: String, default: "unknown" },
    userAgent: { type: String, default: "unknown" },
    details: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type AuditLogDocument = InferSchemaType<typeof auditLogSchema>;
export const AuditLog = (models && models.AuditLog) || model("AuditLog", auditLogSchema);
