interface IMail {
    email: string;
    body: string;
    subject: string;
    user: any;
    template: string;
    otp?: string;
}

export default IMail;
