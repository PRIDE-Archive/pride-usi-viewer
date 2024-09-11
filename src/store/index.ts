import { reactive } from "vue";

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
    y: true,
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

export type Annotation = {
    type: 'y' | 'b',
    sequence: number,
    label: string,
}
export type SpectrumAnnotation = {
    title: string,
    peaks: {
        mz: number,
        intensity: number,
        percent: number,
        annotation: string,
        label?: string,
        mass: number,
        type: string,
        neutral?: string,
    }[],
    annotations: Annotation[]
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
        peaks: [],
        annotations: []
    },
    annotation2: {
        title: '',
        peaks: [],
        annotations: []
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
    let maxIntensity = 0;
    for (let i = 0; i < psm.intensities.length; i++) {
        let y = psm.intensities[i];
        maxIntensity = y > maxIntensity ? y : maxIntensity;
    }

    for (let i = 0; i < psm.intensities.length; i++) {
        const mz = psm.masses[i];
        const intensity = psm.intensities[i];
        const percent = Number(((psm.intensities[i] * 100) / maxIntensity).toFixed(2));
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
    // intensities y， masses x
    let maxIntensity = 0;
    for (let i = 0; i < psm.intensities.length; i++) {
        let y = psm.intensities[i];
        maxIntensity = y > maxIntensity ? y : maxIntensity;
    }

    for (let i = 0; i < psm.intensities.length; i++) {
        const mz = psm.masses[i];
        const intensity = psm.intensities[i];
        const percent = Number(((psm.intensities[i] * 100) / maxIntensity).toFixed(2));
        loriData.spectrum2.peaks.push({ mz, intensity, percent });
    }

    if (psm.peptideSequence) {
        loriData.spectrum2.title = psm.peptideSequence;
    }

    loriData.spectrum2.response = psm;
}

export const loadSpectrumAnnotation1 = async () => {
    let params = {
        "method": "spectrum_utils",
        "usi": "",
        "peptide": "",
        "precursor_mz": 0,
        "precursor_charge": 0,
        "rt": 0,
        "fragment_tol_mass": 0,
        "fragment_tol_unit": "",
        "ions_type": "",
        "neutral_losses": {
            "NH3": -17.026549,
            "H2O": -18.010565
        },
        "spectrum_intensity": [],
        "spectrum_mz": [],
        "annotation": {}
    };
    params.usi = loriData.spectrum1.usi;
    params.peptide = loriData.spectrum1.title; //loriData.spectrum1.response?.peptidoform loriData.spectrum1.title
    params.precursor_mz = loriData.spectrum1.response?.precursorMz;
    params.precursor_charge = loriData.spectrum1.response?.precursorCharge;
    params.rt = loriData.spectrum1.response?.retentionTime || 0;
    params.fragment_tol_mass = loriAttr.mass.tol;
    params.fragment_tol_unit = loriAttr.mass.tolType;
    if (loriAttr.neutral.nh3) {
        params.neutral_losses.NH3 = -17.026549;
    } else {
        delete params.neutral_losses.NH3;
    }
    if (loriAttr.neutral.h2o) {
        params.neutral_losses.H2O = -18.010565;
    } else {
        delete params.neutral_losses.H2O;
    }
    params.spectrum_intensity = loriData.spectrum1.response?.intensities;
    params.spectrum_mz = loriData.spectrum1.response?.masses;

    params.ions_type = "";
    if (loriAttr.b) {
        params.ions_type += "b";
    }
    if (loriAttr.y) {
        params.ions_type += "y";
    }


    let res = await spectrumAnnotation(params);
    if (!res.peaks || !res.peaks.length) {
        console.error('spectrumAnnotation have not peaks')
        return;
    }
    loriData.annotation1.title = res.title;
    loriData.annotation1.peaks = [];
    loriData.annotation1.annotations = [];
    let maxIntensity = 0;
    for (let i = 0; i < res.peaks.length; i++) {
        let y = res.peaks[i].intensity;
        maxIntensity = y > maxIntensity ? y : maxIntensity;
    }

    // res.peaks[0].annotation = 'y1-H2O/1.8ppm';
    // res.peaks[10].annotation = 'y2-H2O/2.8ppm';
    // // res.peaks[30].annotation = 'y3-H2O/0.8ppm';
    // res.peaks[40].annotation = 'y4-H2O/3.8ppm';
    // res.peaks[50].annotation = 'y5-H2O/4.8ppm';
    // res.peaks[1].annotation = 'b1-H2O/5.8ppm';
    // res.peaks[11].annotation = 'b2-H2O/6.8ppm';
    // // res.peaks[31].annotation = 'b3-H2O/0.8ppm';
    // res.peaks[41].annotation = 'b4-H2O/7.8ppm';
    // res.peaks[51].annotation = 'b5-H2O/8.8ppm';
    res.peaks.forEach(peak => {

        const mz = peak.mz;
        const intensity = peak.intensity;
        const annotation = peak.annotation;
        if (!annotation || !annotation.includes('/')) {
            return;
        }
        const annotationParts = annotation.split('/');
        if (annotationParts.length != 2) {
            return;
        }

        const formParts = annotationParts[0].split('-');
        const icon = formParts[0];
        const neutral = formParts.length == 2 ? formParts[1] : '';
        const mass = annotationParts[1].replace(/[^0-9.]/g, '');

        const percent = Number(((intensity * 100) / maxIntensity).toFixed(2));

        const regex = /^([by])(\d+)$/;
        const match = icon.match(regex);
        if (!match) {
            return;
        }
        const type = match[1];
        const sequence = match[2];
        if (loriData.annotation1.annotations.find(item => item.type == type && item.sequence == sequence)) {
            return;
        }
        loriData.annotation1.annotations.push({ type: type, sequence: sequence, label: match[0] });

        loriData.annotation1.peaks.push({ mz, intensity, annotation, percent, type, label: icon, neutral: neutral, mass: mass })


    })

    console.log('loriData.annotation1.annotations', loriData.annotation1);

}

export const loadSpectrumAnnotation2 = async () => {

    let params = {
        "method": "spectrum_utils",
        "usi": "",
        "peptide": "",
        "precursor_mz": 0,
        "precursor_charge": 0,
        "rt": 0,
        "fragment_tol_mass": 0,
        "fragment_tol_unit": "",
        "ions_type": "",
        "neutral_losses": {
            "NH3": -17.026549,
            "H2O": -18.010565
        },
        "spectrum_intensity": [],
        "spectrum_mz": [],
        "annotation": {}
    };
    params.usi = loriData.spectrum2.usi;
    params.peptide = loriData.spectrum2.title; //loriData.spectrum2.response?.peptidoform loriData.spectrum2.title
    // params.peptide = 'A' + params.peptide.substring(1);
    params.precursor_mz = loriData.spectrum2.response?.precursorMz;
    params.precursor_charge = loriData.spectrum2.response?.precursorCharge;
    params.rt = loriData.spectrum2.response?.retentionTime || 0;
    params.fragment_tol_mass = loriAttr.mass.tol;
    params.fragment_tol_unit = loriAttr.mass.tolType;
    if (loriAttr.neutral.nh3) {
        params.neutral_losses.NH3 = -17.026549;
    } else {
        delete params.neutral_losses.NH3;
    }
    if (loriAttr.neutral.h2o) {
        params.neutral_losses.H2O = -18.010565;
    } else {
        delete params.neutral_losses.H2O;
    }
    params.spectrum_intensity = loriData.spectrum2.response?.intensities;
    params.spectrum_mz = loriData.spectrum2.response?.masses;

    params.ions_type = "";
    if (loriAttr.b) {
        params.ions_type += "b";
    }
    if (loriAttr.y) {
        params.ions_type += "y";
    }

    let res = await spectrumAnnotation(params);
    if (!res.peaks || !res.peaks.length) {
        console.error('spectrumAnnotation have not peaks')
        return;
    }
    loriData.annotation2.title = res.title;
    loriData.annotation2.peaks = [];
    loriData.annotation2.annotations = [];

    let maxIntensity = 0;
    for (let i = 0; i < res.peaks.length; i++) {
        let y = res.peaks[i].intensity;
        maxIntensity = y > maxIntensity ? y : maxIntensity;
    }

    // res.peaks[0].annotation = 'y1-H2O/0.8ppm';
    // res.peaks[10].annotation = 'y2-H2O/0.8ppm';
    // // res.peaks[30].annotation = 'y3-H2O/0.8ppm';
    // res.peaks[40].annotation = 'y4-H2O/0.8ppm';
    // res.peaks[50].annotation = 'y5-H2O/0.8ppm';
    // res.peaks[1].annotation = 'b1-H2O/0.8ppm';
    // res.peaks[11].annotation = 'b2-H2O/0.8ppm';
    // // res.peaks[31].annotation = 'b3-H2O/0.8ppm';
    // res.peaks[41].annotation = 'b4-H2O/0.8ppm';
    // res.peaks[51].annotation = 'b5-H2O/0.8ppm';
    res.peaks.forEach(peak => {

        const mz = peak.mz;
        const intensity = peak.intensity;
        const annotation = peak.annotation;
        if (!annotation || !annotation.includes('/')) {
            return;
        }
        const annotationParts = annotation.split('/');
        if (annotationParts.length != 2) {
            return;
        }

        const formParts = annotationParts[0].split('-');
        const icon = formParts[0];
        const neutral = formParts.length == 2 ? formParts[1] : '';
        const mass = annotationParts[1].replace(/[^0-9.]/g, '');

        const percent = Number(((intensity * 100) / maxIntensity).toFixed(2));

        const regex = /^([by])(\d+)$/;
        const match = icon.match(regex);
        if (!match) {
            return;
        }
        const type = match[1];
        const sequence = match[2];
        if (loriData.annotation2.annotations.find(item => item.type == type && item.sequence == sequence)) {
            return;
        }
        loriData.annotation2.annotations.push({ type: type, sequence: sequence, label: match[0] });

        loriData.annotation2.peaks.push({ mz, intensity, annotation, percent, type, label: icon, neutral: neutral, mass: mass })


    })

    console.log('loriData.annotation2.annotations', loriData.annotation2.annotations);

}