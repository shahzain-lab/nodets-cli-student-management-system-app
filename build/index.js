"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = __importDefault(require("inquirer"));
const Management_1 = require("./Management");
const Student_1 = require("./Student");
class App {
    constructor(student, management) {
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
            const prompt = yield inquirer_1.default.prompt([
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
            if (prompt.methods === 'register') {
                const user = yield this.student.generateStudent();
                if (!user)
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
                        console.log(`You've not not the fee yet. Payable fee $${this.studentStatus.course.fee}`);
                        const userPaid = yield this.management.balanceInquiry(this.studentStatus);
                        if (userPaid) {
                            this.studentStatus = userPaid;
                            this.processMethods();
                        }
                    }
                    else {
                        console.log(`______________\n\nYour One Year fee has : $${this.studentStatus.course.fee}\nStatus: ${this.studentStatus.status}\n_______________`);
                        this.processMethods();
                    }
                    break;
                case "L":
                    if (this.studentStatus.status === 'UNPAID') {
                        console.log(`\n\nYou can\'t access the learning material without paying the fee: $${this.studentStatus.course.fee}.\n_______________`);
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
        console.log(`____________\n\nStudent Name: ${user === null || user === void 0 ? void 0 : user.studentName}\nStudent ID: ${user === null || user === void 0 ? void 0 : user.studentId}\nCourse: ${user.course.name}\nCourse Fee: $${user.course.fee}\nStatus: ${user.status}\n______________`);
    }
}
const app = new App(new Student_1.Student, new Management_1.Management);
app.initApp();
//# sourceMappingURL=index.js.map