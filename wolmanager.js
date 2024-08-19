const JSONdb = require('simple-json-db');

const { join } = require('node:path');
const file = join(__dirname, 'db.json')

const { wake } = require('./wakeonlan');

const db = new JSONdb(file);
const ping = require('ping');

const networks = {
	fox: {
		addresses: ['192.168.1.255', '192.168.50.255']
	}
};


const Unifi = require('node-unifi');
const unifi = new Unifi.Controller({host: '192.168.1.1', port: '443', sslverify: false});
const loginData = unifi.login(process.env.UBIQUITI_LOGIN, process.env.UBIQUITI_PASSWD);

async function isClientUp(mac) {
	try {
		const clientsData = await unifi.getClientDevice(mac);

		let clientData = null;

		if(clientsData.length > 0) {
			clientData = clientsData[0];
		}

		if(!clientData) {
			return false;
		}

		//console.log(clientData);
	
		// LOGOUT
		//const logoutData = await unifi.logout();
		//console.log('logout: ' + JSON.stringify(logoutData));

		//console.log(clientData._last_reachable_by_gw);

		if(clientData.ip && clientData._last_reachable_by_gw) {
			if(Math.floor(Date.now() / 1000) - clientData._last_reachable_by_gw < 30) {
				return true;	
			} else {
				return false;
			}
		} else {
			return false;
		}
		
	} catch (error) {
		console.log('ERROR: ' + error);

	return false;
	}
}

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

function addPc(clientId, friendlyName, mac) {
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
	client.push({friendlyName: friendlyName, mac: mac});

	db.set(clientId, client);

	return {};
}

function timeoutCheckAlive(mac, timeout) {
	return new Promise((resolve, reject) => {

		let scanInterval = null;
		let aliveTimeout = null;

		aliveTimeout = setTimeout(() => {
			clearInterval(scanInterval);
		
			resolve(false);
		}, timeout);

		scanInterval = setInterval(async () => {
			if(await isClientUp(mac)) {
				clearInterval(scanInterval);
				clearTimeout(aliveTimeout);
				resolve(true);
				
			} else {
				
			}
		}, 2000);
	});
}

async function wakePc(clientMac, clientIp) {
	
	for(let i = 0; i < networks.fox.addresses.length; i++) {
		wake(networks.fox.addresses[i], clientMac);
	}

	let res = await timeoutCheckAlive(clientMac, 180000);

	return res;
}


module.exports = {
	getPcs,
	addPc,
	removePc,
	wakePc,
}