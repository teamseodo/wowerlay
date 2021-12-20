## 0.4.2

- `(Update)` Demo pages are updated and refactored and package.json is updated.

<br>

## 0.4.0

- `noBackground` prop is added, if given `Wowerlay` won't have an invisible click blocker background when visible.

- `scrollbarGap` not counted for `checkOutOfScreen` is fixed.

- Readme is updated.

### Breaking Changes

- `WowerlayContainer` component is removed, now `Wowerlay` comes with its own background.

<br>

## 0.3.2

- Updated README.md

<br>

## 0.3.1

- Fix `verticalGap` and `horizontalGap` props are not working.

### Demo

- `With Gaps` demo is added.

<br>

## 0.3.0

- New positions added.
  - `top-start`
  - `top-end`
  - `bottom-start`
  - `bottom-end`
  - `left-start`
  - `left-end`
  - `right-start`
  - `right-end`

### Breaking Changes

- `centered` prop is removed, now `top` | `left` | `right` | `bottom` is centered by default.

<br>

## 0.1.1

- Now Wowerlay will close child Wowerlays on click itself.

- `centered` prop added, if true wowerlay will be centered.

<br>

## 0.1.0

- `Fixed` prop is added

- `vertical-gap` and `horizontal-gap` props added. With these props spacing between Wowerlay and target element can be configurable.

- 'position' prop is added. If set `bottom | right | left | top` Wowerlay will try to be mounted to given direction, if can't it will try opposite side.

- Reactive `target` prop support is added. Now wowerlay will react when `target` element changes and will follow it.

- Demo page added to Readme

<br>

## 0.0.1

- First Ready to use build.
