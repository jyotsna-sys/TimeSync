import mongoose from "mongoose";

const BusySlotSchema = new mongoose.Schema(
    {
        day: {
            type: String,
            required: true,
        },
        start: {
            type: Number,
            required: true,
        },
        end: {
            type: Number,
            required: true,
        },
    },
    {_id: false}
);

const TimetableSchema = new mongoose.Schema(
    {
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true,
        },
        memberId: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        busySlots: {
            type: [BusySlotSchema],
            default: [],
        },
    },
    {timestamps: true}
);

TimetableSchema.index(
    {groupId: 1, memberId: 1},
    {unique: true}
);

export default mongoose.models.Timetable ||
    mongoose.model("Timetable",TimetableSchema);