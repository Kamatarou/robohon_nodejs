// Imports the Dialogflow library
const dialogflow = require('dialogflow');

// Instantiates clients
const intentsClient = new dialogflow.IntentsClient();

const projectId = 'chat001-16c14';

// The path to identify the agent that owns the intents.
const projectAgentPath = intentsClient.projectAgentPath(projectId);

async function dfl(){
const request = {
  parent: projectAgentPath,
};

console.log(projectAgentPath);

// Send the request for listing intents.
const [response] = await intentsClient.listIntents(request);
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

async function dfc(){

// The path to identify the agent that owns the created intent.
const agentPath = intentsClient.projectAgentPath(projectId);

const trainingPhrases = [];

trainingPhrasesParts.forEach(trainingPhrasesPart => {
  const part = {
    text: trainingPhrasesPart,
  };

  // Here we create a new training phrase for each provided part.
  const trainingPhrase = {
    type: 'EXAMPLE',
    parts: [part],
  };

  trainingPhrases.push(trainingPhrase);
});

const messageText = {
  text: messageTexts,
};

const message = {
  text: messageText,
};

const intent = {
  displayName: displayName,
  trainingPhrases: trainingPhrases,
  messages: [message],
};

const createIntentRequest = {
  parent: agentPath,
  intent: intent,
};

// Create the intent
const responses = await intentsClient.createIntent(createIntentRequest);
console.log(`Intent ${responses[0].name} created`);
}

//dfl();
//dfc();