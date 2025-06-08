# Fonts Directory

This directory contains custom font files for the Deutsch123 application.

## Required Font Files

To use the custom Geist font, please add the following files to this directory:

- `Geist-Regular.woff2` - Regular weight font file
- `Geist-Medium.woff2` - Medium weight font file (optional)
- `Geist-Bold.woff2` - Bold weight font file (optional)

## How to Add Font Files

1. Download the Geist font files from the official source
2. Place the `.woff2` files in this directory
3. Update the `@font-face` declarations in `app/globals.css` if needed

## Font Usage

The Geist font is automatically applied to the entire application through:
- CSS `@font-face` declaration in `app/globals.css`
- Tailwind CSS configuration in `tailwind.config.ts`
- HTML element font-family setting

## Fallback Fonts

If the Geist font fails to load, the application will fall back to:
1. Inter font (from Google Fonts)
2. System sans-serif fonts 