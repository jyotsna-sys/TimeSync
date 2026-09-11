import mongoose from "mongoose";
const MemberSchema = new mongoose.Schema(
    {
        memberId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    {_id: false}
);

const GroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        joinCode: {
            type: String,
            required: true,
            unique: true,
        },
        members: {
            type: [MemberSchema],
            default: [],
        },
    },
    {timestamps: true}
);

export default mongoose.models.Group ||
    mongoose.model("Group",GroupSchema);