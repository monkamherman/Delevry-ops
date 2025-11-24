import '@testing-library/jest-dom';
declare global {
    namespace NodeJS {
        interface Global {
            localStorage: {
                getItem: (key: string) => string | null;
                setItem: (key: string, value: string) => void;
                removeItem: (key: string) => void;
                clear: () => void;
            };
        }
    }
}
