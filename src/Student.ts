import inquirer from 'inquirer';
import { v4 as uuidv4 } from 'uuid';
import { IEnrollStudent, IStudent } from './IStudent';

export class Student {
    private availableMethods = [
        "Learning Material",
        "Balance Inquiry",
        "Pay Fee",
        "Status"
    ]

    async fundsMethods(): Promise<{key?: string; method?: string}> {
        console.log('\n')
        const promptMethods = await inquirer.prompt([
            {
                type: 'list',
                name: 'method',
                message: 'Select one of the following method',
                choices: this.availableMethods.map((name) => ({name, value: name[0]}))
            }
        ])
        const method = this.availableMethods.find((name) => name.startsWith(promptMethods.method));
        return {key: method&&method[0], method: method}
    }

    async LearningMaterial(user: IEnrollStudent) {
     console.log(`________________\n\nThis one year of course will teach you everything about ${user.course.name}.\none onsite and two online classes every week.\nwe'll follow ${user.course.name} books available in description.\n________________`)
    }

    async generateStudent(): Promise<IStudent> {
        const promptUser = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your username: '
            }
        ])
       
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