import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
// @ts-ignore Framer resolves project component module URLs at runtime
import CourseSkeleton from "https://framer.com/m/CourseSkeleton-1jyRDh.js@ZCO9xPjB4oJ7Ud80eLIa"

interface Course {
    courseName: string
    courseCode: string
    description: string
    mainCategory: string
    shortCourse: string
    courseType: string
    pricePaise: number
    priceUsdCents: number
    mangoId: string
    refundable: boolean
}

type CountryCode = "IN" | "US" | null
type SortOption = "default" | "price-low" | "price-high"

interface CoursesSectionProps {
    cardBackground: string
    cardRadius: number
}

function formatPrice(course: Course, countryCode: CountryCode) {
    const useUsd = countryCode === "US"
    const amount = useUsd ? course.priceUsdCents / 100 : course.pricePaise / 100

    return new Intl.NumberFormat(useUsd ? "en-US" : "en-IN", {
        style: "currency",
        currency: useUsd ? "USD" : "INR",
    }).format(amount)
}

/**
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function CoursesSection(props: CoursesSectionProps) {
    const { cardBackground = "#F7F7F5", cardRadius = 8 } = props
    const [courses, setCourses] = React.useState<Course[]>([])
    const [countryCode, setCountryCode] = React.useState<CountryCode>(null)
    const [loading, setLoading] = React.useState(true)
    const [coursesError, setCoursesError] = React.useState<string | null>(null)
    const [searchQuery, setSearchQuery] = React.useState("")
    const [sortOption, setSortOption] = React.useState<SortOption>("default")

    async function fetchCourses() {
        try {
            const response = await fetch(
                "https://syncsphere-hiv6.onrender.com/assignment/course-data"
            )

            if (!response.ok) {
                throw new Error("Courses request failed")
            }

            const courseData: unknown = await response.json()

            if (!Array.isArray(courseData)) {
                throw new Error("Invalid courses response")
            }

            const hasInvalidCourse = courseData.some(
                (course) =>
                    course === null ||
                    typeof course !== "object" ||
                    typeof course.courseCode !== "string" ||
                    course.courseCode.trim() === "" ||
                    typeof course.courseName !== "string" ||
                    typeof course.description !== "string" ||
                    typeof course.mainCategory !== "string" ||
                    typeof course.pricePaise !== "number" ||
                    !Number.isFinite(course.pricePaise) ||
                    typeof course.priceUsdCents !== "number" ||
                    !Number.isFinite(course.priceUsdCents)
            )

            if (hasInvalidCourse) {
                throw new Error("Invalid course data")
            }

            setCourses(courseData)
        } catch {
            setCoursesError("We couldn't load the courses right now.")
        }
    }

    async function fetchCountryCode() {
        try {
            const response = await fetch(
                "https://syncsphere-hiv6.onrender.com/assignment/country-code"
            )

            if (!response.ok) {
                throw new Error("Country request failed")
            }

            const countryData = await response.json()

            if (
                countryData.country_code === "IN" ||
                countryData.country_code === "US"
            ) {
                setCountryCode(countryData.country_code)
            }
        } catch {
            setCountryCode(null)
        }
    }

    async function loadData() {
        setLoading(true)
        setCoursesError(null)
        setCountryCode(null)
        await Promise.allSettled([fetchCourses(), fetchCountryCode()])
        setLoading(false)
    }

    React.useEffect(() => {
        loadData()
    }, [])

    const normalizedSearch = searchQuery.trim().toLowerCase()
    const filteredCourses = courses.filter((course) => {
        return (
            course.courseName.toLowerCase().includes(normalizedSearch) ||
            course.description.toLowerCase().includes(normalizedSearch) ||
            course.mainCategory.toLowerCase().includes(normalizedSearch)
        )
    })

    const displayedCourses = [...filteredCourses]

    if (sortOption !== "default") {
        displayedCourses.sort((firstCourse, secondCourse) => {
            const firstPrice =
                countryCode === "US"
                    ? firstCourse.priceUsdCents
                    : firstCourse.pricePaise
            const secondPrice =
                countryCode === "US"
                    ? secondCourse.priceUsdCents
                    : secondCourse.pricePaise

            return sortOption === "price-low"
                ? firstPrice - secondPrice
                : secondPrice - firstPrice
        })
    }

    const containerStyle: React.CSSProperties = {
        width: "100%",
        maxWidth: "1120px",
        margin: "0 auto",
        padding: "8px 0 32px",
        fontFamily: "Geist, Inter, sans-serif",
        boxSizing: "border-box",
        color: "#172033",
    }

    const sharedStyles = `
        @keyframes skillpath-skeleton-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
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
            animation: skillpath-skeleton-shimmer 1.5s ease-in-out infinite;
        }

        .skillpath-courses-header {
            max-width: 680px;
            margin-bottom: 40px;
        }

        .skillpath-courses-eyebrow {
            margin: 0 0 12px;
            color: #526078;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.12em;
            line-height: 1.2;
        }

        .skillpath-courses-heading {
            margin: 0;
            color: #101828;
            font-size: 38px;
            font-weight: 650;
            letter-spacing: -0.035em;
            line-height: 1.12;
        }

        .skillpath-courses-supporting {
            max-width: 620px;
            margin: 16px 0 0;
            color: #667085;
            font-size: 17px;
            line-height: 1.6;
        }

        .skillpath-courses-tools {
            display: flex;
            gap: 12px;
            margin-bottom: 24px;
        }

        .skillpath-courses-search,
        .skillpath-courses-sort {
            box-sizing: border-box;
            height: 46px;
            border: 1px solid rgba(16, 24, 40, 0.14);
            border-radius: 8px;
            background: #ffffff;
            color: #172033;
            font: inherit;
            font-size: 14px;
            outline: none;
        }

        .skillpath-courses-search {
            min-width: 0;
            flex: 1;
            padding: 0 14px;
        }

        .skillpath-courses-sort {
            width: 210px;
            padding: 0 12px;
        }

        .skillpath-courses-search:focus,
        .skillpath-courses-sort:focus {
            border-color: #526078;
            box-shadow: 0 0 0 3px rgba(82, 96, 120, 0.12);
        }

        .skillpath-courses-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 24px;
            align-items: stretch;
        }

        .skillpath-course-card {
            display: flex;
            min-height: 286px;
            flex-direction: column;
            box-sizing: border-box;
            padding: 24px;
            border: 1px solid rgba(16, 24, 40, 0.1);
            box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
        }

        .skillpath-course-labels {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            margin-bottom: 18px;
        }

        .skillpath-course-category,
        .skillpath-course-refundable {
            padding: 6px 9px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 650;
            line-height: 1;
        }

        .skillpath-course-category {
            border: 1px solid rgba(16, 24, 40, 0.08);
            background: rgba(16, 24, 40, 0.045);
            color: #526078;
            letter-spacing: 0.04em;
        }

        .skillpath-course-refundable {
            border: 1px solid rgba(27, 122, 75, 0.18);
            background: rgba(27, 122, 75, 0.08);
            color: #17663f;
        }

        .skillpath-course-title {
            margin: 0 0 10px;
            color: #101828;
            font-size: 21px;
            font-weight: 650;
            letter-spacing: -0.02em;
            line-height: 1.3;
        }

        .skillpath-course-description {
            margin: 0;
            color: #667085;
            font-size: 15px;
            line-height: 1.55;
        }

        .skillpath-course-price {
            margin-top: auto;
            padding-top: 22px;
            border-top: 1px solid rgba(16, 24, 40, 0.08);
            color: #101828;
            font-size: 18px;
            font-weight: 700;
            letter-spacing: -0.01em;
            line-height: 1.2;
        }

        .skillpath-courses-message {
            padding: 28px;
            border: 1px solid rgba(16, 24, 40, 0.1);
            border-radius: 8px;
            background: #f7f7f5;
            color: #526078;
        }

        .skillpath-courses-error {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
        }

        .skillpath-courses-retry {
            flex: 0 0 auto;
            padding: 10px 15px;
            border: 1px solid #172033;
            border-radius: 8px;
            background: #172033;
            color: #ffffff;
            font: inherit;
            font-size: 14px;
            font-weight: 650;
            cursor: pointer;
        }

        @media (max-width: 899px) {
            .skillpath-courses-header {
                margin-bottom: 32px;
            }

            .skillpath-courses-heading {
                font-size: 33px;
            }

            .skillpath-courses-grid {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 20px;
            }
        }

        @media (max-width: 599px) {
            .skillpath-courses-header {
                margin-bottom: 26px;
            }

            .skillpath-courses-heading {
                font-size: 29px;
            }

            .skillpath-courses-supporting {
                margin-top: 12px;
                font-size: 16px;
            }

            .skillpath-courses-tools,
            .skillpath-courses-error {
                flex-direction: column;
                align-items: stretch;
            }

            .skillpath-courses-sort {
                width: 100%;
            }

            .skillpath-courses-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }

            .skillpath-course-card {
                min-height: 250px;
                padding: 22px;
            }
        }
    `

    if (loading) {
        return (
            <div style={containerStyle}>
                <style>{sharedStyles}</style>
                <div className="skillpath-courses-grid">
                    {Array.from({ length: 6 }, (_, index) => (
                        <CourseSkeleton
                            key={index}
                            cardBackground={cardBackground}
                            cardRadius={cardRadius}
                        />
                    ))}
                </div>
            </div>
        )
    }

    if (coursesError) {
        return (
            <div style={containerStyle}>
                <style>{sharedStyles}</style>
                <div className="skillpath-courses-message skillpath-courses-error">
                    <span>
                        We couldn't load the courses right now! Try Again.
                    </span>
                    <button
                        className="skillpath-courses-retry"
                        type="button"
                        onClick={loadData}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    if (courses.length === 0) {
        return (
            <div style={containerStyle}>
                <style>{sharedStyles}</style>
                <div className="skillpath-courses-message">
                    No courses available right now.
                </div>
            </div>
        )
    }

    return (
        <div style={containerStyle}>
            <style>{sharedStyles}</style>

            <header className="skillpath-courses-header">
                <div className="skillpath-courses-eyebrow">EXPLORE COURSES</div>
                <h2 className="skillpath-courses-heading">
                    Courses built to help you ship.
                </h2>
                <p className="skillpath-courses-supporting">
                    Explore practical courses designed to turn useful skills
                    into real progress.
                </p>
            </header>

            <div className="skillpath-courses-tools">
                <input
                    className="skillpath-courses-search"
                    type="search"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                />
                <select
                    className="skillpath-courses-sort"
                    value={sortOption}
                    onChange={(event) =>
                        setSortOption(event.target.value as SortOption)
                    }
                >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                </select>
            </div>

            {displayedCourses.length === 0 ? (
                <div className="skillpath-courses-message">
                    No courses match your search.
                </div>
            ) : (
                <div className="skillpath-courses-grid">
                    {displayedCourses.map((course) => (
                        <article
                            className="skillpath-course-card"
                            key={course.courseCode}
                            style={{
                                background: cardBackground,
                                borderRadius: cardRadius,
                            }}
                        >
                            <div className="skillpath-course-labels">
                                <span className="skillpath-course-category">
                                    {course.mainCategory}
                                </span>
                                {course.refundable === true && (
                                    <span className="skillpath-course-refundable">
                                        Refundable
                                    </span>
                                )}
                            </div>
                            <h3 className="skillpath-course-title">
                                {course.courseName}
                            </h3>
                            <p
                                className="skillpath-course-description"
                                style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {course.description}
                            </p>
                            <div className="skillpath-course-price">
                                {formatPrice(course, countryCode)}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    )
}

addPropertyControls(CoursesSection, {
    cardBackground: {
        type: ControlType.Color,
        title: "Card Background",
        defaultValue: "#F7F7F5",
    },
    cardRadius: {
        type: ControlType.Number,
        title: "Card Radius",
        defaultValue: 8,
        min: 0,
        max: 32,
        step: 1,
        unit: "px",
    },
})
