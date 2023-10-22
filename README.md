# OpenAI ChatGPT Automation

This robot helps you to ask your questions automatically from OpenAI ChatGPT.

Due to the increasing demand for the use of artificial intelligence in development, this robot has been developed.

### OpenAI ChatGPT supported versions:

- ChatGPT-3.5
- ChatGPT-4

### Prerequisites:

- Node.js +16
- Node package managements (NPM / Yarn)

## Installation:

1. Install dependencies: `npm install` / `yarn install`
2. Install Playwright test Chromium browser with: `npx playwright install`
3. Install EditThisCookie extension for your favorite browsers:
[Chrome](https://chrome.google.com/webstore/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg) /
[Firefox](https://addons.mozilla.org/en-US/firefox/addon/edithiscookie/)
4. Go to the [OpenAI Chat](https://chat.openai.com/) website and login to your account.
5. Now open the EditThisCookie extension and export your cookies from the top navigation bar in extension panel. (It will copy all of your cookies into clipboard automatically)
6. Open cookies.json file in `./src/cookies.json` and paste cookies object here. (Note: Please change all words `sameSite` to `SameSite`. The first letter should be capital letter, otherwise the bot will not work)
7. Open `./src/questions.ts` and arrange your questions in an array.
8. Run `npm run dev`
9. After the Chromium browser is running, and it goes to OpenAI Chat page, you have to click the 'OK' button for the first time.

### Some tips about writing questions:

1. You should ask the questions clearly to get the best answer. 🔦
2. You can use prompts. Just make sure that the desired prompt is written in one. 👾
3. Use \n for asking multiple questions in the one question item
4. Don't use '\n' between code-block tag

✅ ```php $a = 10; echo $a; ```

❌ ```php $a = 10; \n echo $a; ``` 

### Note:

By default, your question will be asked every 5 minutes, but you can implement the limit of cronjob you need, Open the `./src/OpenAI.ts` file and edit the highlighted section:

(Please note that for ChatGPT-4 version, it is recommended to send a question every 5 minutes to easily bypass the limit of 50 questions per 3 hours.)

```typescript
questionsSchedule()
{
    // Change '*/5 * * * *' to everything you want
    cron.schedule("*/5 * * * *", async () => {
        if (this.questionId < this.questionsArr.length) {
            await this.askingScheduledQuestions(this.questionsArr[this.questionId]);
            this.questionId++;
        } else {
            console.log((chalk.yellow('All your questions have been asked! Please stop the bot (using Crtl + C on Windows or Control + C on Mac) and update the list of questions at src/questions.ts.')));
        }
    });
}
```