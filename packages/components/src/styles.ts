import { HighlightStyle } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
// Catppuccin Mocha (Dark)

export function setupView(view: any) {
    view.fill(Colors.crust);
}

export const Colors = {
    rosewater: "#f5e0dc",
    flamingo: "#f2cdcd",
    pink: "#f5c2e7",
    mauve: "#cba6f7",
    red: "#f38ba8",
    maroon: "#eba0ac",
    peach: "#fab387",
    yellow: "#f9e2af",
    green: "#a6e3a1",
    teal: "#94e2d5",
    sky: "#89dceb",
    sapphire: "#74c7ec",
    blue: "#89b4fa",
    lavender: "#b4befe",
    text: "#cdd6f4",
    subtext1: "#bac2de",
    subtext0: "#a6adc8",
    overlay2: "#9399b2",
    overlay1: "#7f849c",
    overlay0: "#6c7086",
    surface2: "#585b70",
    surface1: "#45475a",
    surface0: "#313244",
    base: "#1e1e2e",
    mantle: "#181825",
    crust: "#11111b",
};

export const BaseFont = {
    fontFamily: "JetBrains Mono",
    fontWeight: 700,
    fontSize: 28,
};

export const WhiteLabel = {
    ...BaseFont,
    fill: Colors.text,
};

export const Container = {
    fill: Colors.base,
    gap: 58,
    radius: 20,
    padding: 10,
    layout: true,
};

export const CodeBlockStyle = {
    fontFamily: "JetBrains Mono",
    fontWeight: 600,
    fontSize: 16 * 1.75,
    lineHeight: 16 * 3.25,
    theme: {
        stringContent: { text: Colors.green },
        stringPunctuation: { text: Colors.green },
        comment: { text: Colors.overlay0 },
        literal: { text: Colors.peach },
        keyword: { text: Colors.lavender },
        entityName: { text: Colors.red },
    },
};

export const CodeStyle = HighlightStyle.define(
    [
        { tag: t.keyword, color: Colors.lavender },
        {
            tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
            color: '#88c0d0',
        },
        { tag: [t.variableName], color: '#8fbcbb' },
        { tag: [t.function(t.variableName)], color: Colors.red },
        { tag: [t.labelName], color: '#81a1c1' },
        {
            tag: [t.color, t.constant(t.name), t.standard(t.name)],
            color: '#',
        },
        { tag: [t.definition(t.name), t.separator], color: '#a3be8c' },
        { tag: [t.brace], color: '#8fbcbb' },
        {
            tag: [t.annotation],
            color: '#d30102',
        },
        {
            tag: [t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
            color: '#b48ead',
        },
        {
            tag: [t.typeName, t.className],
            color: '#ECEFF4',
        },
        {
            tag: [t.operator, t.operatorKeyword],
            color: '#a3be8c',
        },
        {
            tag: [t.tagName],
            color: '#b48ead',
        },
        {
            tag: [t.squareBracket],
            color: '#ECEFF4',
        },
        {
            tag: [t.angleBracket],
            color: '#ECEFF4',
        },
        {
            tag: [t.attributeName],
            color: '#eceff4',
        },
        {
            tag: [t.regexp],
            color: '#',
        },
        {
            tag: [t.quote],
            color: '#b48ead',
        },
        { tag: [t.string], color: '#a3be8c' },
        {
            tag: t.link,
            color: '#a3be8c',
            textDecoration: 'underline',
            textUnderlinePosition: 'under',
        },
        {
            tag: [t.url, t.escape, t.special(t.string)],
            color: '#8fbcbb',
        },
        { tag: [t.meta], color: '#88c0d0' },
        { tag: [t.monospace], color: '#d8dee9', fontStyle: 'italic' },
        { tag: [t.comment], color: Colors.overlay0, fontStyle: 'italic' },
        { tag: t.strong, fontWeight: 'bold', color: '#' },
        { tag: t.emphasis, fontStyle: 'italic', color: '#' },
        { tag: t.strikethrough, textDecoration: 'line-through' },
        { tag: t.heading, fontWeight: 'bold', color: '#' },
        { tag: t.special(t.heading1), fontWeight: 'bold', color: '#' },
        { tag: t.heading1, fontWeight: 'bold', color: '#' },
        {
            tag: [t.heading2, t.heading3, t.heading4],
            fontWeight: 'bold',
            color: '#',
        },
        { tag: [t.atom, t.bool, t.special(t.variableName)], color: '#d08770' },
        {
            tag: [t.processingInstruction, t.inserted],
            color: '#8fbcbb',
        },
        {
            tag: [t.contentSeparator],
            color: '#ebcb8b',
        },
        { tag: t.invalid, color: '#434c5e', borderBottom: `1px dotted #d30102` },
    ]
);
