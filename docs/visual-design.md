# Visual Design

## Objective

Create a premium visual universe for a creator-led software studio platform that feels intentional, modern, cinematic, and alive. The design must avoid both generic enterprise-dashboard aesthetics and chaotic social-app aesthetics.

The platform should feel like a **digital studio operating system**.

## Design principles

### Authored, not templated
Interfaces must feel designed for this product, not assembled from generic admin blocks.

### Dense where useful, spacious where emotional
Management surfaces may be information-dense. Launch and discovery surfaces should breathe.

### Motion with restraint
Animation should communicate hierarchy, status change, continuity, and release excitement without becoming ornamental noise.

### Premium clarity
Typography, spacing, surfaces, and states should convey quality even before the user understands all features.

### Consistent universe
Stable apps, labs, drops, support, and community should look like members of one family.

## Experience zones

The platform is not visually uniform. It contains several zones with shared DNA but distinct emphasis.

### Public marketing zone
Purpose: explain the platform, communicate identity, convert visitors.
Traits: cinematic, polished, editorial, strong storytelling, product highlights.

### Member shell
Purpose: daily home, launcher, feed, account, notifications.
Traits: functional but elegant, fast, consistent, trust-building.

### App discovery zone
Purpose: browse all products.
Traits: card systems, metadata clarity, lifecycle labels, screenshots, launch history.

### Drop / launch zone
Purpose: celebrate releases.
Traits: richer visuals, hero moments, media, motion accents, narrative hierarchy.

### Community / support zone
Purpose: discussion, feedback, problem solving.
Traits: readable threads, strong information hierarchy, author/status markers, issue clarity.

### Admin zone
Purpose: operational management.
Traits: efficient, strict, lower decorative density, clear risk-signaling and diagnostics.

## Design tokens

Establish tokens as the source of truth. Do not hardcode styling across products.

Token families should include:

- color
- typography
- spacing
- radius
- elevation
- border
- opacity
- motion
- z-index
- breakpoints
- icon sizing
- semantic state tokens
- data-viz tokens where needed

Support multiple themes from the same token system:

- dark default
- light
- launch accent variants
- accessibility-safe high-contrast mode if justified

## Color system

The platform should use a dark-first palette by default with a restrained accent strategy.

Suggested semantic layers:

- background / canvas
- elevated surfaces
- overlays / modals
- text primary / secondary / tertiary
- border subtle / strong
- brand accent
- success / warning / danger / info
- beta / experimental / archived lifecycle accents

Avoid excessive neon or "cyber" styling unless limited to special launch moments.

## Typography system

Use a dual-purpose typography system:

- expressive display scale for launches and storytelling
- highly readable UI scale for dashboards, settings, discussions, and forms

Requirements:

- strong hierarchy
- excellent small-text legibility
- deliberate line length control
- readable monospace for identifiers, code snippets, and diagnostics

## Component system

The design system should define at minimum:

- buttons
- links
- text fields
- text areas
- selects
- toggles
- checkboxes / radios
- segmented controls
- tabs
- navigation items
- command palette
- cards
- app cards
- release cards
- thread items
- badges
- lifecycle pills
- avatar blocks
- toasts
- alerts
- dialogs / sheets
- dropdowns
- tables
- data lists
- pagination
- breadcrumbs
- rich text renderer
- composer
- file/media attachments
- search UI
- skeletons
- empty states

## App card language

App cards are a signature surface. Define a clear visual grammar:

- name
- one-line thesis
- status
- category
- plan access
- release freshness
- screenshot or art
- quick actions
- follower / engagement / support indicators if desired

Cards should communicate whether an app is:

- stable,
- beta,
- experimental,
- or archived

without forcing users to open details.

## Release page language

Every drop should feel like an event.

A release page should support:

- hero title
- teaser thesis
- availability status
- release notes
- what's new
- screenshots / media
- membership access level
- linked community discussion
- related founder feed post
- follow / bookmark / watch
- previous versions and changelog continuity

## Interaction design

### Navigation
Navigation must support both exploration and routine use.
Key routes should always be one or two steps away.

### Search
Search should feel instant, forgiving, and cross-surface where appropriate.

### Notifications
Notifications should distinguish:
- platform announcements,
- app release events,
- replies / mentions,
- support status updates,
- billing or security notices.

### Forms
Forms must be visually clear, well-labeled, and resilient to errors.

### Empty states
Empty states should educate and invite action, not just state absence.

## Accessibility

The design system must support:

- keyboard navigation
- visible focus
- sufficient contrast
- semantic heading structure
- large enough hit areas
- reduced motion handling
- understandable errors
- screen-reader friendly patterns
- color usage that never carries meaning alone

## Motion system

Use motion to express:

- panel and route continuity
- launch excitement
- list insertion / removal
- status transitions
- feed and notification freshness

Avoid:

- long blocking transitions
- decorative autoplay motion
- motion that obscures state changes
- animation as compensation for weak hierarchy

## Deliverables

The complete design plan should eventually include:

- token definitions
- component inventory
- Figma library or equivalent
- page flows
- motion rules
- illustration / media style
- iconography rules
- content design patterns
- accessibility rules
- responsive layout system

## Non-negotiable outcome

The platform must never look like a generic SaaS template with a founder feed glued onto it. It must look like a coherent, premium, product-native universe.
