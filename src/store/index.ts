import { reactive } from "vue";

import peakData from './peaks.json';
import send from '@/store/send.json'
import { spectrumAnnotation, getSpectrum } from "@/api";

export type LoriAttr = {
    ions: {
        name: string;
        data: boolean[];
    }[];

    b: boolean,
    y: boolean,

    neutral: {
        nh3: boolean;
        h2o: boolean;
        immonium: boolean;
        reporter: boolean;
    };

    mass: {
        type: 'Mono' | 'Avg';
        tol: number;
        tolType: 'Da' | 'ppm';
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
    b: true,
    y: false,
    neutral: {
        nh3: true,
        h2o: false,
        immonium: false,
        reporter: false,
    },
    mass: {
        type: 'Mono',
        tol: 20,
        tolType: 'ppm'
    },
    peak: {
        type: 'Most Intense',
        detect: false,
        label: 'Icon'
    }

})

export type SpectrumData = {
    usi: string;
    title: string,
    peaks: {
        mz: number,
        intensity: number,
        percent: number,
    }[],
    response?: Object,
}
export type SpectrumAnnotation = {
    title: string,
    peaks: {
        mz: number,
        intensity: number,
        percent: number,
        annotation: string,
        icon?: string,
        neutral?: string,
    }[]
}
export type LoriData = {
    spectrum1: SpectrumData;
    spectrum2: SpectrumData;
    annotation1: SpectrumAnnotation;
    annotation2: SpectrumAnnotation;
};

export const loriData = reactive({
    spectrum1: {
        usi: '',
        title: '',
        peaks: []
    },
    spectrum2: {
        usi: '',
        title: '',
        peaks: []
    },
    annotation1: {
        title: '',
        peaks: []
    },
    annotation2: {
        title: '',
        peaks: []
    }
} as LoriData)

export const loadSpectrumData1 = async (usi: string) => {
    loriData.spectrum1.title = '';
    loriData.spectrum1.peaks = [];
    loriData.spectrum1.usi = usi;
    const psm = await getSpectrum(usi);

    if (!psm.intensities) {
        console.error('have not intensities')
        return;
    }
    if (psm.intensities.length != psm.masses.length) {
        console.error('intensities.length != masses.length')
        return;
    }
    let maxY = 0;
    for (let i = 0; i < psm.intensities.length; i++) {
        let y = psm.intensities[i];
        maxY = y > maxY ? y : maxY;
    }

    for (let i = 0; i < psm.intensities.length; i++) {
        const mz = psm.masses[i];
        const intensity = psm.intensities[i];
        const percent = Number(((psm.intensities[i] * 100) / maxY).toFixed(2));
        loriData.spectrum1.peaks.push({ mz, intensity, percent });
    }

    if (psm.peptideSequence) {
        loriData.spectrum1.title = psm.peptideSequence;
    }

    loriData.spectrum1.response = psm;
}

export const loadSpectrumData2 = async (usi: string) => {
    loriData.spectrum2.title = '';
    loriData.spectrum2.peaks = [];
    loriData.spectrum2.usi = usi;
    const psm = await getSpectrum(usi);

    if (!psm.intensities) {
        console.error('have not intensities')
        return;
    }
    if (psm.intensities.length != psm.masses.length) {
        console.error('intensities.length != masses.length')
        return;
    }
    // intensities y轴， masses x轴
    let maxY = 0;
    for (let i = 0; i < psm.intensities.length; i++) {
        let y = psm.intensities[i];
        maxY = y > maxY ? y : maxY;
    }

    for (let i = 0; i < psm.intensities.length; i++) {
        const mz = psm.masses[i];
        const intensity = psm.intensities[i];
        const percent = Number(((psm.intensities[i] * 100) / maxY).toFixed(2));
        loriData.spectrum2.peaks.push({ mz, intensity, percent });
    }

    if (psm.peptideSequence) {
        loriData.spectrum2.title = psm.peptideSequence;
    }

    loriData.spectrum2.response = psm;
}

