const commando = require('discord.js-commando');
const RichEmbed = require('discord.js').RichEmbed;

const argKey = 'user-info';

module.exports = class UserCommand extends commando.Command {
    constructor(client) {
        super(client, {
            'name': 'user-info',
            'aliases': [
                'user',
                'u'
            ],
            'group': 'test',
            'memberName': 'user-info',
            'description': 'Display user info.',
            'example': [
                'user Nad#4039',
                'u Nad'
            ],
            'args': [
                {
                    'key': argKey,
                    'label': 'user',
                    'prompt': 'Specify an user.',
                    'type': 'member',
                }
            ]
        });
    }

    async run(msg, args) {
        const member = args[argKey];
        const user = member.user;
        const embed = new RichEmbed()
            .setAuthor(user.username)
            .setThumbnail(user.avatarURL)
            .addField('ID', user.id)
            .addField('Nickname', member.nickname ? member.nickname : 'None')
            .addField('Register date', user.createdAt)
            .addField('Join date', member.joinedAt);
        
        return msg.channel.send({embed});
    }
}