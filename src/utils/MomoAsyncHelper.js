import MaxApi from '@momo-platform/max-api';

export default {
    getItemAsync(key: string) {
        return new Promise((resolve, reject) => {
            try {
                MaxApi.getItem(key, res => {
                    resolve(res);
                });
            } catch (error) {
                reject(error);
            }
        });
    },
    setItem(key, value) {
        MaxApi.setItem(key, value);
    },
};
