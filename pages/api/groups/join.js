import connectToDatabase from "../../../lib/mongodb";
import Group from "../../../lib/models/Group";
import Timetable from "../../../lib/models/Timetable";

export default async function handler(req,res){
    if(req.method !== "POST"){
        return res.status(405).json({error:"Method not allowed"});
    }

    try{
        await connectToDatabase();

        const {name,joinCode} = req.body;

        if(!name || !joinCode){
            return res.status(400).json({
                error:"Name and join code are required"
            });
        }

        const group = await Group.findOne({
            joinCode: joinCode.toUpperCase()
        });

        if(!group){
            return res.status(404).json({
                error:"Group not found"
            });
        }

        const memberId = Math.random().toString(36).substring(2,10);

        group.members.push({
            memberId,
            name
        });

        await group.save();

        await Timetable.create({
            groupId: group._id,
            memberId,
            name,
            busySlots: []
        });

        return res.status(201).json({
            groupId: group._id.toString(),
            joinCode: group.joinCode,
            memberId
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
            error:"Could not join group"
        });
    }
}