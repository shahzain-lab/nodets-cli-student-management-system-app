import inquirer from 'inquirer';
import { IEnrollStudent, Nullable } from './IStudent';


export class Management {
   private default_wallet_address = "0xk99_9nNFJk_4mBJKHRI_ljir39mN_jeOJNOO"
   private availableCourse = [
        { name: 'Metaverse', fee: '2500' },
        { name: 'Web 3', fee: '1700' },
        { name: 'IOT', fee: '1350' },
        { name: 'AI', fee: '1200' },
        { name: 'Quantum Computing', fee: '2100' }, 
        { name: 'Cloud Computing', fee: '1550' },
    ]
    
    async getAllCourses(name: string): Promise<Nullable<Omit<IEnrollStudent, 'studentId'>>> {
        console.log('\n')
        this.availableCourse.map((course, i) => {
            console.log(`________${i+1}_________\nName: ${course.name}\nFee: $${course.fee}`)
        })
        console.log('\n')
        const promptEnroll = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'enroll',
                message: 'Do you want to enroll in any program'
            }
        ])
        if(promptEnroll.enroll){
            return this.getEnroll(name);
        }else {
            return null
        }
    }

    async billPayment(user: IEnrollStudent): Promise<IEnrollStudent | undefined> {
        if(user.status === 'UNPAID') {
            console.log(`\nyou're going to pay $${user.course.fee}\n`)
            await inquirer.prompt([
                {
                    type: 'rawlist',
                    name: 'method',
                    message: 'We currently support these platforms.',
                    default: 'Binance',
                    choices: [
                        'Easypaisa',
                          'Binance',
                          'UBL Digital',
                          'Naya Pay'
                        ],
                    },
                ])
                console.log('\n')
                console.log('\n')
                
                await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'address',
                        message: 'Enter your wallet address',
                        default: this.default_wallet_address
                    }
                ])
                // if(amountPrompt.address) {
                console.log('_____________________\n\nTransaction is under process. we\'ll share details with you shortly. Thanks\n_____________________');
                // }
                return {...user, status: 'PAID'}
        }else {
            console.log(`____________\n\nYou already paid  $${user.course.fee}\n____________`);
            return;
        }
    }

    async balanceInquiry(user: IEnrollStudent): Promise<IEnrollStudent | undefined> {
       const promptBalance = await inquirer.prompt([
           {
               type: 'confirm',
               name: 'bill',
               message: 'Do you want to pay the bill? '
           }
       ])
       if(promptBalance.bill){
           const userPaid = await this.billPayment(user);
           return userPaid
       }else {
           return;
       } 
    }

    async getEnroll(studentName = ''): Promise<Nullable<Omit<IEnrollStudent, 'studentId'>>> {
        const promptCourses = await inquirer.prompt([
            {
                type: 'list',
                name: 'course',
                message: 'which course you want to enroll in? ',
                choices: this.availableCourse.map((course) => ({ name: course.name, value: course.name[0]}))
            },
        ])
        const course = this.availableCourse.find((course) => course.name.startsWith(promptCourses.course));
        if(!course?.name) return null
        return { studentName, course: course, status: 'UNPAID' }
    }
}
