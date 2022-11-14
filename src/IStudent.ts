

export interface IStudent {
    studentId: string;
    studentName: string;
} 

export interface ICourse {
    name: string
    fee: string
}

export interface IEnrollStudent extends IStudent {
    course: ICourse;
    status: 'PAID' | 'UNPAID'
} 

export type Nullable<T> = T | null