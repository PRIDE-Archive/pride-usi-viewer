import { reactive, ref } from "vue";

import { spectrumAnnotation, getSpectrum, annotateUsi, spectrumPrediction } from "@/api";

export const zoomName = ref();
export const zoomData = ref();

export const echart1Ref = ref(null);
export const echart1Option = ref({

  toolbox: {
    orient: "vertical",
    showTitle: true,
    // itemGap: 20,
    feature: {
      dataZoom: {
        title: {
          back: "Reset",
        },
        // yAxisIndex: "none",
        // title: 'Save As Image',
      },
      // restore: {},
      // saveAsImage: {
      //   title: "Save",
      // },
      myCustomTool: {
        show: true,
        title: 'Save',
        icon: 'path://M505.7 661c3.2 4.1 9.4 4.1 12.6 0l112-141.7c4.1-5.2 0.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z',
        onclick: function (event, instance) {
          //   saveChartAsImage();
        }
      }
    },
    bottom: "47%",
    right: "30",
  },
  axisPointer: {
    link: [
      {
        xAxisIndex: "all",
      },
    ],
  },
  dataZoom: [
    {
      id: "dataZoomX",
      type: "slider",
      xAxisIndex: [0],
      filterMode: "filter",
      height: 10,
      bottom: "10",
    },
    {
      id: "dataZoomY",
      type: "slider",
      yAxisIndex: [0],
      filterMode: "none",
      right: 20,
      width: 10,
    },
  ],
  grid: {
    containLabel: false,
    show: false,
    top: "10%",
    bottom: "15%",
    left: "5%",
    right: "5%",
  },
  graphic: [
    {
      type: "image",
      right: "35",
      top: "0",
      style: {
        image: "/setting1.svg",
        width: 20,
        height: 20,
      },
      onclick: function () {
        // onShowType(1);
      },
    },
    {
      type: "image",
      right: "35",
      bottom: "50",
      style: {
        image: "/setting1.svg",
        width: 20,
        height: 20,
      },
      onclick: function () {
        // onShowType(2);
      },
    },
  ],
  xAxis: [
    {
      // name: 'intensity',
      type: "value",
      min: 0,
      max: 1400,
      position: "bottom",
      interval: 200,
    },
  ],
  yAxis: [
    {
      name: 'm/z',
      type: "value",
      position: "left",
      min: -100,
      max: 100,
      interval: 20,
      axisLabel: {
        show: true,
        formatter: "{value} %",
      },
    },
  ],
  tooltip: {

  },
  dataset: [
    {
      dimensions: ['mz', 'intensity', 'percent'],
      source: []
    },
    {
      dimensions: ['mz', 'intensity', 'percent'],
      source: []
    },
    {
      dimensions: ['mz', 'intensity', 'percent', 'icon'],
      source: []
    },
    {
      dimensions: ['mz', 'intensity', 'percent', 'icon'],
      source: []
    }
  ],
  series: [
    {
      name: 'm/z1',
      type: "bar",
      encode: { x: 'mz', y: 'percent' },
      datasetIndex: 0,
      barWidth: 2,
      itemStyle: {
        color: "rgba(180, 180, 180, 1)",

      },
      barGap: '-100%',
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: function (params) {
          return [
            '<h3>Peptide: ' + loriData.spectrum1.title + ' </h3><hr size=1 style="margin: 3px 0">',
            'X Value: ' + params.data.mz + '<br/>',
            'Y Value: ' + params.data.intensity + '<br/>',
            'Y Percent: ' + params.data.percent + '%<br/>'
          ].join('');
        }
      },
    },
    {
      name: 'm/z2',
      type: "bar",
      encode: { x: 'x', y: 'percent' },
      datasetIndex: 1,
      barWidth: 2,
      itemStyle: {
        color: "rgba(180, 180, 180, 1)",
      },
      barGap: '-100%',
      tooltip: {
        show: true,
        trigger: 'item',
        formatter: function (params) {
          return [
            '<h3>Peptide: ' + loriData.spectrum2.title + ' </h3><hr size=1 style="margin: 3px 0">',
            'X Value: ' + params.data.mz + '<br/>',
            'Y Value: ' + params.data.intensity + '<br/>',
            'Y Percent: ' + params.data.percent + '%<br/>'
          ].join('');
        }
      },
    },
    {
      name: "Annotation",
      type: "bar",
      encode: { x: 'mz', y: 'percent' },
      datasetIndex: 2,
      symbolSize: 1,
      // showBackground: true,
      barWidth: 2,
      barGap: "-100%",
      itemStyle: {
        color: function (params) {
          return params.data.type == 'b' ? 'blue' : 'red';
        },
      },
      label: {
        normal: {
          show: true,
          position: 'top',
          rich: {
            main: {
              fontSize: 16,
              color: '#000',
              align: 'left',
              verticalAlign: 'middle',
            
              padding: [0, 0, 0, 0]
            },
            topRight: {
              fontSize: 10,
              color: '#000',
              align: 'right',
              verticalAlign: 'top',
              padding: [0, 0, 0, 0]
            },
            bottomRight: {
              fontSize: 10,
              color: '#000',
              align: 'right',
              verticalAlign: 'bottom',
              padding: [0, 0, 0, 15]
            }
          },
          formatter: function (param) {
            const label = param.data.label;
            const neutrals = param.data.neutrals;

            // 使用特殊字符来创建垂直布局
            return [
              '{topRight|' + (neutrals[1] || '') + '  }',
              '{main|' + label + '}',
              '{bottomRight|' + (neutrals[0] || '') + '}'
            ].join('\n');
          },
          textStyle: {
            color: '#000'
          }
        }
        // 结束 normal 配置
      },
    },
    {
      name: "Annotation",
      type: "bar",
      encode: { x: 'mz', y: 'percent' },
      datasetIndex: 3,
      symbolSize: 1,
      // showBackground: true,
      barWidth: 2,
      barGap: "-100%",
      itemStyle: {
        color: function (params) {
          return params.data.type == 'b' ? 'blue' : 'red';
        },
      },
      label: {
        normal: {
          show: true,
          position: 'bottom',
          rich: {
            main: {
              fontSize: 16,
              color: '#000',
              align: 'left',
              verticalAlign: 'middle',
            
              padding: [0, 0, 0, 0]
            },
            topRight: {
              fontSize: 10,
              color: '#000',
              align: 'right',
              verticalAlign: 'top',
              padding: [0, 0, 0, 0]
            },
            bottomRight: {
              fontSize: 10,
              color: '#000',
              align: 'right',
              verticalAlign: 'bottom',
              padding: [0, 0, 0, 15]
            }
          },
          formatter: function (param) {
            const label = param.data.label;
            const neutrals = param.data.neutrals;

            // 使用特殊字符来创建垂直布局
            return [
              '{topRight|' + (neutrals[1] || '') + '  }',
              '{main|' + label + '}',
              '{bottomRight|' + (neutrals[0] || '') + '}'
            ].join('\n');
          },
          textStyle: {
            color: '#000'
          }
        }
        // 结束 normal 配置
      },
    },
  ],
})

