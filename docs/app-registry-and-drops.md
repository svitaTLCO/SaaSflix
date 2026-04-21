# App Registry and Drops

## Objective

Model every published product and every release as first-class platform entities so the ecosystem remains coherent as it grows.

This document defines how apps, launches, releases, lifecycle states, and discovery surfaces work.

## Why this matters

Without a canonical registry, the platform will degrade into hardcoded routes and scattered metadata. The app registry is the source of truth that keeps the platform coherent.

## App registry responsibilities

The registry must support:

- canonical app records
- status and lifecycle
- membership access rules
- visual and marketing metadata
- technical launch URLs
- release history
- linked feed posts
- linked support and discussion spaces
- archive / deprecation behavior
- discoverability controls

## App entity model

Each app should support fields such as:

- internal ID
- slug
- public name
- short thesis
- long description
- category
- tags
- icon / art
- screenshots / media
- lifecycle status
- visibility
- availability type
- minimum plan or entitlement group
- open action / launch URL
- platform integration type
- support model
- ownership metadata
- analytics metadata
- created / published / archived timestamps

## Lifecycle status model

Recommended statuses:

- Concept
- In Development
- Private Beta
- Public Beta
- Stable
- Experimental
- Deprecated
- Archived

Each status should affect:
- visual treatment
- discoverability
- member expectations
- support obligations
- warning or disclaimer messaging

## Availability model

Apps may be:

- included in all paid tiers
- included from a minimum tier upward
- invite-only
- time-limited experimental
- founder-access only
- retired but still visible in archive
- public preview with member-only full access

The architecture must not assume one universal access rule.

## Integration type model

An app may be:

- native platform module
- embedded member experience
- external web app using shared identity
- downloadable native app
- installable companion
- experimental prototype surface

The registry should normalize these differences so the member experience remains consistent.

## Release model

Every meaningful version or launch should be represented as a release entity with fields such as:

- release ID
- app association
- version label or release name
- summary
- release notes
- release type
- publication state
- staged visibility
- linked media
- linked founder post
- linked discussion thread
- linked support note if relevant
- rollout metadata
- timestamps

## Release types

Suggested release types:

- launch
- major update
- minor update
- beta drop
- experimental drop
- deprecation notice
- archive notice

## Drop experience

A drop is not just a changelog entry. It is a platform event.

Each drop should be able to power:

- home feed entries
- dedicated launch page
- notification fanout
- app detail timeline entry
- related discussions
- related support context
- analytics about interest and activation

## Discovery and ranking

App library ranking can eventually consider:

- recency
- plan eligibility
- follows / watches
- engagement
- founder highlight
- stability level
- user history / personalization if introduced carefully

The library must remain understandable and not turn into clutter.

## Archive model

Archived apps should remain visible where appropriate for historical coherence, but clearly marked and operationally honest.

Archived state should communicate:
- why it is archived
- whether access still exists
- whether support still exists
- whether data export or migration is available

## Governance

Admin tooling should allow controlled editing of:

- statuses
- visibility
- pricing-tier association
- launch metadata
- media
- release notes
- discussion attachment
- archive notices

## Non-negotiable outcome

The app registry and drop system must let the platform grow from a handful of apps to a large ecosystem without losing coherence.
