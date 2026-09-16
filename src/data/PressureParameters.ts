export type PressureProfile = {
    pAmp: number
    pWidth: number
    pOffset: number

    riseSpeed: number
    fallSpeed: number

    tAmp: number
    recoverySpeed: number

    startOffset: number
    endOffset: number

    waveform: "normal" | "reduced" | "fibrillation"
    severity: "healthy" | "minor" | "major"
}

export const pressureProfiles: Record<string, PressureProfile> = {
    healthy: {
        pAmp: 1,
        pWidth: 1,
        pOffset: 0,

        riseSpeed: 1,
        fallSpeed: 0.9,

        tAmp: 1,
        recoverySpeed: 1,

        startOffset: 0,
        endOffset: 0,
        waveform: "normal",
        severity: "healthy",
    },

    minorAttack: {
        pAmp: 0.7,
        pWidth: 1.1,
        pOffset: 0,

        riseSpeed: 1.3,
        fallSpeed: 1,

        tAmp: 1,
        recoverySpeed: 1,
        
        startOffset: 0,
        endOffset: 0,

        waveform: "reduced",
        severity: "minor",
    },

    severeAttack: {
        pAmp: 0.6,
        pWidth: 0.8,
        pOffset: 0,

        riseSpeed: 1.5,
        fallSpeed: 0,

        tAmp: 1,
        recoverySpeed: 1,

        startOffset: 0,
        endOffset: 0,
        waveform: "reduced",
        severity: "major",
    },

    fibrillation: {
        pAmp: 0.5,
        pWidth: 0.7,
        pOffset: 0,

        riseSpeed: 1,
        fallSpeed: 0.9,

        tAmp: 1,
        recoverySpeed: 1,

        startOffset: 0,
        endOffset: 0,

        waveform: "fibrillation",
        severity: "major",
    },

    compensated: {
        pAmp: 1,
        pWidth: 1.8,
        pOffset: -0.01,

        riseSpeed: 1.2,
        fallSpeed: 0.55,

        tAmp: 0.2,
        recoverySpeed: 0.8,

        startOffset: 0,
        endOffset: 0,

        waveform: "normal",
        severity: "minor",
    },

    decompensated: {
        pAmp: 0.6,
        pWidth: 1,
        pOffset: 0,

        riseSpeed: 1.3,
        fallSpeed: 0.9,

        tAmp: 1,
        recoverySpeed: 1,

        startOffset: 9,
        endOffset: 13,

        waveform: "reduced",
        severity: "major",
    },
}