export const echart2Ref = ref(null);
export const echart2Option = ref({
  grid: {
    containLabel: false,
    show: true,
    left: "5%",
    right: "5%",
  },
  toolbox: {
    orient: "vertical",
    showTitle: true,
    // itemGap: 20,
    feature: {
      dataZoom: {
        title: {
          back: "Reset",
        },
        // yAxisIndex: "none",
        // title: 'Save As Image',
      },
      // restore: {},
      // saveAsImage: {
      //   title: "Save",
      // },
      // myCustomTool: {
      //   show: true,
      //   title: 'Save',
      //   icon: 'path://M505.7 661c3.2 4.1 9.4 4.1 12.6 0l112-141.7c4.1-5.2 0.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z',
      //   onclick: function (event, instance) {
      //     saveChartAsImage();
      //   }
      // }
    },
    bottom: "47%",
    right: "30",
  },
  dataZoom: [
    {
      id: "dataZoomX",
      type: "slider",
      xAxisIndex: [0],
      filterMode: "filter",
      height: 10,
      bottom: "10",
    },
    {
      id: "dataZoomY",
      type: "slider",
      yAxisIndex: [0],
      filterMode: "none",
      right: 20,
      width: 10,
    },
  ],
  xAxis: {
    type: "value",
    min: 0,
    max: 1400,
    position: "bottom",
    interval: 200,
  },
  yAxis: {
    name: 'm/z',
    type: "value",
    position: "left",
    max: 20,
    min: -20,
    // interval: 20,
    axisLabel: {
      show: true,
      formatter: "{value} ",
    },
  },
  dataset: [
    {
      dimensions: ['mz', 'intensity', 'percent', 'icon', 'mass'],
      source: []
    },
    {
      dimensions: ['mz', 'intensity', 'percent', 'icon', 'mass'],
      source: []
    }
  ],
  series: [
    {
      symbolSize: 10,
      datasetIndex: 0,
      encode: { x: 'mz', y: 'mass' },
      itemStyle: {
        color: function (params) {
          return params.data.type == 'b' ? 'blue' : 'red';
        },
      },
      type: "scatter",
    },
    {
      symbolSize: 10,
      datasetIndex: 1,
      encode: { x: 'mz', y: 'mass' },
      itemStyle: {
        color: function (params) {
          return params.data.type == 'b' ? 'blue' : 'red';
        },
      },
      type: "scatter",
    },
  ],
})

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

  max_ion_charge: number;
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
  },
  max_ion_charge: 3

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
    neutrals: [],
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
    "annotation": {},
    "max_ion_charge": "3"
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
  params.max_ion_charge = loriAttr.max_ion_charge.toString();

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
    // annotation: y6-NH3^2/0.3ppm
    if (!annotation || !annotation.includes('/')) {
      return;
    }

    // annotationParts: ['y6-NH3^2','0.3ppm']
    const annotationParts = annotation.split('/');
    if (annotationParts.length != 2) {
      return;
    }

    // formParts: ['y6','NH3^2']
    const formParts = annotationParts[0].split('-');
    // icon: y6
    const icon = formParts[0];
    // neutral: NH3^2 | ''
    const neutralParts = formParts.length == 2 ? formParts[1] : '';
    let neutrals = neutralParts.split('^');
    if (neutrals.length != 2 || isNaN(parseInt(neutrals[1]))) {
      neutrals = ['', ''];
    } else {
      let count = parseInt(neutrals[1]);
      neutrals[1] = Array(count).fill('+').join('');
    }

    // mass: 0.3
    const mass = annotationParts[1].replace(/[^0-9.]/g, '');

    const percent = Number(((intensity * 100) / maxIntensity).toFixed(2));

    const regex = /^([by])(\d+)$/;
    // match: ['y6','y','6']
    const match = icon.match(regex);
    if (!match) {
      return;
    }

    // type: y or b
    const type = match[1];
    // sequence: 6
    const sequence = match[2];
    if (loriData.annotation1.annotations.find(item => item.type == type && item.sequence == sequence)) {
      return;
    }
    loriData.annotation1.annotations.push({ type: type, sequence: sequence, label: match[0] });

    loriData.annotation1.peaks.push({ mz, intensity, annotation, percent, type, label: icon, neutrals: neutrals, mass: mass })


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
    "annotation": {},
    "max_ion_charge": "3"
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
  params.max_ion_charge = loriAttr.max_ion_charge.toString();

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
    const neutralParts = formParts.length == 2 ? formParts[1] : '';
    let neutrals = neutralParts.split('^');
    if (neutrals.length != 2 || isNaN(parseInt(neutrals[1]))) {
      neutrals = ['', ''];
    } else {
      let count = parseInt(neutrals[1]);
      neutrals[1] = Array(count).fill('+').join('');
    }

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

    loriData.annotation2.peaks.push({ mz, intensity, annotation, percent, type, label: icon, neutrals: neutrals, mass: mass })


  })

  console.log('loriData.annotation2.annotations', loriData.annotation2.annotations);

}

