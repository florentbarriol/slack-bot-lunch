const { App } = require('@slack/bolt');
const RESTAURANTS = require('./datas/restaurants');
const DISLIKES = require('./datas/dislikes');
const _ = require('lodash');
//https://slack.dev/bolt/concepts#commands

const SLACK_BOT_TOKEN = 'xoxb-7027219079-962235032470-QeMbkljkr3RRIYwUoXPIrqR3';
const SLACK_SIGNING_SECRET = '849e4b07414c747434e6107eeebe1737';

const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET
});

app.command('/lunch', async ({ command, ack, say }) => {
  // Acknowledge command request
  ack();

  const missingPeople = _.lowerCase(command.text).split(',');
  const currentDislikesByPeople = _.omit(DISLIKES, missingPeople);
  const dislikes = _.union(...Object.values(currentDislikesByPeople));
  const proposals = _.shuffle(
    _.difference(Object.values(RESTAURANTS), dislikes)
  );
  const proposal =
    proposals.length > 0 ? proposals[0] : 'Erf ! Aucune proposition !';

  console.log(
    `Missing people are ${missingPeople.join(', ')}. The choice is ${proposal}.`
  );

  say(`🍽 This lunchtime, you're going to eat at ${proposal} 🎉`);
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Slack bot lunch app is running!');
})();
