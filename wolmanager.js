const JSONdb = require('simple-json-db');

const { join } = require('node:path');
const file = join(__dirname, 'db.json')

const { wake } = require('./wakeonlan');

const db = new JSONdb(file);
const ping = require('ping');

const networks = {
	fox: {
		address: '192.168.1.255'
	}
};

//console.log(db.JSON());

function isValidMACAddress(str) {

    if (str == null || str == '') {
        return false;
    }
 
    let regex = new RegExp(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})|([0-9a-fA-F]{4}.[0-9a-fA-F]{4}.[0-9a-fA-F]{4})$/);

	return regex.test(str);
}

function removePc(clientId, friendlyName) {
	if(!clientId) {
		return {error: 'Client ID is empty'};
	}

	const client = db.get(clientId) ?? [];

	for(let i = 0 ; i < client.length ; i++) {
		if(client[i].friendlyName == friendlyName) {
			client.splice(i, 1);
			db.set(clientId, client);

			return {};
		}
	}

	return {error: `${friendlyName} was not found on client list`};
}
function getPcs(clientId) {
	return db.get(clientId) ?? [];
}

function addPc(clientId, friendlyName, mac, ipAddress) {
	if(!clientId) {
		return {error: 'Client ID is empty'};
	}
	if(!friendlyName) {
		return {error: 'Missing friendly name'};
	}

	if(!isValidMACAddress(mac)) {
		return {error: 'MAC address is either invalid or empty'};
	}

	const client = db.get(clientId) ?? [];
	client.push({friendlyName: friendlyName, mac: mac, ipAddress: ipAddress});

	db.set(clientId, client);

	return {};
}

async function wakePc(clientMac, clientIp) {
	
	wake(networks.fox.address, clientMac);

	let cfg = {
		timeout: 120,
	};

	let host = clientIp;

	let res = await ping.promise.probe(host, {
			timeout: cfg.timeout,
	});

	return res.alive
}


module.exports = {
	getPcs,
	addPc,
	removePc,
	wakePc,
}