export interface TerminalProps extends RectProps {
    cursorType?: 'none' | 'line' | 'block',
    blinkSpeed?: number
};

export class Terminal extends Rect {

    public textStyle = {
        fill: '#eee',
        fontFamily: 'JetBrains Mono',
        fontSize: 48,
        height: 64,
    };

    protected cursor = new Rect({
        width: 32,
        height: '100%',
        fill: "white",
    });
    protected cursorBlinkTask: any = null;

    public constructor(props: TerminalProps) {
        super({
            layout: true,
            direction: 'column',
            size: [1200, 800],
            fill: "#222",
            radius: 16,
            padding: 32,
            textWrap: 'pre',
            clip: true,
            ...props,
        });
    }

    public *blink(enable: boolean = true): ThreadGenerator {
        if (enable) {
            this.cursorBlinkTask = yield loop(Infinity, function*(this: Terminal) {
                this.cursor.fill(null);
                yield* waitFor(this.blinkSpeed() / 2);
                this.cursor.fill('white');
                yield* waitFor(this.blinkSpeed() / 2);
            }.bind(this));
        } else {
            if (this.cursorBlinkTask !== null) {
                cancel(this.cursorBlinkTask);
                this.cursor.fill('white');
                this.cursorBlinkTask = null;
            }
        }
    }

    public *prompt() {
        this.add(
            <Rect layout>
                <Text text={'$ '} {...this.textStyle} fill="#4d3" fontWeight={800} />
                {this.cursor}
            </Rect>
        )
        yield* this.blink();
        return this;
    }

    public *type(content: string, time: number, timingFunction?: TimingFunction, interpolationFunction?: InterpolationFunction<string>) {
        yield* this.blink(false);
        const last = this.children()[this.children().length - 1];
        const text = createRef<Text>();
        last.add(
            <Text ref={text} {...this.textStyle} />
        )
        last.add(this.cursor)
        yield* text().text(content, time, timingFunction, interpolationFunction);
        yield* this.blink();
    }

    public newline() {
        this.add(
            <Rect layout>
                <Text {...this.textStyle} />
                {this.cursor}
            </Rect>
        )
    }

    public line(content: string) {
        let [first, ...lines] = content.split('\n');
        let last = this.children()[this.children().length - 1];
        debug(last.children().map(i => Object.getPrototypeOf(i).constructor == Text));
        let textElems = last.children().filter((i): i is Text => Object.getPrototypeOf(i).constructor === Text)
        let lastText = textElems[textElems.length - 1];
        lastText.text(lastText.text() + first);
        lines.map(l => {
            this.add(
                <Rect layout>
                    <Text text={l} {...this.textStyle} />
                </Rect>
            )
        })
    }
}
