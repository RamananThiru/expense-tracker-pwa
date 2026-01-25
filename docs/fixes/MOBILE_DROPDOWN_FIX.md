# Mobile Dropdown Fix Explanation

## The Problem
You encountered an issue where the native HTML `<select>` dropdown was not behaving as expected on mobile viewports. Specifically, it was having trouble "dropping down" over other components or being clipped by the page layout.

## The Solution
We replaced the native HTML `<select>` with the **Shadcn UI `Select` component**.

### Why did this fix it?
It wasn't just about avoiding manual CSS. The key technical difference is how they render:

1.  **React Portals**:
    The Shadcn `Select` component uses a technique called **Portals**. Instead of rendering the dropdown menu *inside* your Form container (which has scrollbars and overflow rules), it essentially "teleports" the dropdown to render at the very end of the `<body>` tag.

    *   **Native/Inline elements**: Trapped inside `div`s with `overflow: hidden` or `overflow: auto`. If they get too big, they get cut off.
    *   **Portaled elements**: Render outside of all those containers. They float above everything else on the entire page, guaranteed.

2.  **Positioning Engine (Popper.js)**:
    The library component calculates the exact math to position the dropdown right next to the trigger button, regardless of where you scroll.

### Summary
We didn't just applying styling; we changed the **rendering strategy** to break the dropdown out of the scrollable container so it fits perfectly on small mobile screens without layout conflicts.
