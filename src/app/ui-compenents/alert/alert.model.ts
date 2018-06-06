import { del } from "selenium-webdriver/http";

export class Alert {
    message: string;
    delay: number = 0;
    alertType: string = "alert-primary";

    constructor(message: string, delay?: number, alertType?: string) {
        this.message = message;

        if (delay != null) {
            this.delay = delay;
        }
        if (alertType != null) {
            this.alertType = alertType;
        }

    }

}
