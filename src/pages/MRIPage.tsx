import MRILayout from "../components/mri/MRILayout.tsx"
import TopBar from "../components/layout/top_layout/TopBar.tsx";
import {useState} from "react";

export default function MRIPage() {
    const [graphActive, setGraphActive] = useState<boolean>(true)

    return (
        <>
            <TopBar graphActive={graphActive} setGraphActive={setGraphActive}/>
            <MRILayout />
        </>
    )
}