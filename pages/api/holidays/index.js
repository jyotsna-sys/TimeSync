export default async function handler(req,res){
    if(req.method !== "GET"){
        return res.status(405).json({
            error:"Method not allowed"
        });
    }

    try{
        const country = req.query.country || "IN";
        const years = req.query.years
            ? req.query.years.split(",")
            : [new Date().getFullYear().toString()];

        const holidays = {};

        for(const year of years){
            const response = await fetch(
                "https://date.nager.at/api/v3/PublicHolidays/" +
                year +
                "/" +
                country
            );

            if(!response.ok){
                throw new Error("Could not load holidays");
            }

            const data = await response.json();

            for(const holiday of data){
                holidays[holiday.date] = holiday.name;
            }
        }

        return res.status(200).json({
            holidays
        });
    }catch(error){
        console.error(error);

        return res.status(500).json({
            error:"Could not load holidays"
        });
    }
}