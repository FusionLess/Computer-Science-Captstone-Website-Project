    import "./Content.css"
    import LeftBox from "./LeftPanel.tsx"
    import type {HeartState} from "../types/states.ts";
    import HealthyHeart from "../hearts/HealthyHeart.tsx";
    import HeartAttack from "../hearts/HeartAttack.tsx";
    import ElectricityHeart from "../hearts/ElectricityHeart.tsx";
    import RightBox from "./RightPanel.tsx";

function Content({active, setActive, selectedPart, setSelectedPart} : {active: HeartState, setActive: (v: HeartState) => void, selectedPart: string | null, setSelectedPart: (part: string | null) => void}) {

    return (
        <main className="content">
            <LeftBox active={active} setActive={setActive} />
            <MiddleBox 
                active={active} 
                setSelectedPart={setSelectedPart} />
            <RightBox selectedPart={selectedPart} />
        </main>
    )
}

const views = {
    healthy: <HealthyHeart onSelectPart={() => {}} />,
    attack: <HeartAttack/>,
    electricity: <ElectricityHeart/>
};

function MiddleBox({active, setSelectedPart} : {active: HeartState, setSelectedPart: (part: string) => void}) {

    return (
        <>
            <aside className="middle box">
                {active === "healthy" && (
                    <HealthyHeart
                        onSelectPart={setSelectedPart}
                    />
                )}
            </aside>
        </>
    )
}

export default Content