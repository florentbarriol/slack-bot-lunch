//https://slack.dev/bolt/concepts#commands
const _ = require('lodash');
const { App } = require('@slack/bolt');
const RESTAURANTS = require('./datas/restaurants');
const DISLIKES = require('./datas/dislikes');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const { SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET } = process.env;

const app = new App({
  token: SLACK_BOT_TOKEN,
  signingSecret: SLACK_SIGNING_SECRET
});

app.command('/lunch', async ({ command, ack, say }) => {
  // Acknowledge command request
  ack();

  const missingPeople = _.lowerCase(command.text).split(',');
  if (-1 === _.indexOf(missingPeople, 'virgile')) {
    say(`🍽 Virgile n’est pas là ? Tous à Piada ! :all_the_things:`);
  }

  const currentDislikesByPeople = _.omit(DISLIKES, missingPeople);
  const dislikes = _.union(...Object.values(currentDislikesByPeople));
  const pickedProposals = _.sample(
    _.difference(Object.values(RESTAURANTS), dislikes)
  );
  const proposal =
    pickedProposals ? pickedProposals : 'Erf ! Aucune proposition !';

  console.log(
    `Missing people are ${missingPeople.join(', ')}. The choice is ${proposal}.`
  );

  say(`🍽 This lunchtime, you're going to eat at ${proposal} 🎉`);
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Slack bot lunch app is running!');
})();
