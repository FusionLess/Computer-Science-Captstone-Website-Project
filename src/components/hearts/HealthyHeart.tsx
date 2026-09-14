import HeartViewerPage from '../../pages/HeartViewerPage'

function HealthyHeart({
    onSelectPart,
}: {
    onSelectPart: (part: string) => void
}) {
    return (
        <HeartViewerPage
            embedded
            onSelectPart={onSelectPart}
        />
    )
}

export default HealthyHeart