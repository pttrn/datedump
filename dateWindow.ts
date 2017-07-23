export interface RangePayload {
    offsetSteps: number;
    windows: DateWindow[];
    postSteps: number;
}

export type DateWindow = {
    start: Date,
    end: Date
}
