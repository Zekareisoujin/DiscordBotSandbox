const commando = require('discord.js-commando');

const argTag = 'event-tag';

module.exports = class ViewSchedule extends commando.Command {
    constructor(client) {
        super(client, {
            'name': 'view-schedule',
            'aliases': [
                'view',
                'schedule',
                'sched',
                'vs'
            ],
            'group': 'calendar',
            'memberName': 'view-schedule',
            'description': 'View all upcoming & active events',
            'example': [
                'view event',
                'sched mp',
            ],
            'args': [
                {
                    'key': argTag,
                    'label': 'tag',
                    'prompt': 'Specify an event tag.',
                    'type': 'string'
                }
            ]
        });
    }

    hasPermission(msg) {
        return msg.guild ? true : false;
    }

    async run(msg, args) {
        const EventCalendar = this.client.EventCalendar;
        return msg.channel.send(await EventCalendar.listActiveEvents(
            args[argTag],
            msg.guild.id
        ));
    }
}