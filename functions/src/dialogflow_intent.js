// Imports the Dialogflow library
const dialogflow = require('dialogflow');

// Instantiates clients
const intentsClient = new dialogflow.IntentsClient();

const projectId = 'chat001-16c14';

const intentId = "b55b2c95-537c-4270-8a1e-174342dc3e3a";

const uuid = require('uuid');

// The path to identify the agent that owns the intents.
const projectAgentPath = intentsClient.projectAgentPath(projectId);

async function dfl(){
const request = {
  parent: projectAgentPath,
};

console.log(projectAgentPath);

// Send the request for listing intents.
const [response] = await intentsClient.listIntents(request);
console.log(response);
response.forEach(intent => {
  console.log('====================');
  console.log(`Intent name: ${intent.name}`);
  console.log(`Intent display name: ${intent.displayName}`);
  console.log(`Action: ${intent.action}`);
  console.log(`Root folowup intent: ${intent.rootFollowupIntentName}`);
  console.log(`Parent followup intent: ${intent.parentFollowupIntentName}`);

  console.log('Input contexts:');
  intent.inputContextNames.forEach(inputContextName => {
    console.log(`\tName: ${inputContextName}`);
  });

  console.log('Output contexts:');
  intent.outputContexts.forEach(outputContext => {
    console.log(`\tName: ${outputContext.name}`);
  });
});
}

async function dfu(){

const name = "projects/" + projectId + "/agent/intents/" + intentId;

// The path to identify the agent that owns the created intent.
const agentPath = intentsClient.projectAgentPath(projectId);

// Here we create a new training phrase for each provided part.
const trainingPhrase = {
  type: 'EXAMPLE',
  parts: [{
    text : "さんぷる"
  },
  {
    text : "ほげほげ"
  }]
};

const message = {
  text : {
    text : [ "うーばー" , "ばー"]
  }
}

const intent = {
  displayName: "intent1",
  trainingPhrases: [trainingPhrase],
  messages : [message]
};

const updateIntentRequest = {
  parent: agentPath,
  languageCode : "ja",
  intent: intent,
};

const formattedName = intentsClient.intentPath(projectId,intentId);

// Load the intent
const Intents = await intentsClient.getIntent({
  name : formattedName,
  languageCode : "ja",
  intentView : "INTENT_VIEW_FULL"
});
console.log(Intents);
console.log(`Intent ${Intents[0].name} geted`);

Intents.forEach(intent => {
  if(intent){
    console.log(`Intent name: ${intent.name}`);
    console.log(`Intent display name: ${intent.displayName}`);
    console.log("Intent Traning Phrase ->");
    intent.trainingPhrases.forEach(trainingPhrase => {
      //console.log(`\tTraning: ${trainingPhrase}`);
      trainingPhrase.parts.forEach(part =>{
        if(part){
          console.log("part" + part.text);
        }
      });
    });
    console.log("Intent messages ->");
    intent.messages.forEach(message => {
      console.log(`\tTraning: ${message}`);
    });

  }
});

// Create the intent
/*
const responses = await intentsClient.batchUpdateIntents(updateIntentRequest);
console.log(`Intent ${responses[0].name} updated`);*/
}

//dfl();
dfu();