import {RangePayload,DateWindow} from "./dateWindow";
import {WindowSize, WindowSizeNumbered} from "./windowSize";

interface WindowGeneratorCache {
    offset: number;
    windowSize: WindowSize;
    elementsMax: number;
    payload: RangePayload;
}

class WindowGenerator {
    private startDate: number;
    private endDate: number;

    private cache: WindowGeneratorCache;

    public constructor(startDate: Date, endDate: Date) {
        this.startDate = +startDate;
        this.endDate = +endDate;
    }

    public getWindow(offsetSteps: number = 0, windowSize: WindowSize, elementsMax: number): RangePayload {
        let result: RangePayload;
        if (this.isCached(offsetSteps, windowSize, elementsMax)) {
            console.log("cache hit");
            result = this.cache.payload;
        } else {
            console.log("cache miss");
            result = this.recalculate(offsetSteps, windowSize, elementsMax);
            this.updateCache(offsetSteps, windowSize, elementsMax, result);
        }
        return result;
    }

    private recalculate(offsetSteps: number = 0, windowSize: WindowSize, elementsMax: number): RangePayload {
        const stepSize = WindowSizeNumbered[windowSize];
        const blocks: DateWindow[] = [];

        const initialOffsetting = this.calculateWindowsCount(this.startDate, this.endDate, stepSize, offsetSteps);
        const windows = this.calculateWindowsCount(initialOffsetting.rightMargin, this.endDate, stepSize, elementsMax);

        for(let i = 0; i < windows.count; i++) {
            blocks.push({
                start: new Date(initialOffsetting.rightMargin + (i * stepSize)),
                end: new Date(initialOffsetting.rightMargin + (i * (stepSize + 1)))
            });
        }

        const postSteps = this.calculateWindowsCount(windows.rightMargin, this.endDate, stepSize);
        return {
            offsetSteps: initialOffsetting.count,
            windows: blocks,
            postSteps: postSteps.count
        };
    }

    private calculateWindowsCount(start: number, end: number, stepSize: number, maxCount?: number): {count: number, rightMargin: number} {
        const v = Math.floor((end - start) / stepSize);
        const steps = v > maxCount ? maxCount : v;
        return {
            count: steps,
            rightMargin: start + (steps * stepSize)
        };
    }

    private updateCache(offsetSteps: number = 0, windowSize: WindowSize, elementsMax: number, payload: RangePayload): void {
        this.cache = {
            offset: offsetSteps,
            elementsMax: elementsMax,
            windowSize: windowSize,
            payload: payload
        };
    }

    private isCached(offsetSteps: number = 0, windowSize: WindowSize, elementsMax: number): boolean {
        return this.cache && this.cache.offset === offsetSteps && this.cache.windowSize === windowSize && this.cache.elementsMax === elementsMax
    }
}

function formatDate(n: Date): string {
    return `${n.getFullYear()}-${n.getMonth()}-${n.getDay()} ${n.getHours()}:${n.getMinutes()}:${n.getSeconds()}`;
}


function go(beginDate, endDate, windowSize, maxElements, offset){

    console.log(`we begin at ${formatDate(beginDate)} to ${formatDate(endDate)}`);
    console.log(`window size: ${windowSize}`);
    console.log(`elements: ${maxElements}`);
    console.log(`offset: ${offset}`);

    const z = new WindowGenerator(beginDate, endDate);
    const f = z.getWindow(offset, windowSize, maxElements);
    for(let i = 0; i < f.offsetSteps; i++) {
        console.log(`           offset ${i}`);
    }
    f.windows.forEach(n => {
        console.log(`${formatDate(n.start)} -- ${formatDate(n.end)}`);
    });
    for(let i = 0; i < f.postSteps; i++) {
        console.log(`           postStep ${i}`);
    }
    console.log(`overall elements: ${f.offsetSteps + f.windows.length + f.postSteps}`);
}

const beginDate = new Date(2017, 1, 1, 0, 0, 0);
const endDate = new Date(2017, 1, 1, 12, 5, 0);
const windowSize = '1h';
const maxElements = 6;
const offset = 0;

go(beginDate, endDate, windowSize, maxElements, offset);
