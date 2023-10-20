import { Img, makeScene2D, Layout, Rect, Txt, Video } from '@motion-canvas/2d';
import { all, createRef, easeInOutCubic, Vector2, waitFor, waitUntil } from '@motion-canvas/core';
import { CodeStyle, setupView, slideIn, slideOut, WhiteLabel, Window } from 'components';
import {
    CodeBlock,
    edit,
    insert,
    lines,
    remove,
} from "@motion-canvas/2d/lib/components/CodeBlock";

import git from "../../../../videos/lazygit/src/assets/git.svg";
import neovimImage from "../assets/Neovim.png";
import recording from "../assets/recording.mp4";

export default makeScene2D(function*(view) {
    setupView(view)

    const logoContainerRef = createRef<Rect>();
    const logoTextRef = createRef<Txt>();
    view.add(
        <Rect ref={logoContainerRef} scale={1.5} y={-2000} zIndex={-15}>
            <Img src={git} scale={2} />
            <Txt {...WhiteLabel} ref={logoTextRef} fontSize={58} y={160}>
                Lazygit
            </Txt>
        </Rect>,
    );
    const txtRef = createRef<Txt>();
    view.add(
        <Txt {...WhiteLabel} fontSize={100} y={550} ref={txtRef} />
    );


    yield* waitUntil("lazygit");
    yield* txtRef().text("lazygit.nvim", 0.3);
    yield* logoContainerRef().y(0, 0.5);

    yield* waitUntil("integrates");
    yield* txtRef().text("Integrates", 0.3);

    yield* waitUntil("amazing");
    yield* txtRef().text("The amazing", 0.3);

    yield* waitUntil("lazygit plugin");
    yield* txtRef().text("Lazygit CLI", 0.3);

    yield* waitUntil("right into");
    yield txtRef().text("Right into Neovim", 0.3);

    const neovim = createRef<Img>();
    view.add(<Img src={neovimImage} ref={neovim} scale={0.7} x={1000} />)
    yield* all(slideOut(logoContainerRef, [-2000, 0]), slideIn(neovim))

    yield* waitUntil("installing");
    yield* txtRef().text("Installing is ", 0.3);

    yield* waitUntil("simple");
    yield txtRef().text("Simple", 0.3);
    yield* slideOut(neovim, [0, -2000])

    yield* waitUntil("config");
    yield txtRef().text("Here's the config", 0.3);
    const windowRef = createRef<Window>();
    const codeBlockRef = createRef<CodeBlock>();
    yield view.add(<Window title={"Editor"} ref={windowRef} size={0} y={-100}>
        <Layout direction={'column'} width={960} gap={40} layout>
            <CodeBlock {...CodeStyle} fontSize={48} ref={codeBlockRef} language="lua" code={`
-- Lazy.nvim
{
    "kdheepak/lazygit.nvim",
    dependencies = {
        "nvim-lua/plenary.nvim",
    },
},

-- Packer
use({
    "kdheepak/lazygit.nvim",
    requires = {
        "nvim-lua/plenary.nvim",
    },
})

-- Vim Plug
Plug 'kdheepak/lazygit.nvim'
            `} />
        </Layout>
    </Window>)
    yield* windowRef().size([1000, 1020], 0.6, easeInOutCubic, Vector2.arcLerp)


    yield* waitUntil("lazy");
    yield txtRef().text("For Lazy.nvim", 0.3);

    yield* waitUntil("packer");
    yield txtRef().text("Packer and", 0.3);

    yield* waitUntil("vim plug");
    yield txtRef().text("Vim Plug", 0.3);

    yield* waitUntil("plugin name");
    yield txtRef().text("lazygit.nvim", 0.3);

    yield* waitUntil("number");
    yield txtRef().text("Has numerous", 0.3);
    yield windowRef().close()

    yield* waitUntil("configuration");
    yield txtRef().text("Configuration", 0.3);

    yield codeBlockRef().fontSize(28)
    yield windowRef().y(-220)
    yield codeBlockRef().edit(0.01)`
vim.g.lazygit_floating_window_winblend = 0 
vim.g.lazygit_floating_window_scaling_factor = 0.9 
vim.g.lazygit_floating_window_border_chars = {'╭','─', ... }
vim.g.lazygit_floating_window_use_plenary = 0 
vim.g.lazygit_use_neovim_remote = 1 

vim.g.lazygit_use_custom_config_file_path = 0
vim.g.lazygit_config_file_path = ''
-- OR
vim.g.lazygit_config_file_path = {}

-- VimScript
vim.cmd [[
    let g:lazygit_floating_window_winblend = 0
    let g:lazygit_floating_window_scaling_factor = 0.9
    let g:lazygit_floating_window_border_chars = ['╭', ... ]
    let g:lazygit_floating_window_use_plenary = 0 
    let g:lazygit_use_neovim_remote = 1 
    
    let g:lazygit_use_custom_config_file_path = 0 
    let g:lazygit_config_file_path = ''
    " OR
    let g:lazygit_config_file_path = [] 
]]
`
    yield codeBlockRef().selection(lines(0, 3000), 0.001)
    yield windowRef().open()
    yield windowRef().size([1000, 1400], 0.6, easeInOutCubic, Vector2.arcLerp)

    yield* waitUntil("options");
    yield txtRef().text("Options", 0.3);

    yield* waitUntil("configurable");
    yield txtRef().text("It's configurable", 0.3);

    yield* waitUntil("both lua");
    yield txtRef().text("In lua and ", 0.3);

    yield* waitUntil("vimscoprs");
    yield txtRef().text("VimScript", 0.3);
    yield* windowRef().close()

    yield* waitUntil("i set a");
    yield txtRef().text("I set a keybind", 0.3);

    yield* waitUntil("in my");
    yield txtRef().text("In my config", 0.3);

    const windowTwoRef = createRef<Window>();
    const codeBlockTwoRef = createRef<CodeBlock>();
    yield view.add(<Window title={"Editor"} ref={windowTwoRef} size={0} y={-100}>
        <Layout direction={'column'} width={960} gap={40} layout>
            <CodeBlock {...CodeStyle} fontSize={48} ref={codeBlockTwoRef} language="lua" code={`
-- Lazy.nvim
return {
  'kdheepak/lazygit.nvim',
  keys = {
    { '<leader>gg', 
      '<cmd>LazyGit<cr>', 
      desc = 'Git' 
    },
  },
}
            `} />
        </Layout>
    </Window>)
    yield* windowTwoRef().size([1000, 1020], 0.6, easeInOutCubic, Vector2.arcLerp)

    yield* waitUntil("to run lazygit");
    yield txtRef().text("To run lazygit", 0.3);
    const videoRef = createRef<Video>();
    view.add(<Video src={recording} ref={videoRef} scale={1.2} x={30} y={-2000} />)
    yield videoRef().play();
    yield videoRef().y(-60, 0.5)
    yield txtRef().y(750, 0.4)

    yield* waitUntil("with");
    yield txtRef().text("With: SPC g g", 0.3);

    yield* waitUntil("whats your");
    yield txtRef().text("Whats your", 0.3);
    yield windowTwoRef().close()

    yield* waitUntil("favorite");
    yield txtRef().text("Favorite", 0.3);

    yield* waitUntil("neovim plugin");
    yield txtRef().text("Neovim Plugin", 0.3);

    yield* waitUntil("how");
    yield txtRef().text("How has it", 0.3);
    yield videoRef().pause();
    yield videoRef().y(-2000, 0.5)

    yield* waitUntil("impove");
    yield txtRef().text("Improved your", 0.3);

    yield* waitUntil("editing");
    yield txtRef().text("Editing experience", 0.3);

    yield* waitUntil("remove text");
    yield txtRef().text("", 0.3);


    yield* waitUntil("done");
});