export const loadSpectrumAnnotation1 = async () => {
    let params = {...send};
    params.usi = loriData.spectrum1.usi;
    params.peptide = loriData.spectrum1.title;
    params.precursor_mz = loriData.spectrum1.response?.precursorMz;
    params.precursor_charge = loriData.spectrum1.response?.precursorCharge;
    params.rt = loriData.spectrum1.response?.retentionTime || 0;
    params.fragment_tol_mass = loriAttr.mass.tol;
    params.fragment_tol_unit = loriAttr.mass.tolType;
    if(loriAttr.neutral.nh3){
        params.neutral_losses.NH3 = -17.026549;
    } else {
        delete params.neutral_losses.NH3;
    }
    if(loriAttr.neutral.h2o){
        params.neutral_losses.H2O = -18.010565;
    } else {
        delete params.neutral_losses.H2O;
    }
    params.spectrum_intensity = loriData.spectrum1.response?.intensities;
    params.spectrum_mz = loriData.spectrum1.response?.masses;

    let res = await spectrumAnnotation(params);
    if (!res.peaks || !res.peaks.length) {
        console.error('spectrumAnnotation have not peaks')
        return;
    }
    loriData.annotation1.title = res.title;
    loriData.annotation1.peaks = [];

    let maxY = 0;
    for (let i = 0; i < res.peaks.length; i++) {
        let y = res.peaks[i].intensity;
        maxY = y > maxY ? y : maxY;
    }

    res.peaks.forEach(peak => {

        const mz = peak.mz;
        const intensity = peak.intensity;
        const annotation = peak.annotation;
        const annotationParts = annotation.split('/');
        const percent = Number(((intensity * 100) / maxY).toFixed(2));
        if (annotationParts.length != 2) {
            // loriData.annotation.peaks.push({ mz, intensity, annotation,percent })
            return;
        }
        const formParts = annotationParts[0].split('-');
        const massParts = annotationParts[1].replace('ppm', '');
        if (formParts.length != 2) {
            // loriData.annotation.peaks.push({ mz, intensity, annotation,percent })
            return;
        }

        loriData.annotation1.peaks.push({ mz, intensity, annotation, percent, icon: formParts[0], neutral: formParts[1] })

    })

}

export const loadSpectrumAnnotation2 = async () => {

    let params = {...send};
    params.usi = loriData.spectrum2.usi;
    params.peptide = loriData.spectrum1.title; //loriData.spectrum2.response?.peptidoform
    params.precursor_mz = loriData.spectrum2.response?.precursorMz;
    params.precursor_charge = loriData.spectrum2.response?.precursorCharge;
    params.rt = loriData.spectrum2.response?.retentionTime || 0;
    params.fragment_tol_mass = loriAttr.mass.tol;
    params.fragment_tol_unit = loriAttr.mass.tolType; 
    if(loriAttr.neutral.nh3){
        params.neutral_losses.NH3 = -17.026549;
    } else {
        delete params.neutral_losses.NH3;
    }
    if(loriAttr.neutral.h2o){
        params.neutral_losses.H2O = -18.010565;
    } else {
        delete params.neutral_losses.H2O;
    }
    params.spectrum_intensity = loriData.spectrum2.response?.intensities;
    params.spectrum_mz = loriData.spectrum2.response?.masses;
    
    let res = await spectrumAnnotation(params);
    if (!res.peaks || !res.peaks.length) {
        console.error('spectrumAnnotation have not peaks')
        return;
    }
    loriData.annotation2.title = res.title;
    loriData.annotation2.peaks = [];

    let maxY = 0;
    for (let i = 0; i < res.peaks.length; i++) {
        let y = res.peaks[i].intensity;
        maxY = y > maxY ? y : maxY;
    }

    res.peaks.forEach(peak => {

        const mz = peak.mz;
        const intensity = peak.intensity;
        const annotation = peak.annotation;
        const annotationParts = annotation.split('/');
        const percent = Number(((intensity * 100) / maxY).toFixed(2));
        if (annotationParts.length != 2) {
            // loriData.annotation.peaks.push({ mz, intensity, annotation,percent })
            return;
        }
        const formParts = annotationParts[0].split('-');
        const massParts = annotationParts[1].replace('ppm', '');
        if (formParts.length != 2) {
            // loriData.annotation.peaks.push({ mz, intensity, annotation,percent })
            return;
        }

        loriData.annotation2.peaks.push({ mz, intensity, annotation, percent, icon: formParts[0], neutral: formParts[1] })

    })

}