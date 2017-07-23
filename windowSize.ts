export type WindowSize = '1h' | '12h' | '24h' | '1d' | '1w';

const hour = 1000 * 60 * 60;

export const WindowSizeNumbered: { [s: string]: number } = {
    '1h': hour,
    '12h': hour * 12,
    '24h': hour * 24,
    '1d': hour * 24,
    '1w': hour * 24 * 7
};
