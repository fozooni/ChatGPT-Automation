import fs from "fs";
import cron from "node-cron";
import {PlaywrightFluent} from "playwright-fluent";

// Chalk
import chalk from 'chalk';
chalk.level = 1;
// Constants
import {COOKIES_FILE_PATH, OPEN_AI_CHAT_URL} from "./utils/constants";
// Questions Array
import {questions} from "./questions";

export class OpenAIAutomationChatBot {
	questionId: number;
	questionsArr: string[];
	playwrightFluent: PlaywrightFluent;

	constructor() {
		this.questionId = 0;
		this.questionsArr = questions;
		this.playwrightFluent = new PlaywrightFluent();
	}

	// Get cookies from cookies.json file
	parseCookies() {
		const cookies = fs.readFileSync(COOKIES_FILE_PATH, "utf8");
		return JSON.parse(cookies);
	}

	// Initialize Playwright Fluent Browser
	async initialChromiumBrowser(cookies: any) {
		await this.playwrightFluent
			.withBrowser("chromium")
			.withOptions({headless: false})
			.withStorageState({cookies, origins: []})
			.withCursor()
			.navigateTo(OPEN_AI_CHAT_URL)
			.wait(5000);
	}

	// Schedule questions via CronJobs
	questionsSchedule() {
		cron.schedule("*/5 * * * *", async () => {
			if (this.questionId < this.questionsArr.length) {
				await this.askingScheduledQuestions(this.questionsArr[this.questionId]);
				this.questionId++;
			} else {
				console.log((chalk.yellow('All your questions have been asked! Please stop the bot (using Crtl + C on Windows or Control + C on Mac) and update the list of questions at src/questions.ts.')));
			}
		});
	}

	// Ask question separately with delay
	async askingScheduledQuestions(question: string) {
		await this.playwrightFluent
			.selector("div#__next > div > div > div > div > div > nav > div > a")
			.click()
			.then(async () => {
				await this.playwrightFluent
					.click("#prompt-textarea")
					.typeText(question)
					.wait(3000)
					.click(
						"div#__next > div > div:nth-of-type(2) > main > div > div:nth-of-type(2) > form > div > div:nth-of-type(2) > div > button"
					)
					.wait(10000);
				console.log((chalk.green(`Question No.${this.questionId + 1} asked successfully!`, '\n', 'Question: ', question)));
			});
	}

	// StartBot functionality
	async startBot() {
		const cookies = this.parseCookies();
		await this.initialChromiumBrowser(cookies);
		this.questionsSchedule();
	}
}