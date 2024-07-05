import { reactive } from "vue";

import peakData from './peaks.json';

export type LoriAttr = {
    ions: {
        name: string;
        data: boolean[];
    }[];

    neutral: {
        nh3: boolean;
        h2o: boolean;
        immonium: boolean;
        reporter: boolean;
    };

    mass: {
        type: 'Mono' | 'Average';
        tol: number;
        tolType: 'Da' | 'Th';
    };

    peak: {
        type: string;
        detect: boolean;
        label: string;
    };
}
export const loriAttr = reactive<LoriAttr>({
    ions: [
        {
            name: 'a',
            data: [false, false, false]
        },
        {
            name: 'b',
            data: [false, false, false]
        },
        {
            name: 'c',
            data: [false, false, false]
        },
        {
            name: 'x',
            data: [false, false, false]
        },
        {
            name: 'y',
            data: [false, false, false]
        },
        {
            name: 'z',
            data: [false, false, false]
        },

    ],
    neutral: {
        nh3: false,
        h2o: false,
        immonium: false,
        reporter: false,
    },
    mass: {
        type: 'Mono',
        tol: 20,
        tolType: 'Th'
    },
    peak: {
        type: 'Most Intense',
        detect: false,
        label: 'Icon'
    }

})

export type LoriData = {
    peaks: number[][];
    percent: number[][];
}

export const loriData = reactive({
    peaks1: [],
    peaks2: [],
    percent: [],
})

