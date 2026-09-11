export type PressureProfile = {
    pAmp: number
    pWidth: number
    pOffset: number

    riseSpeed: number
    fallSpeed: number

    tAmp: number
    recoverySpeed: number

    waveform: "normal" | "fibrillation"
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

        waveform: "normal",
        severity: "healthy",
    },

    minorAttack: {
        pAmp: 1,
        pWidth: 1,
        pOffset: 0,

        riseSpeed: 1,
        fallSpeed: 0.9,

        tAmp: 1,
        recoverySpeed: 1,

        waveform: "normal",
        severity: "healthy",
    },

    severeAttack: {
        pAmp: 1,
        pWidth: 1,
        pOffset: 0,

        riseSpeed: 1,
        fallSpeed: 0.9,

        tAmp: 1,
        recoverySpeed: 1,

        waveform: "normal",
        severity: "healthy",
    },

    fibrillation: {
        pAmp: 1,
        pWidth: 1,
        pOffset: 0,

        riseSpeed: 1,
        fallSpeed: 0.9,

        tAmp: 1,
        recoverySpeed: 1,

        waveform: "normal",
        severity: "healthy",
    },

    compensated: {
        pAmp: 1,
        pWidth: 1.8,
        pOffset: -0.01,

        riseSpeed: 1.2,
        fallSpeed: 0.55,

        tAmp: 0.2,
        recoverySpeed: 0.8,

        waveform: "normal",
        severity: "minor",
    },

    decompensated: {
        pAmp: 1,
        pWidth: 1,
        pOffset: 0,

        riseSpeed: 1,
        fallSpeed: 0.9,

        tAmp: 1,
        recoverySpeed: 1,

        waveform: "normal",
        severity: "healthy",
    },
}