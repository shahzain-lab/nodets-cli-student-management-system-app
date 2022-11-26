var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from 'chalk';
import inquirer from 'inquirer';
export class Management {
    constructor() {
        this.default_wallet_address = "0xk99_9nNFJk_4mBJKHRI_ljir39mN_jeOJNOO";
        this.availableCourse = [
            { name: 'Metaverse', fee: '2500' },
            { name: 'Web 3', fee: '1700' },
            { name: 'IOT', fee: '1350' },
            { name: 'AI', fee: '1200' },
            { name: 'Quantum Computing', fee: '2100' },
            { name: 'Cloud Computing', fee: '1550' },
        ];
    }
    getAllCourses(name) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('\n');
            this.availableCourse.map((course, i) => {
                console.log(chalk.yellowBright(`________${chalk.greenBright(i + 1)}_________\nName: ${chalk.greenBright(course.name)}\nFee: $${chalk.greenBright(course.fee)}`));
            });
            console.log('\n');
            const promptEnroll = yield inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'enroll',
                    message: chalk.bgCyan('Do you want to enroll in any program')
                }
            ]);
            if (promptEnroll.enroll) {
                return this.getEnroll(name);
            }
            else {
                return null;
            }
        });
    }
    billPayment(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.status === 'UNPAID') {
                console.log(chalk.bgGreen(`\nyou're going to pay ${chalk.bgMagenta('$' + user.course.fee)}\n`));
                yield inquirer.prompt([
                    {
                        type: 'rawlist',
                        name: 'method',
                        message: chalk.bgMagenta('We currently support these platforms.'),
                        default: 'Binance',
                        choices: [
                            chalk.yellow('Easypaisa'),
                            chalk.yellow('Binance'),
                            chalk.yellow('UBL Digital'),
                            chalk.yellow('Naya Pay')
                        ],
                    },
                ]);
                console.log('\n');
                console.log('\n');
                yield inquirer.prompt([
                    {
                        type: 'input',
                        name: 'address',
                        message: 'Enter your wallet address',
                        default: chalk.magenta(this.default_wallet_address)
                    }
                ]);
                // if(amountPrompt.address) {
                console.log(chalk.yellow('_____________________\n\nTransaction is under process. we\'ll share details with you shortly. Thanks\n_____________________'));
                // }
                return Object.assign(Object.assign({}, user), { status: 'PAID' });
            }
            else {
                console.log(chalk.magenta(`____________\n\nYou already paid  ${chalk.cyan('$' + user.course.fee)}\n____________`));
                return;
            }
        });
    }
    balanceInquiry(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const promptBalance = yield inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'bill',
                    message: chalk.bgCyan('Do you want to pay the bill? ')
                }
            ]);
            if (promptBalance.bill) {
                const userPaid = yield this.billPayment(user);
                return userPaid;
            }
            else {
                return;
            }
        });
    }
    getEnroll(studentName = '') {
        return __awaiter(this, void 0, void 0, function* () {
            const promptCourses = yield inquirer.prompt([
                {
                    type: 'list',
                    name: 'course',
                    message: 'which course you want to enroll in? ',
                    choices: this.availableCourse.map((course) => ({ name: chalk.green(course.name), value: course.name[0] }))
                },
            ]);
            const course = this.availableCourse.find((course) => course.name.startsWith(promptCourses.course));
            if (!(course === null || course === void 0 ? void 0 : course.name))
                return null;
            return { studentName, course: course, status: 'UNPAID' };
        });
    }
}
