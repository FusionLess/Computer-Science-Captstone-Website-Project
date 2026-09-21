export type ECGProfile = {
    pAmp: number

    qrsAmp: number
    qrsWidth: number
    sAmp: number
    qrsOffset: number

    stElevation: number
    stDuration: number

    tAmp: number
    tWidth: number
    tStartOffset: number
    tInverted: boolean

    rhythmJitter: number
    postQrsJitter: number

    qrsStyle: "normal" | "reduced" | "none"
    waveform: "normal" | "fibrillation" 
    severity: "healthy" | "minor" | "major"
}
export const ecgProfiles: Record<string, ECGProfile> = {
    healthy: {
        pAmp: 1,

        qrsAmp: 1,
        qrsWidth: 1,
        sAmp: 1,
        qrsOffset: 0,
        
        stElevation: 0,
        stDuration: 1,

        tAmp: 1,
        tWidth: 1,
        tStartOffset: 1,
        tInverted: false,

        rhythmJitter: 0,
        postQrsJitter: 0,
        qrsStyle: "normal",
        waveform: "normal",
        severity: "healthy"
    },

    minorAttack: {
        pAmp: 0.5,

        qrsAmp: 0.45,
        qrsWidth: 1,
        sAmp: 0.5,
        qrsOffset: 0,

        stElevation: 0.1,
        stDuration: 0.8,

        tAmp: 0.25,
        tWidth: 1,
        tStartOffset: 1,
        tInverted: false,

        rhythmJitter: 0,
        postQrsJitter: 0,

        qrsStyle: "reduced",
        waveform: "normal",
        severity: "minor",
    },

    severeAttack: {
        pAmp: 0.7,

        qrsAmp: 0,
        qrsWidth: 1,
        sAmp: 0,
        qrsOffset: 0.05,

        stElevation: 1.15,
        stDuration: 1,

        tAmp: 1.7,
        tWidth: 0.8,
        tStartOffset: 1.2,
        tInverted: true,

        rhythmJitter: 0,
        postQrsJitter: 0,

        qrsStyle: "none",
        waveform: "normal",
        severity: "major",
    },

    fibrillation: {
        pAmp: 1,

        qrsAmp: 1,
        qrsWidth: 1,
        sAmp: 1,
        qrsOffset: 0,
        
        stElevation: 0,
        stDuration: 1,

        tAmp: 1,
        tWidth: 1,
        tStartOffset: 1,
        tInverted: false,

        rhythmJitter: 0,
        postQrsJitter: 0,
        qrsStyle: "normal",
        waveform: "fibrillation",
        severity: "major",
    },
    decompensated: {
        pAmp: 0.7,
        qrsAmp: 1,
        qrsWidth: 1,
        qrsOffset: 0,
        sAmp: 1,

        stElevation: -0.2,
        stDuration: 1.3,

        tAmp: 1.1,
        tWidth: 1,
        tStartOffset: 1,
        tInverted: true,

        rhythmJitter: 0.7,
        postQrsJitter: 1,

        qrsStyle: "reduced",
        waveform: "normal",
        severity: "major",
    },
    compensated: {
        pAmp: 0.9,

        qrsAmp: 0.85,
        qrsWidth: 1,
        qrsOffset: 0,
        sAmp: 0.35,

        stElevation: 0.2,
        stDuration: 0.8,

        tAmp: 1.8,
        tWidth: 1,
        tStartOffset: 0.6,
        tInverted: false,

        rhythmJitter: 0.1,
        postQrsJitter: 1,

        qrsStyle: "normal",
        waveform: "normal",
        severity: "minor",
    },
}