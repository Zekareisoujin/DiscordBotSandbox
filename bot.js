const commando = require('discord.js-commando');
const sqlite = require('sqlite');
const path = require('path');
const oneLine = require('common-tags').oneLine;
const EventCalendarDB = require('./src/calendar/EventCalendarDB.js');
const EventCalendar = require('./src/calendar/EventCalendar.js');

let auth
try {
    auth = require('./auth.json')
} catch (err) {
    auth = {
        token: process.env['TOKEN'],
        admins: (process.env['ADMINS'] || '').split(',')
    }
}

const client = new commando.Client({
    'owner': auth.admins,
    'commandPrefix': '.'
})

client
    .on('error', console.error)
    .on('warn', console.warn)
    .on('debug', console.log)
    .on('ready', () => {
        console.log(`Client ready; logged in as ${client.user.username}#${client.user.discriminator} (${client.user.id})`);
    })
    .on('disconnect', () => { console.warn('Disconnected!'); })
    .on('reconnecting', () => { console.warn('Reconnecting...'); })
    .on('commandError', (cmd, err) => {
        if (err instanceof commando.FriendlyError) return;
        console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
    })
    .on('commandBlocked', (msg, reason) => {
        console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
    })
    .on('commandPrefixChange', (guild, prefix) => {
        console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    })
    .on('commandStatusChange', (guild, command, enabled) => {
        console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    })
    .on('groupStatusChange', (guild, group, enabled) => {
        console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
    });

// client.setProvider(
//     sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new commando.SQLiteProvider(db))
// ).catch(console.error);

sqlite.open(path.join(__dirname, 'evtcld.sqlite3'))
    .then((db) => {
        eventCalendarDB = new EventCalendarDB(db);
        eventCalendar = new EventCalendar(eventCalendarDB);
        client.EventCalendar = eventCalendar;
        client.setProvider(new commando.SQLiteProvider(db))
    })
    .catch(console.error);

client.registry
    .registerGroup('moderation', 'Moderation')
    .registerGroup('calendar', 'Calendar')
    .registerDefaults()
    .registerCommandsIn(path.join(__dirname, 'src/commands'));

client.login(auth.token);