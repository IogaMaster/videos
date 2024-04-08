import { makeProject } from '@motion-canvas/core';

import example from './scenes/example?scene';
import audio from "./audio/audio.wav"

import { Code, LezerHighlighter } from '@motion-canvas/2d';
import { parser } from 'lezer-parser-nix';
import { CodeStyle } from 'components'

Code.defaultHighlighter = new LezerHighlighter(parser, CodeStyle);

export default makeProject({
    scenes: [example],
    audio: audio
});
