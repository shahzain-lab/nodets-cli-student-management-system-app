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
exports.Student = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const uuid_1 = require("uuid");
class Student {
    constructor() {
        this.availableMethods = [
            "Learning Material",
            "Balance Inquiry",
            "Pay Fee",
            "Status"
        ];
    }
    fundsMethods() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('\n');
            const promptMethods = yield inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'method',
                    message: 'Select one of the following method',
                    choices: this.availableMethods.map((name) => ({ name, value: name[0] }))
                }
            ]);
            const method = this.availableMethods.find((name) => name.startsWith(promptMethods.method));
            return { key: method && method[0], method: method };
        });
    }
    LearningMaterial(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`________________\n\nThis one year of course will teach you everything about ${user.course.name}.\none onsite and two online classes every week.\nwe'll follow ${user.course.name} books available in description.\n________________`);
        });
    }
    generateStudent() {
        return __awaiter(this, void 0, void 0, function* () {
            const promptUser = yield inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Your username: '
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
        return (0, uuid_1.v4)().substring(0, 5);
    }
}
exports.Student = Student;
//# sourceMappingURL=Student.js.map