import "./HeartController2.css"

import { HEART_STATE_TITLES } from "../../../components/types/states.ts";
import type { HeartState } from "../../../components/types/states.ts";
import type { CompareState } from "../../../components/types/compare.ts"
import type { SyncedCamera, SyncState } from "../../../components/types/sync.ts";

import { FRAMES } from "../../../data/frames.ts"
import { useState, useRef } from "react";

import HeartViewer from "../../../components/hearts/HeartViewer.jsx"
import ConditionButtons from "./ConditionSelector.tsx";

import HeartController from "../../../components/hearts/HeartController.jsx"
import { useHeartMonitor } from "../../../components/context/HeartMonitorContext"
import SliceControls from "../../../components/hearts/SliceController.jsx"
import type { Complexity } from "../../../components/types/complexities.ts";
import { useNavigate } from "react-router"
import { getComparePath, getHeartPath } from "../../../utils/heartRoutes"
export default function HeartController2({ compareState, setSelectedPart, complexity,showAdvancedSliceControls}: { compareState: CompareState, setSelectedPart: (part: string | null) => void, complexity: Complexity, showAdvancedSliceControls: boolean}) {

    const {
        selection1,
        selection2,
        chooseSelection1,
        chooseSelection2,
        isComparing,
    } = compareState
    const navigate = useNavigate()

    const handleCompareToggle = () => {
        if (isComparing) {
            navigateWithPause(getHeartPath(
                complexity,
                selection1.category,
                selection1.option
            ))
        } else {
            const compareHeart: HeartState = selection1.category === "healthy"
                ? { category: "attack", option: "Minor" }
                : { category: "healthy", option: "Healthy" }

            chooseSelection2(compareHeart)
            navigateWithPause(getComparePath(
                complexity,
                selection1,
                compareHeart
            ))
        }
    }

    const showControls = complexity !== "basic"

    const [syncEnabled, setSyncEnabled] = useState(false)
    const syncedCameraRef = useRef<SyncedCamera | null>(null)
    const [sharedResetTrigger, setSharedResetTrigger] = useState(0)

    const [sharedShowEpi, setSharedShowEpi] = useState(true)
    const [sharedVentricleOnly, setSharedVentricleOnly] = useState(false)
    const [sharedFullView, setSharedFullView] = useState(true)

    const useSharedControls = isComparing && syncEnabled
    const [sharedSliceEnabled, setSharedSliceEnabled] = useState(true)
    const [sharedShowPlaneGuide, setSharedShowPlaneGuide] = useState(true)

    const [sharedActivePreset, setSharedActivePreset] =
        useState<string | null>("shortAxis")

    const [sharedPitch, setSharedPitch] = useState(-90)
    const [sharedYaw, setSharedYaw] = useState(0)
    const [sharedSliceDistance, setSharedSliceDistance] = useState(-18)

    
    const {
        isPaused,
        setIsPaused
    } = useHeartMonitor()

    const navigateWithPause = (destination: string) => {
        setIsPaused(true)

        window.setTimeout(() => {
            navigate(destination)
            window.requestAnimationFrame(() => setIsPaused(false))
        }, 50)
    }

    const handleSharedReset = () => {
        setSharedShowEpi(true)
        setSharedVentricleOnly(false)
        setSharedFullView(false)

        setSharedResetTrigger(prev => prev + 1)
    }

    const handleSharedVentricleView = () => {
        // setSharedVentricleOnly(prev => !prev)
        const nextVentricleOnly = !sharedVentricleOnly
        setSharedVentricleOnly(nextVentricleOnly)

        if (nextVentricleOnly) {
            setSharedFullView(false)
        }
    }

    const handleSharedFullView = () => {
        setSharedFullView(prev => !prev)
    }
    const handleSharedPresetSelect = (
        presetKey: string,
        pitch: number,
        yaw: number
    ) => {
        setSharedFullView(false)

        setSharedSliceEnabled(true)
        setSharedShowPlaneGuide(true)

        setSharedActivePreset(presetKey)
        setSharedPitch(pitch)
        setSharedYaw(yaw)

        if (presetKey === "frontal") {
            setSharedSliceDistance(0)
        } else if (presetKey === "sagittal") {
            setSharedSliceDistance(-3)
        } else if (presetKey === "shortAxis") {
            setSharedSliceDistance(-18)
        }
        setSharedResetTrigger(prev => prev + 1)
    }

    const handleSharedDepthSliderChange = (depth: number) => {
        setSharedSliceDistance(depth)
    }
    const syncState: SyncState = {
        syncEnabled,
        setSyncEnabled,
        syncedCameraRef,
        sharedResetTrigger,
        setSharedResetTrigger,
        index: 0
    }

    return (
        <section className="middle-panel">
            <button
                type="button"
                className={`compare-button ${isComparing ? "" : "not-comparing"}`}
                aria-pressed={isComparing}
                onClick={handleCompareToggle}
            >
                {isComparing ? "Stop Comparing" : "Compare"}
            </button>

            {isComparing &&
                <button
                    className={`sync${syncEnabled ? " is-active" : ""}`}
                    aria-pressed={syncEnabled}
                    onClick={() => (setSyncEnabled((syncEnabled) => !syncEnabled))}
                    style={{
                        background: syncEnabled ? "var(--selected-condition-background)" : "var(--cards-background)",
                        color: syncEnabled ? "var(--cards-background)" : "var(--body-texts)",
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                         className="lucide lucide-refresh-cw preview-icon">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                        <path d="M21 3v5h-5"/>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                        <path d="M8 16H3v5"/>
                    </svg>
                    Sync
                </button>
            }

            <div className="middle-panel-viewers">

                <HeartPanel
                    active={selection1}
                    setActive={chooseSelection1}
                    syncState={syncState}
                    setSelectedPart={setSelectedPart}
                    useSharedControls={useSharedControls}
                    sharedShowEpi={sharedShowEpi}
                    setSharedShowEpi={setSharedShowEpi}
                    sharedVentricleOnly={sharedVentricleOnly}
                    setSharedVentricleOnly={setSharedVentricleOnly}
                    sharedFullView={sharedFullView}
                    setSharedFullView={setSharedFullView}

                    sharedSliceEnabled={sharedSliceEnabled}
                    setSharedSliceEnabled={setSharedSliceEnabled}

                    sharedShowPlaneGuide={sharedShowPlaneGuide}
                    setSharedShowPlaneGuide={setSharedShowPlaneGuide}

                    sharedActivePreset={sharedActivePreset}
                    setSharedActivePreset={setSharedActivePreset}

                    sharedPitch={sharedPitch}
                    setSharedPitch={setSharedPitch}

                    sharedYaw={sharedYaw}
                    setSharedYaw={setSharedYaw}

                    sharedSliceDistance={sharedSliceDistance}
                    setSharedSliceDistance={setSharedSliceDistance}
                    complexity={complexity}
                    updateRoute={!isComparing}
                    showAdvancedSliceControls={showAdvancedSliceControls}
                    otherHeart={selection2}
                    compareSide={isComparing ? "first" : undefined}
                    onNavigate={navigateWithPause}

                />

                {isComparing && (
                    <HeartPanel
                        active={selection2}
                        setActive={chooseSelection2}
                        syncState={{ ...syncState, index: 1 }}
                        setSelectedPart={setSelectedPart}
                        useSharedControls={useSharedControls}
                        sharedShowEpi={sharedShowEpi}
                        setSharedShowEpi={setSharedShowEpi}
                        sharedVentricleOnly={sharedVentricleOnly}
                        setSharedVentricleOnly={setSharedVentricleOnly}
                        sharedFullView={sharedFullView}
                        setSharedFullView={setSharedFullView}
                        sharedSliceEnabled={sharedSliceEnabled}
                        setSharedSliceEnabled={setSharedSliceEnabled}

                        sharedShowPlaneGuide={sharedShowPlaneGuide}
                        setSharedShowPlaneGuide={setSharedShowPlaneGuide}

                        sharedActivePreset={sharedActivePreset}
                        setSharedActivePreset={setSharedActivePreset}

                        sharedPitch={sharedPitch}
                        setSharedPitch={setSharedPitch}

                        sharedYaw={sharedYaw}
                        setSharedYaw={setSharedYaw}

                        sharedSliceDistance={sharedSliceDistance}
                        setSharedSliceDistance={setSharedSliceDistance}

                        showControls={showControls}
                        complexity={complexity}
                        updateRoute={false}
                        showAdvancedSliceControls={showAdvancedSliceControls}
                    otherHeart={selection1}
                    compareSide="second"
                    onNavigate={navigateWithPause}
                    />
                    
                )}
            </div>
            {isComparing && syncEnabled && (
                <div className="shared-heart-controller">
                    <HeartController
                        isPaused={isPaused}
                        setIsPaused={setIsPaused}

                        showEpi={sharedShowEpi}
                        setShowEpi={setSharedShowEpi}

                        ventricleOnly={sharedVentricleOnly}
                        setVentricleOnly={setSharedVentricleOnly}

                       fullView={sharedFullView && !sharedSliceEnabled && !sharedVentricleOnly}

                        handleResetView={handleSharedReset}
                        handleFullView={handleSharedFullView}
                        handleVentricleView={handleSharedVentricleView}
                        sliceEnabled={sharedSliceEnabled}
                    />
                    <SliceControls
                        shared
                        index={0}

                        sliceEnabled={sharedSliceEnabled}
                        setSliceEnabled={setSharedSliceEnabled}

                        showPlaneGuide={sharedShowPlaneGuide}
                        setShowPlaneGuide={setSharedShowPlaneGuide}

                        activePreset={sharedActivePreset}
                        setActivePreset={setSharedActivePreset}

                        pitch={sharedPitch}
                        setPitch={setSharedPitch}

                        yaw={sharedYaw}
                        setYaw={setSharedYaw}

                        sliceDistance={sharedSliceDistance}

                        handlePresetSelect={handleSharedPresetSelect}
                        handleDepthSliderChange={handleSharedDepthSliderChange}
                        complexity={complexity}
                        showAdvancedSliceControls={showAdvancedSliceControls}

                    />
                </div>
            )}

        </section>
    )
}

function HeartPanel({
                        active,
                        setActive,
                        syncState,
                        setSelectedPart,
                        useSharedControls,
                        showSyncedControls = false,
                        sharedShowEpi,
                        setSharedShowEpi,
                        sharedVentricleOnly,
                        setSharedVentricleOnly,
                        sharedFullView,
                        setSharedFullView,
                        sharedSliceEnabled,
                        setSharedSliceEnabled,
                        sharedShowPlaneGuide,
                        setSharedShowPlaneGuide,
                        sharedActivePreset,
                        setSharedActivePreset,
                        sharedPitch,
                        setSharedPitch,
                        sharedYaw,
                        setSharedYaw,
                        sharedSliceDistance,
                        setSharedSliceDistance,
                        complexity,
                        updateRoute,
                        showAdvancedSliceControls,
                        otherHeart,
                        compareSide,
                        onNavigate
                    }: {
    active: HeartState,
    setActive: (v: HeartState) => void,
    syncState: SyncState,
    setSelectedPart: (part: string | null) => void,
    useSharedControls: boolean,
    showSyncedControls?: boolean,
    sharedShowEpi: boolean,
    setSharedShowEpi: (value: boolean) => void,
    sharedVentricleOnly: boolean,
    setSharedVentricleOnly: (value: boolean) => void,
    sharedFullView: boolean,
    setSharedFullView: (value: boolean) => void,
    sharedSliceEnabled: boolean,
    setSharedSliceEnabled: (value: boolean) => void,
    sharedShowPlaneGuide: boolean,
    setSharedShowPlaneGuide: (value: boolean) => void,
    sharedActivePreset: string | null,
    setSharedActivePreset: (value: string | null) => void,
    sharedPitch: number,
    setSharedPitch: (value: number) => void,
    sharedYaw: number,
    setSharedYaw: (value: number) => void,
    sharedSliceDistance: number,
    setSharedSliceDistance: (value: number) => void,
    complexity: Complexity,
    updateRoute: boolean,
    showAdvancedSliceControls: boolean,
    otherHeart?: HeartState,
    compareSide?: "first" | "second",
    onNavigate?: (to: string) => void,
    showControls?: boolean
}) {
    const {
        syncEnabled,
        syncedCameraRef,
        sharedResetTrigger,
        setSharedResetTrigger,
        index
    } = syncState

    return (
        <div className="heart_panel">
            <ConditionButtons active={active} setActive={setActive} complexity={complexity} updateRoute={updateRoute} otherHeart={otherHeart}
                    compareSide={compareSide} onNavigate={onNavigate}/>
            <div className="heart_viewer">
                <HeartViewer
                    frameFolder={FRAMES[active.option]}
                    setSelectedPart={setSelectedPart}
                    title={HEART_STATE_TITLES[active.option]}
                    syncEnabled={syncEnabled}
                    syncedCameraRef={syncedCameraRef}
                    index={index}
                    sharedResetTrigger={sharedResetTrigger}
                    setSharedResetTrigger={setSharedResetTrigger}
                    useSharedControls={useSharedControls}
                    showSyncedControls={showSyncedControls}
                    sharedShowEpi={sharedShowEpi}
                    setSharedShowEpi={setSharedShowEpi}
                    sharedVentricleOnly={sharedVentricleOnly}
                    setSharedVentricleOnly={setSharedVentricleOnly}
                    sharedFullView={sharedFullView}
                    setSharedFullView={setSharedFullView}

                    sharedSliceEnabled={sharedSliceEnabled}
                    setSharedSliceEnabled={setSharedSliceEnabled}

                    sharedShowPlaneGuide={sharedShowPlaneGuide}
                    setSharedShowPlaneGuide={setSharedShowPlaneGuide}

                    sharedActivePreset={sharedActivePreset}
                    setSharedActivePreset={setSharedActivePreset}

                    sharedPitch={sharedPitch}
                    setSharedPitch={setSharedPitch}

                    sharedYaw={sharedYaw}
                    setSharedYaw={setSharedYaw}

                    sharedSliceDistance={sharedSliceDistance}
                    setSharedSliceDistance={setSharedSliceDistance}

                    complexity={complexity}
                    showAdvancedSliceControls={showAdvancedSliceControls} showControls={undefined}
                    cameraView={undefined} externalClipPlane={undefined} animationPhase={undefined}                />
            </div>
        </div>
    )
}
