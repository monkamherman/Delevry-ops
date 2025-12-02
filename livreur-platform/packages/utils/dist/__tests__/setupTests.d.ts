import '@testing-library/jest-dom';
declare global {
    var localStorage: {
        getItem: (key: string) => string | null;
        setItem: (key: string, value: string) => void;
        removeItem: (key: string) => void;
        clear: () => void;
        key: (index: number) => string | null;
        length: number;
    };
}
