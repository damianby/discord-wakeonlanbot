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

console.log(db.JSON());

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

function wakePc(clientId, friendlyName, aliveCallback) {
	
	const pcs = getPcs(clientId);

	let clientPc = null;

	if(!friendlyName || friendlyName.length == 0) {
		if(pcs.length > 0) {
			clientPc = pcs[0];
		}
	} else {
		for(let i = 0 ; i < pcs.length ; i++) {
			if(pcs[i].friendlyName == friendlyName) {
				clientPc = pcs[i];
				break;
			}
		}
	}
	if(clientPc) {
		wake(networks.fox.address, clientPc.mac);

		let cfg = {
			timeout: 10,
		};

		let host = clientPc.ipAddress;
		setTimeout(() => {
			ping.sys.probe(host, function(isAlive, error){

				console.log(error);
				aliveCallback(isAlive, cfg.timeout);
				
				var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
				console.log(msg);
			}, cfg);
		}, 2000);

		return {client: clientPc};
	} else {
		return {error: 'PC not found'};
	}
}


module.exports = {
	getPcs,
	addPc,
	removePc,
	wakePc,
}