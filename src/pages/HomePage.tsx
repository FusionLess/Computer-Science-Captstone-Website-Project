import '../App.css'
import TopBar from '../components/layout/top_layout/TopBar.tsx'
import Content from './home/middle_layout/MiddleContent.tsx'
import GraphPanel from './home/bottom_layout/GraphPanel.tsx'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from "react-router"
import { getComplexityFromRoute, getHeartPath, getHeartStateFromRoute, getCompareHeartFromRoute, getComparePath} from "../utils/heartRoutes"
import type { HeartState } from "../components/types/states.ts";
import type { CompareState } from "../components/types/compare.ts"
import type { Complexity } from '../components/types/complexities.ts'

export default function HomePage() {
    const navigate = useNavigate()
    const { complexity: routeComplexity, category, option, first, second} = useParams()

    const [active, setActive] = useState<HeartState>({
        category: "healthy",
        option: "Healthy"
    });

    const [graphActive, setGraphActive] = useState<boolean>(true)
    const [glowActive, setGlowActive] = useState(true)
    const [showVeins, setShowVeins] = useState(true)
    const [showArteries, setShowArteries] = useState(true)

    const [isComparing, setIsComparing] = useState(false)

    const [selection1, chooseSelection1] = useState<HeartState>({
        category: "healthy",
        option: "Healthy",
    })

    const [selection2, chooseSelection2] = useState<HeartState>({
        category: "healthy",
        option: "Healthy",
    })
    const [complexity, setComplexity] =
        useState<Complexity>("standard")

    const compareState: CompareState = {
        selection1,
        selection2,
        chooseSelection1,
        chooseSelection2,
        isComparing,
        setIsComparing,
    }
    const [showAdvancedSliceControls, setShowAdvancedSliceControls] = useState(false)

    useEffect(() => {
        if (!routeComplexity || !category || !option) {
            return
        }

        const heartState = getHeartStateFromRoute(category, option)
        const complexityState = getComplexityFromRoute(routeComplexity)

        if (heartState && complexityState) {
            chooseSelection1(heartState)
            setActive(heartState)
            setComplexity(complexityState)
            setIsComparing(false)
        }

    }, [routeComplexity, category, option])
    useEffect(() => {

        if ( !routeComplexity && !category && !option && !first && !second) {
            navigate(getHeartPath("standard","healthy","Healthy"),{ replace: true })
        }

    }, [routeComplexity,category,option,navigate])

    const [showDescriptions, setShowDescriptions] = useState(true)
    const descriptionsBeforeCompare = useRef(showDescriptions)

    useEffect(() => {
        if (isComparing) {
            descriptionsBeforeCompare.current = showDescriptions
            setShowDescriptions(false)
            return
        }

        setShowDescriptions(descriptionsBeforeCompare.current)
    }, [isComparing])

    const handleComplexityChange = (newComplexity: Complexity) => {
        setComplexity(newComplexity)

        if (isComparing) {
            navigate(getComparePath(newComplexity, selection1, selection2))
        } else {
            navigate(getHeartPath(
                newComplexity,
                selection1.category,
                selection1.option
            ))
        }
    }
    useEffect(() => {
    setShowAdvancedSliceControls(complexity === "advanced")
}, [complexity])
    useEffect(() => {
        if (!first || !second) return

        const firstHeart = getCompareHeartFromRoute(first)
        const secondHeart = getCompareHeartFromRoute(second)
        const level = getComplexityFromRoute(routeComplexity)

        if (!firstHeart || !secondHeart || !level) return

        chooseSelection1(firstHeart)
        chooseSelection2(secondHeart)
        setComplexity(level)
        setIsComparing(true)
    }, [first, second, routeComplexity])
    const [sliceEnabled, setSliceEnabled] = useState<boolean>(false)
    useEffect(() => {
        if (!sliceEnabled) {
            setShowAdvancedSliceControls(false)
        } else if (complexity === "advanced") {
            setShowAdvancedSliceControls(true)
        }
    }, [complexity, sliceEnabled])
    return (
        <main className="app home-page">
            <TopBar
                showVeins={showVeins}
                setShowVeins={setShowVeins}
                showArteries={showArteries}
                setShowArteries={setShowArteries}
                graphActive={graphActive}
                setGraphActive={setGraphActive}
                glowActive={glowActive}
                setGlowActive={setGlowActive}
                complexity={complexity}
                showDescriptions={showDescriptions}
                setShowDescriptions={setShowDescriptions}
                setComplexity={handleComplexityChange}
                showAdvancedSliceControls={showAdvancedSliceControls}
                setShowAdvancedSliceControls={setShowAdvancedSliceControls}
                sliceEnabled={sliceEnabled}


            />
            <div className="complexity-title">
                <h5>{complexity.charAt(0).toUpperCase() + complexity.slice(1)} View</h5>
                <div id="mobile-compare-buttons" className="mobile-compare-buttons" />
            </div>
            <Content active={active} 
                showVeins={showVeins}
                showArteries={showArteries}
                setActive={setActive}
                compareState={compareState}
                complexity={complexity}
                showAdvancedSliceControls={showAdvancedSliceControls}
                showDescriptions={showDescriptions}
                setSliceEnabled={setSliceEnabled}
            />
            <GraphPanel compareState={compareState} graphActive={graphActive} glowActive={glowActive} />
        </main>
    )
}
