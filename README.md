# SkillPath Framer Course Section

A responsive Framer code component that loads a course catalog from the SkillPath assignment API. It includes search, price sorting, location-aware currency formatting, loading skeletons, and user-friendly empty and error states.

## Live project

[View the live SkillPath project](https://faithful-transportation-629759.framer.app/)

## Components

- `CoursesSection.tsx` - fetches and validates course data, renders the catalog, and provides search and sorting controls.
- `CourseSkeleton.tsx` - displays the reusable loading placeholder used while data is being fetched.

## Features

- Responsive three-, two-, and one-column layouts
- Search by course name, description, or category
- Sort by price in ascending or descending order
- INR pricing by default and USD pricing for visitors detected in the United States
- Refundable-course badges
- Animated loading placeholders
- Retry, empty-catalog, and no-search-results states
- Framer property controls for card background color and corner radius

## Using the components in Framer

1. Create a code component named `CourseSkeleton` and paste in the contents of `CourseSkeleton.tsx`.
2. Publish that component and copy its Framer module URL.
3. Create a second code component named `CoursesSection` and paste in the contents of `CoursesSection.tsx`.
4. If necessary, replace the remote `CourseSkeleton` import near the top of `CoursesSection.tsx` with the URL from step 2.
5. Add `CoursesSection` to a Framer page and give it the available page width.
6. Customize **Card Color** and **Card Radius** from the Framer properties panel.

The section fills the available width and determines its own height from its content.

## Data sources

The component reads from these endpoints:

- Courses: `https://syncsphere-hiv6.onrender.com/assignment/course-data`
- Country code: `https://syncsphere-hiv6.onrender.com/assignment/country-code`

Course prices are stored in the API's smallest currency units (`pricePaise` and `priceUsdCents`) and divided by 100 before display. If country detection fails or returns a country other than `US`, the component falls back to INR.

## Framer properties

| Property | Type | Default | Range |
| --- | --- | --- | --- |
| Card Color | Color | `#F7F7F5` | N/A |
| Card Radius | Number | `8px` | `0-40px` |

## Notes

- The component uses `Inter`, falling back to the system and browser sans-serif fonts.
- The API must remain available and permit browser requests from the published Framer site.
- The current `CourseSkeleton` import in `CoursesSection.tsx` points to a published Framer module. Update it when publishing a new skeleton version.
