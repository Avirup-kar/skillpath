import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
// @ts-ignore Framer resolves project component module URLs at runtime
import CourseSkeleton from "https://framer.com/m/CourseSkeleton-1jyRDh.js@ZCO9xPjB4oJ7Ud80eLIa"

const COURSE_URL = "https://syncsphere-hiv6.onrender.com/assignment/course-data"

const COUNTRY_URL =
    "https://syncsphere-hiv6.onrender.com/assignment/country-code"

type CountryCode = "IN" | "US"

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

interface CoursesSectionProps {
    cardBackground?: string
    cardRadius?: number
}

type SortOption = "default" | "low-high" | "high-low"

function isValidCourse(value: unknown): value is Course {
    if (!value || typeof value !== "object") return false

    const course = value as Record<string, unknown>

    return (
        typeof course.courseName === "string" &&
        typeof course.courseCode === "string" &&
        typeof course.description === "string" &&
        typeof course.mainCategory === "string" &&
        typeof course.shortCourse === "string" &&
        typeof course.courseType === "string" &&
        typeof course.pricePaise === "number" &&
        Number.isFinite(course.pricePaise) &&
        typeof course.priceUsdCents === "number" &&
        Number.isFinite(course.priceUsdCents) &&
        typeof course.mangoId === "string" &&
        typeof course.refundable === "boolean"
    )
}

async function fetchCourses(signal?: AbortSignal): Promise<Course[]> {
    const response = await fetch(COURSE_URL, {
        method: "GET",
        signal,
    })

    if (!response.ok) {
        throw new Error(`Course request failed with ${response.status}`)
    }

    const data: unknown = await response.json()

    if (!Array.isArray(data)) {
        throw new Error("Invalid course response")
    }

    const validCourses = data.filter(isValidCourse)

    if (data.length > 0 && validCourses.length === 0) {
        throw new Error("Course data did not match the expected format")
    }

    return validCourses
}

async function fetchCountry(signal?: AbortSignal): Promise<CountryCode> {
    const response = await fetch(COUNTRY_URL, {
        method: "GET",
        signal,
    })

    if (!response.ok) {
        throw new Error(`Country request failed with ${response.status}`)
    }

    const data: unknown = await response.json()

    if (!data || typeof data !== "object" || !("country_code" in data)) {
        throw new Error("Invalid country response")
    }

    const countryCode = (
        data as {
            country_code?: unknown
        }
    ).country_code

    if (countryCode !== "IN" && countryCode !== "US") {
        throw new Error("Unsupported country code")
    }

    return countryCode
}

function getCoursePrice(course: Course, country: CountryCode): number {
    return country === "US"
        ? course.priceUsdCents / 100
        : course.pricePaise / 100
}

