// environment variables
// process.env.NODE_ENV = 'production';const express = require('express');

const mqtt = require('mqtt');
const { StringDecoder } = require('string_decoder');
const configs = require('./config/config.js');
const service = require('./service.js')

const decoder = new StringDecoder('utf8');
let config = global.gConfig;

console.log(config);
let mqttClient = mqtt.connect({
	keepalive: config.mqtt_keepalive,
	host: config.mqtt_host,
	port: config.mqtt_port,
	clientId: config.mqtt_clientId,
	username: config.mqtt_username,
	password: config.mqtt_password,
});

mqttClient.on("connect", function () {
	console.log("Connected to broker...");
	
	mqttClient.subscribe(config.mqtt_topic, {
		qos: config.mqtt_QoS
	}, function (err, granted) {
		if (err) {
			console.log("Cannot subscribe to the topic: " + err);
		} else {
			console.log("Successfully subscribed to the topics " + JSON.stringify(granted));
		}
	});
});

mqttClient.on("reconnect", function () {
	console.log("Reconnecting to the broker...");
});

mqttClient.on("close", function () {
	console.log("Disconnected from the broker.");
});

mqttClient.on("offline", function () {
	console.log("MQTT client goes offline.");
});

mqttClient.on("error", function (err) {
	console.log("An error occured about mqtt operation: " + err);
});

mqttClient.on("message", function (topic, message, packet) {
	let parsedMessageString = "";

	try {
		// Decode byte array to string
		parsedMessageString = decoder.write(Buffer.from(message));
	  
		var rs = service.insertData(parsedMessageString);
		console.log(rs);

		console.log((new Date()).toLocaleString(), topic, parsedMessageString);
	} catch (err) {
		console.log("Error on mqtt message: " + err + " - Data: " + parsedMessageString);
	}
});