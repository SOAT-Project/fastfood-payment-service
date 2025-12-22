import { Notification } from "../validation/handler/Notification";
import { DomainException } from "./DomainException";

export class NotificationException extends DomainException {
    constructor(message: string, error: Notification) {
        super(message, error.getErrors());
    }
}
