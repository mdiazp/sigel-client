export class Notification {
    constructor(public ID: number,
        public UserID: number,
        public Message: string,
        public CreationTime: string,
        public Readed: boolean) {}
}
