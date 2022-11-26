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
import { v4 as uuidv4 } from 'uuid';
export class Student {
    constructor() {
        this.availableMethods = [
            "Learning Material",
            "Balance Inquiry",
            "Pay Fee",
            "Status",
            "Exit"
        ];
    }
    fundsMethods() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('\n');
            const promptMethods = yield inquirer.prompt([
                {
                    type: 'list',
                    name: 'method',
                    message: chalk.bgCyan('Select one of the following method'),
                    choices: this.availableMethods.map((name) => ({ name: chalk.green(name), value: name[0] }))
                }
            ]);
            const method = this.availableMethods.find((name) => name.startsWith(promptMethods.method));
            return { key: method && method[0], method: method };
        });
    }
    LearningMaterial(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(chalk.green(`________________\n\nThis one year of course will teach you everything about ${chalk.magenta(user.course.name)}.\none onsite and two online classes every week.\nwe'll follow ${chalk.magenta(user.course.name)} books available in description.\n________________`));
        });
    }
    generateStudent() {
        return __awaiter(this, void 0, void 0, function* () {
            const promptUser = yield inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: chalk.bgCyan('Your username: ')
                }
            ]);
            const st = promptUser.name;
            const id = this.generateID();
            return {
                studentId: id,
                studentName: st,
            };
        });
    }
    generateID() {
        return uuidv4().substring(0, 5);
    }
}
