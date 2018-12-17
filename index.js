var builder = require('botbuilder');
var express=require('express')
var mqtt=require('mqtt')

var server=express()
var connector = new builder.ChatConnector();

var client  = mqtt.connect('')

server.post('/api/messages',connector.listen())

var inMemoryStorage = new builder.MemoryBotStorage();

// This is a reservation bot that has a menu of offerings.
// var bot = new builder.UniversalBot(connector, [
//     function(session){
//         session.send("Welcome to Contoso Hotel and Resort.");
//         session.beginDialog("mainMenu");  
//     },
//     (session)=>{
//         session.send("its me")
//         session.beginDialog("me")
//     }

// ]).set('storage', inMemoryStorage); // Register in-memory storage 

// Display the main menu and start a new request depending on user input.
// menuItems={
//     "bread":20,
//     "grapes":30
// }
// bot.dialog("mainMenu", [
//     function(session){
//         builder.Prompts.choice(session, "Main Menu:", menuItems);
//     },
//     function(session, results){
//         if(results.response){
//             session.beginDialog(menuItems[results.response.entity].item);
//         }
//     }
// ])
// .triggerAction({
//     // The user can request this at any time.
//     // Once triggered, it clears the stack and prompts the main menu again.
//     matches: /^main menu$/i,
//     confirmPrompt: "This will cancel your request. Are you sure?"
// }).reloadAction( "restartOrderDinner", "Ok. Let's start over.",
// {
//     matches: /^start over$/i
// }
// )


var bot= new builder.UniversalBot(connector,[

    (session)=>{
        session.beginDialog('light')
    },
    (session)=>{
        session.endDialog('bye')
    }
    
])

bot.dialog('light',[
    (session)=>{
        builder.Prompts.text(session,'swith')

    },

    (session,results,next)=>{
        if(results.response){
        client.on('connect', function () {
            client.subscribe('selfpot')
            client.publish('selfpopt', results.response)
          })
        }
       session.send(results.response)
      
    }

    
]).triggerAction({

        matches: /^switch$/i,
        confirmPrompt: "This will cancel your request. Are you sure?"
    }).reloadAction( "again", "Ok. Let's start over.",
    {
        matches: /^start over$/i
    }
    )

bot.dialog('bye',[
    function(session){
        session.send('bye')
    }
    
]).triggerAction({

    matches: /^bye$/i,
    confirmPrompt: "This will cancel your request. Are you sure?"
})






server.listen(3979,()=>{
    console.log('started')
})