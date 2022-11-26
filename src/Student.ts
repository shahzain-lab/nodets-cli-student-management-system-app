import chalk from 'chalk';
import inquirer from 'inquirer';
import { v4 as uuidv4 } from 'uuid';
import { IEnrollStudent, IStudent } from './IStudent.js';

export class Student {
    private availableMethods = [
        "Learning Material",
        "Balance Inquiry",
        "Pay Fee",
        "Status",
        "Exit"
    ]

    async fundsMethods(): Promise<{key?: string; method?: string}> {
        console.log('\n')
        const promptMethods = await inquirer.prompt([
            {
                type: 'list',
                name: 'method',
                message: chalk.bgCyan('Select one of the following method'),
                choices: this.availableMethods.map((name) => ({name: chalk.green(name), value: name[0]}))
            }
        ])
        const method = this.availableMethods.find((name) => name.startsWith(promptMethods.method));
        return {key: method&&method[0], method: method}
    }

    async LearningMaterial(user: IEnrollStudent) {
     console.log(chalk.green(`________________\n\nThis one year of course will teach you everything about ${chalk.magenta(user.course.name)}.\none onsite and two online classes every week.\nwe'll follow ${chalk.magenta(user.course.name)} books available in description.\n________________`))
    }

    async generateStudent(): Promise<IStudent> {
        const promptUser = await inquirer.prompt([
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
         }
    }

    generateID(): string {
        return uuidv4().substring(0, 5)
    }
}