export const loadAnnotateUsi1 = async (usi: string) => {
  loriData.spectrum1.title = '';
  loriData.spectrum1.peaks = [];
  loriData.spectrum1.usi = usi;

  let params = {
    "usi": usi,
    "method": "spectrum_utils",
    "fragment_tol_mass": loriAttr.mass.tol || 20,
    "fragment_tol_unit": loriAttr.mass.tolType || "ppm",
    "ions_type": loriAttr.b ? "b" : "" + loriAttr.y ? "y" : "",
    "neutral_losses": {},
    "max_ion_charge": loriAttr.max_ion_charge
  };
  if (loriAttr.neutral.nh3) {
    params.neutral_losses.NH3 = -17.026549;
  } 
  if (loriAttr.neutral.h2o) {
    params.neutral_losses.H2O = -18.010565;
  } 

  const res = await annotateUsi(params);

  if (!res.intensities) {
    console.error('have not intensities')
    return;
  }
  if (res.intensities.length != res.masses.length) {
    console.error('intensities.length != masses.length')
    return;
  }
  let maxIntensity = 0;
  for (let i = 0; i < res.intensities.length; i++) {
    let y = res.intensities[i];
    maxIntensity = y > maxIntensity ? y : maxIntensity;
  }

  for (let i = 0; i < res.intensities.length; i++) {
    const mz = res.masses[i];
    const intensity = res.intensities[i];
    const percent = Number(((res.intensities[i] * 100) / maxIntensity).toFixed(2));
    loriData.spectrum1.peaks.push({ mz, intensity, percent });
  }

  if (res.peptide_sequence) {
    loriData.spectrum1.title = res.peptide_sequence;
  }

  loriData.spectrum1.response = res;


  if (!res.annotations || !res.annotations.length) {
    console.error('spectrumAnnotation have not annotations')
    return;
  }
  loriData.annotation1.title = res.peptide_sequence;
  loriData.annotation1.peaks = [];
  loriData.annotation1.annotations = [];
  maxIntensity = 0;
  for (let i = 0; i < res.annotations.length; i++) {
    let y = res.annotations[i].intensity;
    maxIntensity = y > maxIntensity ? y : maxIntensity;
  }

  res.annotations.forEach(peak => {

    const mz = peak.mz;
    const intensity = peak.intensity;

    const annotation = peak.annotation;
    // annotation: y6-NH3^2/0.3ppm
    if (!annotation || !annotation.includes('/')) {
      return;
    }

    // annotationParts: ['y6-NH3^2','0.3ppm']
    const annotationParts = annotation.split('/');
    if (annotationParts.length != 2) {
      return;
    }

    // formParts: ['y6','NH3^2']
    const formParts = annotationParts[0].split('-');
    // icon: y6
    const icon = formParts[0];
    // neutral: NH3^2 | ''
    const neutralParts = formParts.length == 2 ? formParts[1] : '';
    let neutrals = neutralParts.split('^');
    if (neutrals.length != 2 || isNaN(parseInt(neutrals[1]))) {
      neutrals = ['', ''];
    } else {
      let count = parseInt(neutrals[1]);
      neutrals[1] = Array(count).fill('+').join('');
    }

    // mass: 0.3
    const mass = annotationParts[1].replace(/[^0-9.]/g, '');

    const percent = Number(((intensity * 100) / maxIntensity).toFixed(2));

    const regex = /^([by])(\d+)$/;
    // match: ['y6','y','6']
    const match = icon.match(regex);
    if (!match) {
      return;
    }

    // type: y or b
    const type = match[1];
    // sequence: 6
    const sequence = match[2];
    if (loriData.annotation1.annotations.find(item => item.type == type && item.sequence == sequence)) {
      return;
    }
    loriData.annotation1.annotations.push({ type: type, sequence: sequence, label: match[0] });

    loriData.annotation1.peaks.push({ mz, intensity, annotation, percent, type, label: icon, neutrals: neutrals, mass: mass })


  })
}


