export class ValidationFailure extends Error {
    constructor(message: string, public reason: string) {
        super(message);
        this.name = 'ValidationFailure';
    }
}
