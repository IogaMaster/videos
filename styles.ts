// Catppuccin Mocha (Dark)

export function setupView(view: any) {
    view.fill(Colors.background);
}

export const Colors = {
    text: '#cdd6f4',
    background: '#11111b',
    base: '#1e1e2e',

    red: '#f38ba8',
    green: '#a6e3a1',
    blue: '#89b4fa',
};

export const BaseFont = {
    fontFamily: 'JetBrains Mono',
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
