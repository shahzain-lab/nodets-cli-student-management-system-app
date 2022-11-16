/*
This project is a simple console based Student Management System.
In this project you will be learning how to add new students, how to generate a 5 digit unique studentID for each student, how to enroll students in the given courses.
Also, you will be implementing the following operations enroll, view balance, pay tuition fees, show status, etc.
The status will show all the details of the student including name, id, courses enrolled and balance.This is one of the best projects to implement the Object Oriented Programming concepts.
*/


import inquirer from 'inquirer';
import { IEnrollStudent } from './IStudent';
import { Management } from './Management';
import { Student } from './Student';

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
        // We can inherit these classes and use directly inside this class, but it'll not quiet readable.
        public student: Student,
        public management: Management
    ) {}

    async initApp(): Promise<void> {
        const prompt = await inquirer.prompt([
            {
                type: 'list',
                name: 'methods',
                message: 'Select your preference: ',
                choices: [
                    {
                        name: 'Register as a new user',
                        value: 'register',
                    },
                    {
                        name: 'Check available courses',
                        value: 'courses'
                    }
                ]
            }
        ]);
       if(prompt.methods === 'register') {
           const user = await this.student.generateStudent();
           if(!user) return
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
                    console.log(`You've not not the fee yet. Payable fee $${this.studentStatus.course.fee}`)
                    const userPaid = await this.management.balanceInquiry(this.studentStatus);
                    if(userPaid) {
                        this.studentStatus = userPaid;
                        this.processMethods()
                    }
                } else {
                    console.log(`______________\n\nYour One Year fee has : $${this.studentStatus.course.fee}\nStatus: ${this.studentStatus.status}\n_______________`);
                    this.processMethods()
                }  
            break;
            case "L":
            // const status = this.student.LearningMaterial(this.studentStatus);
            if(this.studentStatus.status === 'UNPAID') {
                console.log(`\n\nYou can\'t access the learning material without paying the fee: $${this.studentStatus.course.fee}.\n_______________`);
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
        console.log(`____________\n\nStudent Name: ${user?.studentName}\nStudent ID: ${user?.studentId}\nCourse: ${user.course.name}\nCourse Fee: $${user.course.fee}\nStatus: ${user.status}\n______________`)
    }
    
}

const app = new App(new Student, new Management)
app.initApp()