import connectToDatabase from "../../../lib/mongodb";
import Group from "../../../lib/models/Group";
import Timetable from "../../../lib/models/Timetable";

function createJoinCode(){
    return Math.random().toString(36).substring(2,8).toUpperCase();
}

export default async function handler(req,res){
    try{
        await connectToDatabase();

        if(req.method === "POST"){
            const {name,groupName} = req.body;

            if(!name || !groupName){
                return res.status(400).json({
                    error:"Name and group name are required"
                });
            }

            const memberId = Math.random().toString(36).substring(2,10);

            let joinCode = createJoinCode();

            while(await Group.findOne({joinCode})){
                joinCode = createJoinCode();
            }

            const group = await Group.create({
                name: groupName,
                joinCode,
                members: [
                    {
                        memberId,
                        name
                    }
                ]
            });

            await Timetable.create({
                groupId: group._id,
                memberId,
                name,
                busySlots: []
            });

            return res.status(201).json({
                groupId: group._id.toString(),
                joinCode,
                memberId
            });
        }

        if(req.method === "GET"){
            const {groupId} = req.query;

            if(!groupId){
                return res.status(400).json({
                    error:"Group ID is required"
                });
            }

            const group = await Group.findById(groupId);

            if(!group){
                return res.status(404).json({
                    error:"Group not found"
                });
            }

            return res.status(200).json({
                groupId: group._id.toString(),
                name: group.name,
                joinCode: group.joinCode,
                members: group.members
            });
        }

        return res.status(405).json({
            error:"Method not allowed"
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
            error:"Could not process group"
        });
    }
}