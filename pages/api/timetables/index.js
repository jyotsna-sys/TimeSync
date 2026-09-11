import connectToDatabase from "../../../lib/mongodb";
import Timetable from "../../../lib/models/Timetable";

export default async function handler(req,res){
    try{
        await connectToDatabase();

        if(req.method === "GET"){
            const {groupId,memberId} = req.query;

            if(!groupId){
                return res.status(400).json({
                    error:"Group ID is required"
                });
            }

            if(memberId){
                const timetable = await Timetable.findOne({
                    groupId,
                    memberId
                });

                if(!timetable){
                    return res.status(404).json({
                        error:"Timetable not found"
                    });
                }

                return res.status(200).json({
                    busySlots: timetable.busySlots
                });
            }

            const timetables = await Timetable.find({groupId});

            return res.status(200).json({
                timetables
            });
        }

        if(req.method === "PUT"){
            const {groupId,memberId,name,busySlots} = req.body;

            if(!groupId || !memberId || !name){
                return res.status(400).json({
                    error:"Group ID, member ID and name are required"
                });
            }

            const timetable = await Timetable.findOneAndUpdate(
                {groupId,memberId},
                {
                    name,
                    busySlots: busySlots || []
                },
                {
                    new:true,
                    upsert:true
                }
            );

            return res.status(200).json({
                busySlots:timetable.busySlots
            });
        }

        return res.status(405).json({
            error:"Method not allowed"
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
            error:"Could not process timetable"
        });
    }
}