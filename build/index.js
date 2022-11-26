#!/usr/bin/env node


/*
This project is a simple console based Student Management System.
In this project you will be learning how to add new students, how to generate a 5 digit unique studentID for each student, how to enroll students in the given courses.
Also, you will be implementing the following operations enroll, view balance, pay tuition fees, show status, etc.
The status will show all the details of the student including name, id, courses enrolled and balance.This is one of the best projects to implement the Object Oriented Programming concepts.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import inquirer from 'inquirer';
import { Management } from './Management.js';
import { Student } from './Student.js';
import figlet from 'figlet';
import gradient from 'gradient-string';
import chalk from 'chalk';
class App {
    constructor(
    // We can inherit these classes and use directly inside this class, but that will not quiet readable.
    student, management) {
        this.student = student;
        this.management = management;
        this.studentStatus = {
            studentName: '',
            studentId: '',
            course: {
                name: '',
                fee: ''
            },
            status: 'UNPAID'
        };
    }
    initApp() {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = yield inquirer.prompt([
                {
                    type: 'list',
                    name: 'methods',
                    message: chalk.bgCyan('Select your preference: '),
                    choices: [
                        {
                            name: chalk.cyanBright('Register as a new user'),
                            value: 'register',
                        },
                        {
                            name: chalk.cyanBright('Check available courses'),
                            value: 'courses'
                        }
                    ]
                }
            ]);
            if (prompt.methods === 'register') {
                const user = yield this.student.generateStudent();
                if (!user.studentName)
                    return;
                if (!this.studentStatus.course.name) {
                    const enrolled = yield this.management.getAllCourses(user.studentName);
                    if (enrolled === null || enrolled === void 0 ? void 0 : enrolled.course)
                        this.generateReciept(Object.assign(Object.assign({}, user), { course: enrolled === null || enrolled === void 0 ? void 0 : enrolled.course, status: 'UNPAID' }));
                }
            }
            if (prompt.methods === 'courses') {
                const enrolled = yield this.management.getAllCourses(this.studentStatus.studentName);
                if (!enrolled)
                    this.initApp();
                if (!(enrolled === null || enrolled === void 0 ? void 0 : enrolled.studentName) && (enrolled === null || enrolled === void 0 ? void 0 : enrolled.course.name)) {
                    const user = yield this.student.generateStudent();
                    if (!user)
                        return;
                    this.generateReciept(Object.assign(Object.assign({}, user), { course: enrolled.course, status: 'UNPAID' }));
                }
            }
            if (this.studentStatus.course.name) {
                this.processMethods();
            }
        });
    }
    processMethods() {
        return __awaiter(this, void 0, void 0, function* () {
            const methods = yield this.student.fundsMethods();
            switch (methods.key) {
                case "P":
                    const paidUser = yield this.management.billPayment(this.studentStatus);
                    if (paidUser) {
                        this.studentStatus = paidUser;
                    }
                    this.processMethods();
                    break;
                case "B":
                    if (this.studentStatus.status === 'UNPAID') {
                        console.log(chalk.bgRed(`\nYou've not pay the fee yet. Payable fee $${chalk.yellow(this.studentStatus.course.fee)}\n`));
                        const userPaid = yield this.management.balanceInquiry(this.studentStatus);
                        if (userPaid) {
                            this.studentStatus = userPaid;
                            this.processMethods();
                        }
                    }
                    else {
                        console.log(chalk.green(`______________\n\nYour One Year fee has : $${chalk.yellow(this.studentStatus.course.fee)}\nStatus: ${chalk.yellow(this.studentStatus.status)}\n_______________`));
                        this.processMethods();
                    }
                    break;
                case "L":
                    // const status = this.student.LearningMaterial(this.studentStatus);
                    if (this.studentStatus.status === 'UNPAID') {
                        console.log(chalk.red(`\n\nYou can\'t access the learning material without paying the fee: $${this.studentStatus.course.fee}.\n_______________`));
                        const userPaid = yield this.management.balanceInquiry(this.studentStatus);
                        if (userPaid) {
                            this.studentStatus = userPaid;
                            this.processMethods();
                        }
                    }
                    else {
                        this.student.LearningMaterial(this.studentStatus);
                        this.processMethods();
                    }
                    break;
                case "S":
                    this.generateReciept(this.studentStatus);
                    this.processMethods();
                    break;
            }
        });
    }
    generateReciept(user) {
        this.studentStatus = {
            studentName: user === null || user === void 0 ? void 0 : user.studentName,
            studentId: user === null || user === void 0 ? void 0 : user.studentId,
            course: user.course,
            status: user.status
        };
        console.log(chalk.bold.yellowBright(`____________\n\nStudent Name: ${chalk.greenBright(user === null || user === void 0 ? void 0 : user.studentName)}\nStudent ID: ${chalk.greenBright(user === null || user === void 0 ? void 0 : user.studentId)}\nCourse: ${chalk.greenBright(user.course.name)}\nCourse Fee: $${chalk.greenBright(user.course.fee)}\nStatus: ${chalk.greenBright(user.status)}\n______________`));
    }
}
figlet.text('School-Manager!', {
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 120,
    whitespaceBreak: true
}, ((err, data) => {
    if (err) {
        console.log(err);
    }
    console.log('\n');
    console.log(gradient.rainbow(data));
    console.log('\n');
    const app = new App(new Student, new Management);
    app.initApp();
}));
