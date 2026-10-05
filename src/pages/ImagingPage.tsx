import ImagingLayout from "../components/imaging/ImagingLayout.tsx"
import TopBar from "../components/layout/top_layout/TopBar.tsx";
import {useState} from "react";

export default function ImagingPage() {
    const [graphActive, setGraphActive] = useState<boolean>(true)

    return (
        <main className = "app">
            <TopBar graphActive={graphActive} setGraphActive={setGraphActive}/>
            <ImagingLayout />
        </main>
    )
}
