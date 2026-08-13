import * as React from "react"

interface CourseSkeletonProps {
    cardBackground?: string
    cardRadius?: number
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function CourseSkeleton(props: CourseSkeletonProps) {
    const { cardBackground = "#F7F7F5", cardRadius = 8 } = props

    return (
        <article
            style={{
                display: "flex",
                minHeight: "286px",
                flexDirection: "column",
                boxSizing: "border-box",
                padding: "24px",
                border: "1px solid rgba(16, 24, 40, 0.1)",
                borderRadius: cardRadius,
                background: cardBackground,
                overflow: "hidden",
            }}
        >
            <div
                className="skillpath-skeleton-shape"
                style={{ width: "88px", height: "23px", marginBottom: "18px" }}
            />
            <div
                className="skillpath-skeleton-shape"
                style={{ width: "72%", height: "26px", marginBottom: "14px" }}
            />
            <div
                className="skillpath-skeleton-shape"
                style={{ width: "100%", height: "15px", marginBottom: "9px" }}
            />
            <div
                className="skillpath-skeleton-shape"
                style={{ width: "82%", height: "15px" }}
            />
            <div
                style={{
                    marginTop: "auto",
                    paddingTop: "22px",
                    borderTop: "1px solid rgba(16, 24, 40, 0.08)",
                }}
            >
                <div
                    className="skillpath-skeleton-shape"
                    style={{ width: "96px", height: "22px" }}
                />
            </div>
        </article>
    )
}
