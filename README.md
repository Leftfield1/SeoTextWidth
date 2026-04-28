# SEO Text Width

ProcessWire admin helper for measuring SEO title and meta description length by rendered pixel width.

## Features

- Adds live pixel-width guidance below configured SEO title and SEO description fields.
- Supports regular and multilingual text/textarea fields.
- Shows English status labels: `Too short`, `Good length`, and `Too long`.
- Uses configurable minimum and maximum pixel thresholds.
- Loads only in the ProcessWire page editor.

## Default Thresholds

- SEO title: `200-580 px`
- SEO description: `400-920 px`

These values can be changed in the module settings.

## Configuration

Install the module, then choose:

- SEO title field
- SEO description field
- Minimum and maximum width for each field

On multilingual fields, the module attaches to each rendered language input automatically.
