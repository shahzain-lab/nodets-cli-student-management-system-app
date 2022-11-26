/*
This project is a simple console based Student Management System.
In this project you will be learning how to add new students, how to generate a 5 digit unique studentID for each student, how to enroll students in the given courses.
Also, you will be implementing the following operations enroll, view balance, pay tuition fees, show status, etc.
The status will show all the details of the student including name, id, courses enrolled and balance.This is one of the best projects to implement the Object Oriented Programming concepts.
*/


import inquirer from 'inquirer';
import { IEnrollStudent } from './IStudent.js';
import { Management } from './Management.js';
import { Student } from './Student.js';
import figlet from 'figlet';
import gradient from 'gradient-string';
import chalk from 'chalk';

class App {
    studentStatus: IEnrollStudent = {
        studentName: '',
        studentId: '',
        course: {
            name: '',
            fee: ''
        },
        status: 'UNPAID'
    }

    constructor(
        // We can inherit these classes and use directly inside this class, but that will not quiet readable.
        public student: Student,
        public management: Management
    ) {}

    async initApp(): Promise<void> {
        const prompt = await inquirer.prompt([
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
       if(prompt.methods === 'register') {
           const user = await this.student.generateStudent();
           if(!user.studentName) return
           if(!this.studentStatus.course.name) {
            const enrolled = await this.management.getAllCourses(user.studentName);    
            if(enrolled?.course) this.generateReciept({...user, course: enrolled?.course, status: 'UNPAID'});
           }
       }
       if(prompt.methods === 'courses'){
           const enrolled = await this.management.getAllCourses(this.studentStatus.studentName);
           if(!enrolled) this.initApp()
           if(!enrolled?.studentName && enrolled?.course.name) {
            const user = await this.student.generateStudent();
            if(!user) return
            this.generateReciept({...user, course: enrolled.course, status: 'UNPAID'});
           }
       }
       if(this.studentStatus.course.name) {
           this.processMethods();
       }
    }
    
   async processMethods(): Promise<void> {
        const methods = await this.student.fundsMethods()
        switch(methods.key) {
            case "P":
            const paidUser = await this.management.billPayment(this.studentStatus);
            if(paidUser) {
                this.studentStatus = paidUser; 
            }
            this.processMethods()
            break;
            case "B":
                if(this.studentStatus.status === 'UNPAID') {
                    console.log(chalk.bgRed(`\nYou've not pay the fee yet. Payable fee $${chalk.yellow(this.studentStatus.course.fee)}\n`))
                    const userPaid = await this.management.balanceInquiry(this.studentStatus);
                    if(userPaid) {
                        this.studentStatus = userPaid;
                        this.processMethods()
                    }
                } else {
                    console.log(chalk.green(`______________\n\nYour One Year fee has : $${chalk.yellow(this.studentStatus.course.fee)}\nStatus: ${chalk.yellow(this.studentStatus.status)}\n_______________`));
                    this.processMethods()
                }  
            break;
            case "L":
            // const status = this.student.LearningMaterial(this.studentStatus);
            if(this.studentStatus.status === 'UNPAID') {
                console.log(chalk.red(`\n\nYou can\'t access the learning material without paying the fee: $${this.studentStatus.course.fee}.\n_______________`));
                const userPaid = await this.management.balanceInquiry(this.studentStatus);
                if(userPaid) {
                    this.studentStatus = userPaid;
                    this.processMethods()
                }
            } else {
                this.student.LearningMaterial(this.studentStatus);
                this.processMethods();
            }   
            break;
            case "S": 
            this.generateReciept(this.studentStatus)
            this.processMethods()
            break;
        }
    }

    generateReciept(user: IEnrollStudent): void {
        this.studentStatus = {
           studentName: user?.studentName,
           studentId: user?.studentId,
           course: user.course,
           status: user.status
        }
        console.log(chalk.bold.yellowBright(`____________\n\nStudent Name: ${chalk.greenBright(user?.studentName)}\nStudent ID: ${chalk.greenBright(user?.studentId)}\nCourse: ${chalk.greenBright(user.course.name)}\nCourse Fee: $${chalk.greenBright(user.course.fee)}\nStatus: ${chalk.greenBright(user.status)}\n______________`))
    }
    
}

figlet.text('ts-school-manager!', {
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 120,
    whitespaceBreak: true
}, ((err, data) => {
    if(err) {console.log(err)}
    console.log('\n')
    console.log(gradient.rainbow(data))
    console.log('\n')
    const app: App = new App(new Student, new Management);
    app.initApp()
}));