export const loadAnnotateUsi2 = async () => {

  if(!loriData.spectrum1.response || !loriData.spectrum1.response.peptidoform) {
    console.error('have not peptidoform')
    alert('have not peptidoform');
    return;
  }

  let params = {
    "peptidoform": loriData.spectrum1.response.peptidoform,
    "model": "HCD2021",
  };

  const res = await spectrumPrediction(params);

  if (!res.intensities) {
    console.error('have not intensities')
    return;
  }
  if (res.intensities.length != res.masses.length) {
    console.error('intensities.length != masses.length')
    return;
  }
  let maxIntensity = 0;
  for (let i = 0; i < res.intensities.length; i++) {
    let y = res.intensities[i];
    maxIntensity = y > maxIntensity ? y : maxIntensity;
  }

  for (let i = 0; i < res.intensities.length; i++) {
    const mz = res.masses[i];
    const intensity = res.intensities[i];
    const percent = Number(((res.intensities[i] * 100) / maxIntensity).toFixed(2));
    loriData.spectrum2.peaks.push({ mz, intensity, percent });
  }

  if (res.peptide_sequence) {
    loriData.spectrum2.title = res.peptide_sequence;
  }

  loriData.spectrum2.response = res;

  if (!res.annotations || !res.annotations.length) {
    console.error('spectrumAnnotation have not annotations')
    return;
  }
  loriData.annotation2.title = res.peptide_sequence;
  loriData.annotation2.peaks = [];
  loriData.annotation2.annotations = [];
  maxIntensity = 0;
  for (let i = 0; i < res.annotations.length; i++) {
    let y = res.annotations[i].intensity;
    maxIntensity = y > maxIntensity ? y : maxIntensity;
  }

  res.annotations.forEach(peak => {

    const mz = peak.mz;
    const intensity = peak.intensity;

    const annotation = peak.annotation;
    // annotation: y6-NH3^2/0.3ppm
    if (!annotation || !annotation.includes('/')) {
      return;
    }

    // annotationParts: ['y6-NH3^2','0.3ppm']
    const annotationParts = annotation.split('/');
    if (annotationParts.length != 2) {
      return;
    }

    // formParts: ['y6','NH3^2']
    const formParts = annotationParts[0].split('-');
    // icon: y6
    const icon = formParts[0];
    // neutral: NH3^2 | ''
    const neutralParts = formParts.length == 2 ? formParts[1] : '';
    let neutrals = neutralParts.split('^');
    if (neutrals.length != 2 || isNaN(parseInt(neutrals[1]))) {
      neutrals = ['', ''];
    } else {
      let count = parseInt(neutrals[1]);
      neutrals[1] = Array(count).fill('+').join('');
    }

    // mass: 0.3
    const mass = annotationParts[1].replace(/[^0-9.]/g, '');

    const percent = Number(((intensity * 100) / maxIntensity).toFixed(2));

    const regex = /^([by])(\d+)$/;
    // match: ['y6','y','6']
    const match = icon.match(regex);
    if (!match) {
      return;
    }

    // type: y or b
    const type = match[1];
    // sequence: 6
    const sequence = match[2];
    if (loriData.annotation2.annotations.find(item => item.type == type && item.sequence == sequence)) {
      return;
    }
    loriData.annotation2.annotations.push({ type: type, sequence: sequence, label: match[0] });

    loriData.annotation2.peaks.push({ mz, intensity, annotation, percent, type, label: icon, neutrals: neutrals, mass: mass })


  })
}
