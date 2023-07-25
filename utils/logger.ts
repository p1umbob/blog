import { isProd } from './env';

export const logger = (content: any) => {
    if (!isProd) {
        console.log(content);
    }
}