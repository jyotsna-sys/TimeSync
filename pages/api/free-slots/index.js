import connectToDatabase from "../../../lib/mongodb";
import Timetable from "../../../lib/models/Timetable";
import {findRankedFreeSlots} from "../../../lib/scheduler";

export default async function handler(req,res){
    if(req.method !== "GET"){
        return res.status(405).json({
            error:"Method not allowed"
        });
    }

    try{
        await connectToDatabase();

        const {groupId} = req.query;

        if(!groupId){
            return res.status(400).json({
                error:"Group ID is required"
            });
        }

        const timetables = await Timetable.find({groupId});

        if(timetables.length === 0){
            return res.status(404).json({
                error:"No timetables found"
            });
        }

        const allBusySlots = timetables.map(
            (timetable) => timetable.busySlots
        );

        const slots = findRankedFreeSlots(allBusySlots);

        return res.status(200).json({
            slots
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
            error:"Could not calculate free slots"
        });
    }
}