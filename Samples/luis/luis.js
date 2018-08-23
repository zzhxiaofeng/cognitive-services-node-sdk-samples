/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for
 * license information.
 */
'use strict';

const os = require("os");

const CognitiveServicesCredentials = require('ms-rest-azure').CognitiveServicesCredentials;
const LUISAuthoringClient = require("azure-cognitiveservices-luis-authoring");

const keyVar = 'AZURE_LUIS_KEY';

if (!process.env[keyVar]) {
    throw new Error('please set/export the following environment variable: ' + keyVar);
}

const serviceKey = process.env[keyVar];

///////////////////////////////////////////
//     Entrypoint for sample script      //
///////////////////////////////////////////

const credentials = new CognitiveServicesCredentials(serviceKey);
const endpoint = "https://westus.api.cognitive.microsoft.com"

const client = new LUISAuthoringClient(credentials, endpoint)

function sample() {
    const defaultAppName = "Contoso-" + (new Date().getTime())
    const versionId = "0.1"

    console.log("Creating App %s, version %s", defaultAppName, versionId)

    const description = "New App created with LUIS Node.js sample"
    const applicationCreateObject = {
        culture: "en-us",
        initialVersionId: versionId,
        description: description,
        name: defaultAppName,
    }

    const errorHandler = error => console.log(error)
    const appCreationPromise = client.apps.add(applicationCreateObject)
    
    appCreationPromise.then(appId => {
        console.log("Created app %s", appId)
        return appId
    })
    
    // Add information into the model
    console.log("We'll create two new entities.")
    console.log("The \"Destination\" simple entity will hold the flight destination.")
    console.log("The \"Class\" hierarchical entity will accept \"First\", \"Business\" and \"Economy\" values.")

    const destinationName = "Destination"
    appCreationPromise.then(appId => {
        const destinationCreateObject = { name: destinationName }
        return client.model.addEntity(appId, versionId, destinationCreateObject) 
    }).then(destinationId => {
        console.log("%s simple entity created with id %s", destinationName, destinationId)
    }).catch(errorHandler)

    const className = "Class"
    appCreationPromise.then(appId => {
        const hierarchicalEntity = { 
            name: className, 
            children: [ "First", "Business", "Economy" ]
        }

        return client.model.addHierarchicalEntity(appId, versionId, hierarchicalEntity)
    }).then(classId => {
        console.log("%s hierarchical entity created with id %s", className, classId)
    })
    .catch(errorHandler)
}

sample()