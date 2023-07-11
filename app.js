const express=require("express")

const {open}=require("sqlite")
const sqlite3=require("sqlite3")

const app=express()
app.use(express.json())
let db=null;

const initializeDBAndServer=async()={
    try{
        let db=await open({
        filename:cricketTeam.db,
        driver:sqlite3.database
})
app.listen(3001, () => {
      console.log("Server Running at http://localhost:3000/");
    });
    }
    catch(e){
        console.log(`DB Error ${e.message}`);
        process.exit(1);
    }

}
initializeDBAndServer()
const convertToDbObjectToResponse(dbObject)=>{
    return {
        playerId:dbObject.player_id,
        playerName=dbObject.player_name,
        jerseyNumber=dbObject.jersey_number,
        role=dbObject.role
        
        
    }

}

app.get("/players/",aync(request,response)=>{

    const getPlayersQuery=`
                        SELECT * FROM
                        cricket_team; 
    `
    const playersArray=await db.all(getPlayersQuery);
    response.send(playersArray.map((eachArray)=>
        convertToDbObjectToResponse(eachArray)
        )
        );
    });


})







app.post("/players/",(request,response)=>{
    const playerDetails=request.body
    const {playerName,jerseyNumber,role
        
    }=playerDetails
    const addplayerQuery=`
    INSERT INTO (playerName,jerseyNumber,role)
    VALUES(
        '${playerName}',
        ${jerseyNumber},
        '${role}'
    )
    `
    const dbResponse=await db.get(addplayerQuery)
    const playerId=dbResponse.lastId
    response.send({playerId:playerId})
    console.log("Player added to Team")
    
    
})

app.get("/players/:playerId/",async(request,response)=>{
    const {playerId}=request.params;
    const getBookQuery=`
    SELECT * FROM cricket_team
    WHERE player_id=${playerId}

    `
    const player=await db.get(getBookQuery)
    response.send(player)
    
    


})

app.put("/players/:playerId/",async(request,response)=>{
    const {playerId}=request.params;
    const playerDetails=request.body;

    const {
        playerName,
        jerseyNumber,
        role

    }=playerDetails
    const updateQuery=
            `UPDATE cricket_team 
            SET 
            player_name='${playerName}',
            jersey_number='${jerseyNumber}',
            role='${role}'
            WHERE player_id=${playerId}`

            await db.run(updateQuery);

            response.send("Player Details Updated")


    
})

app.delete("/players/:playerId/",async(request,response)=>{
    const {playerId}=request.params;
    const deltedQuery=`
    DELETE FROM
    cricket_team 
    WHERE player_id=${playerId}
    `
    await db.run(deltedQuery)
    response.send("Player Removed")
})



module.exports=app