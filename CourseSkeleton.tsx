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
            <style>{`
                @keyframes skillpath-skeleton-shimmer {
                    0% {
                        background-position: 200% 0;
                    }

                    100% {
                        background-position: -200% 0;
                    }
                }

                .skillpath-skeleton-shape {
                    border-radius: 6px;
                    background: linear-gradient(
                        90deg,
                        rgba(16, 24, 40, 0.07) 25%,
                        rgba(16, 24, 40, 0.12) 50%,
                        rgba(16, 24, 40, 0.07) 75%
                    );
                    background-size: 200% 100%;
                    animation:
                        skillpath-skeleton-shimmer
                        1.5s
                        ease-in-out
                        infinite;
                }
            `}</style>

            <div
                className="skillpath-skeleton-shape"
                style={{
                    width: "88px",
                    height: "23px",
                    marginBottom: "18px",
                }}
            />

            <div
                className="skillpath-skeleton-shape"
                style={{
                    width: "82%",
                    height: "27px",
                    marginBottom: "14px",
                }}
            />

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginBottom: "28px",
                }}
            >
                <div
                    className="skillpath-skeleton-shape"
                    style={{
                        width: "100%",
                        height: "14px",
                    }}
                />

                <div
                    className="skillpath-skeleton-shape"
                    style={{
                        width: "91%",
                        height: "14px",
                    }}
                />
            </div>

            <div
                style={{
                    marginTop: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                }}
            >
                <div
                    className="skillpath-skeleton-shape"
                    style={{
                        width: "74px",
                        height: "18px",
                    }}
                />

                <div
                    className="skillpath-skeleton-shape"
                    style={{
                        width: "82px",
                        height: "27px",
                    }}
                />
            </div>
        </article>
    )
}
