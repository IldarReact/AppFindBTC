import WebAppService from "@/shared/api/telegram/WebAppService"

type LogArgs = (string | number | boolean | object | null | undefined)[]

export const logger = {
    error: (message: string, ...args: LogArgs) => {
        const formattedMessage = `Error: ${message}`
        console.error(formattedMessage, ...args)

        WebAppService.getInstance().showAlert(`Error: ${formattedMessage}`)
    },
    warn: (message: string, ...args: LogArgs) => {
        const formattedMessage = `Warning: ${message}`
        console.warn(formattedMessage, ...args)
    },
    info: (message: string, ...args: LogArgs) => {
        const formattedMessage = `Info: ${message}`
        console.info(formattedMessage, ...args)
    },
    debug: (message: string, ...args: LogArgs) => {
        const formattedMessage = `Debug: ${message}`
        console.debug(formattedMessage, ...args)
    },
}