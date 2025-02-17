export class FirebaseError extends Error {
    constructor(
        message: string,
        public code: string,
    ) {
        super(message)
        this.name = "FirebaseError"
    }
}

export class FirebaseNetworkError extends FirebaseError {
    constructor(message: string) {
        super(message, "network-error")
        this.name = "FirebaseNetworkError"
    }
}

export class FirebaseAuthError extends FirebaseError {
    constructor(message: string, code: string) {
        super(message, code)
        this.name = "FirebaseAuthError"
    }
}