function formatPrice(course: Course, country: CountryCode): string {
    const value = getCoursePrice(course, country)

    return new Intl.NumberFormat(country === "US" ? "en-US" : "en-IN", {
        style: "currency",
        currency: country === "US" ? "USD" : "INR",
        maximumFractionDigits: 2,
    }).format(value)
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function CoursesSection(props: CoursesSectionProps) {
    const { cardBackground = "#F7F7F5", cardRadius = 8 } = props

    const [courses, setCourses] = React.useState<Course[]>([])
    const [country, setCountry] = React.useState<CountryCode>("IN")

    const [coursesLoading, setCoursesLoading] = React.useState(true)

    const [coursesError, setCoursesError] = React.useState<string | null>(null)

    const [search, setSearch] = React.useState("")
    const [sort, setSort] = React.useState<SortOption>("default")

    const loadData = React.useCallback(async (signal?: AbortSignal) => {
        setCoursesLoading(true)
        setCoursesError(null)

        const [coursesResult, countryResult] = await Promise.allSettled([
            fetchCourses(signal),
            fetchCountry(signal),
        ])

        if (signal?.aborted) return

        if (coursesResult.status === "fulfilled") {
            setCourses(coursesResult.value)
        } else {
            setCourses([])
            setCoursesError("We couldn't load the courses right now.")
        }

        if (countryResult.status === "fulfilled") {
            setCountry(countryResult.value)
        } else {
            setCountry("IN")
        }

        setCoursesLoading(false)
    }, [])

    React.useEffect(() => {
        const controller = new AbortController()

        loadData(controller.signal)

        return () => {
            controller.abort()
        }
    }, [loadData])

    const visibleCourses = React.useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        const filtered = courses.filter((course) => {
            if (!normalizedSearch) return true

            return (
                course.courseName.toLowerCase().includes(normalizedSearch) ||
                course.description.toLowerCase().includes(normalizedSearch) ||
                course.mainCategory.toLowerCase().includes(normalizedSearch)
            )
        })

        if (sort === "default") {
            return filtered
        }

        return [...filtered].sort((a, b) => {
            const aPrice = getCoursePrice(a, country)
            const bPrice = getCoursePrice(b, country)

            return sort === "low-high" ? aPrice - bPrice : bPrice - aPrice
        })
    }, [courses, search, sort, country])

    const handleRetry = () => {
        loadData()
    }

    return (
        <section
            style={{
                width: "100%",
                boxSizing: "border-box",
                fontFamily:
                    "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                color: "#101828",
            }}
        >
            <style>{`
                .skillpath-controls {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 16px;
                    margin-bottom: 28px;
                }

                .skillpath-search {
                    width: 100%;
                    min-width: 0;
                    height: 46px;
                    padding: 0 16px;
                    box-sizing: border-box;
                    border: 1px solid rgba(16, 24, 40, 0.16);
                    border-radius: 8px;
                    background: #ffffff;
                    color: #101828;
                    font: inherit;
                    outline: none;
                    transition:
                        border-color 0.2s ease,
                        box-shadow 0.2s ease;
                }

                .skillpath-search:focus {
                    border-color: rgba(16, 24, 40, 0.45);
                    box-shadow:
                        0 0 0 3px rgba(16, 24, 40, 0.06);
                }

                .skillpath-sort {
    flex: 0 0 200px;
    height: 46px;

    padding: 0 42px 0 16px;

    border: 1px solid rgba(16, 24, 40, 0.12);
    border-radius: 12px;

    background-color: #ffffff;

    /* Custom dropdown arrow */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23667085' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    background-size: 16px;

    color: #344054;

    font: inherit;
    font-size: 14px;
    font-weight: 500;

    cursor: pointer;
    outline: none;

    appearance: none;
    -webkit-appearance: none;

    box-shadow:
        0 1px 2px rgba(16, 24, 40, 0.04),
        0 2px 6px rgba(16, 24, 40, 0.03);

    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease,
        transform 0.2s ease;
}

.skillpath-sort:hover {
    border-color: rgba(16, 24, 40, 0.28);

    box-shadow:
        0 2px 4px rgba(16, 24, 40, 0.05),
        0 4px 12px rgba(16, 24, 40, 0.06);
}

.skillpath-sort:focus {
    border-color: #101828;

    box-shadow:
        0 0 0 3px rgba(16, 24, 40, 0.06),
        0 2px 6px rgba(16, 24, 40, 0.06);
}

.skillpath-sort option {
    background: #ffffff;
    color: #344054;
    font-size: 14px;
}

                .skillpath-course-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 20px;
                    width: 100%;
                }

                .skillpath-course-card {
                    display: flex;
                    min-width: 0;
                    min-height: 286px;
                    flex-direction: column;
                    box-sizing: border-box;
                    padding: 24px;
                    border: 1px solid rgba(16, 24, 40, 0.1);
                    overflow: hidden;
                    transition:
                        transform 0.2s ease,
                        box-shadow 0.2s ease;
                }

                .skillpath-course-card:hover {
                    transform: translateY(-2px);
                    box-shadow:
                        0 10px 30px rgba(16, 24, 40, 0.08);
                }

                .skillpath-category {
                    display: inline-flex;
                    align-self: flex-start;
                    margin-bottom: 16px;
                    padding: 5px 9px;
                    border-radius: 999px;
                    background: rgba(16, 24, 40, 0.07);
                    color: #475467;
                    font-size: 12px;
                    font-weight: 600;
                    line-height: 1;
                }

                .skillpath-course-name {
                    margin: 0 0 10px;
                    color: #101828;
                    font-size: 21px;
                    font-weight: 650;
                    line-height: 1.3;
                    letter-spacing: -0.02em;
                }

                .skillpath-description {
                    display: -webkit-box;
                    margin: 0;
                    overflow: hidden;
                    color: #667085;
                    font-size: 14px;
                    line-height: 1.6;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                }

                .skillpath-card-footer {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 16px;
                    margin-top: auto;
                    padding-top: 28px;
                }

                .skillpath-price {
                    color: #101828;
                    font-size: 19px;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                }

                .skillpath-refundable {
                    flex-shrink: 0;
                    padding: 6px 9px;
                    border-radius: 999px;
                    background: #ecfdf3;
                    color: #027a48;
                    font-size: 11px;
                    font-weight: 650;
                    white-space: nowrap;
                }

                .skillpath-country-warning {
                    margin: -14px 0 22px;
                    color: #667085;
                    font-size: 12px;
                    line-height: 1.5;
                }

                .skillpath-state {
                    display: flex;
                    min-height: 240px;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                    padding: 32px;
                    border: 1px solid rgba(16, 24, 40, 0.1);
                    border-radius: 10px;
                    text-align: center;
                }

                .skillpath-state-title {
                    margin: 0 0 8px;
                    color: #101828;
                    font-size: 19px;
                    font-weight: 650;
                }

                .skillpath-state-text {
                    max-width: 420px;
                    margin: 0;
                    color: #667085;
                    font-size: 14px;
                    line-height: 1.6;
                }

                .skillpath-retry {
                    margin-top: 18px;
                    padding: 10px 16px;
                    border: 0;
                    border-radius: 8px;
                    background: #101828;
                    color: white;
                    font: inherit;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                }

                @media (max-width: 900px) {
                    .skillpath-course-grid {
                        grid-template-columns:
                            repeat(2, minmax(0, 1fr));
                    }
                }

                @media (max-width: 600px) {
                    .skillpath-controls {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .skillpath-sort {
                        width: 100%;
                        flex-basis: auto;
                    }

                    .skillpath-course-grid {
                        grid-template-columns: 1fr;
                    }

                    .skillpath-course-card {
                        min-height: 270px;
                    }
                }
            `}</style>

            <div className="skillpath-controls">
                <input
                    className="skillpath-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search courses..."
                    aria-label="Search courses"
                />

                <select
                    className="skillpath-sort"
                    value={sort}
                    onChange={(event) =>
                        setSort(event.target.value as SortOption)
                    }
                    aria-label="Sort courses"
                >
                    <option value="default">Sort by price</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                </select>
            </div>

            {coursesLoading ? (
                <div className="skillpath-course-grid">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <CourseSkeleton
                            key={index}
                            cardBackground={cardBackground}
                            cardRadius={cardRadius}
                        />
                    ))}
                </div>
            ) : coursesError ? (
                <div className="skillpath-state">
                    <h3 className="skillpath-state-title">
                        Something went wrong
                    </h3>

                    <p className="skillpath-state-text">
                        {coursesError} The API is intentionally unreliable, so
                        you can try the request again.
                    </p>

                    <button
                        className="skillpath-retry"
                        type="button"
                        onClick={handleRetry}
                    >
                        Try again
                    </button>
                </div>
            ) : courses.length === 0 ? (
                <div className="skillpath-state">
                    <h3 className="skillpath-state-title">
                        No courses available
                    </h3>

                    <p className="skillpath-state-text">
                        There aren't any courses to show right now.
                    </p>
                </div>
            ) : visibleCourses.length === 0 ? (
                <div className="skillpath-state">
                    <h3 className="skillpath-state-title">
                        No matching courses
                    </h3>

                    <p className="skillpath-state-text">
                        Try searching with a different course name or category.
                    </p>
                </div>
            ) : (
                <div className="skillpath-course-grid">
                    {visibleCourses.map((course) => (
                        <article
                            key={course.mangoId}
                            className="skillpath-course-card"
                            style={{
                                background: cardBackground,
                                borderRadius: cardRadius,
                            }}
                        >
                            <span className="skillpath-category">
                                {course.mainCategory}
                            </span>

                            <h3 className="skillpath-course-name">
                                {course.courseName}
                            </h3>

                            <p className="skillpath-description">
                                {course.description}
                            </p>

                            <div className="skillpath-card-footer">
                                <span className="skillpath-price">
                                    {formatPrice(course, country)}
                                </span>

                                {course.refundable && (
                                    <span className="skillpath-refundable">
                                        Refundable
                                    </span>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    )
}

addPropertyControls(CoursesSection, {
    cardBackground: {
        type: ControlType.Color,
        title: "Card Color",
        defaultValue: "#F7F7F5",
    },

    cardRadius: {
        type: ControlType.Number,
        title: "Card Radius",
        defaultValue: 8,
        min: 0,
        max: 40,
        step: 1,
        unit: "px",
    },
})
